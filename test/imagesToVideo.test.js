const fs = require('fs')
const Path = require('path')
const { streamToBuffer } = require('@calipsa/stream-utils')
const { identity } = require('lodash')

const { imagesToVideo } = require('../dist')
const getHash = require('./utils/getHash')

const formats = [
  'wmv',
  'mp4',
]

const IMAGES_DIR = Path.join(__dirname, 'images')
const imageFileNames = fs.readdirSync(IMAGES_DIR).filter(name => name.endsWith('.jpg'))
const imagePaths = imageFileNames.sort().map(n => Path.join(IMAGES_DIR, n))

const pathToInput = {
  string: identity,
  stream: path => fs.createReadStream(path),
  buffer: path => fs.promises.readFile(path, null)
}

describe('Images to video', () => {
  beforeEach(() => {
    jest.setTimeout(120000)
  })

  it('Should convert images to video', async () => {
    const fileNames = await fs.promises.readdir(IMAGES_DIR)
    for (const format of formats) {
      const types = Object.keys(pathToInput)
      const bufferPromises = types.map(async (type) => {
        const f = pathToInput[type]
        const imagePromises = imagePaths.map(f)
        const images = await Promise.all(imagePromises)
        const stream = imagesToVideo({
          images,
          format,
          fps: 10,
        })
        return await streamToBuffer(stream)
      })

      const firstBuffer = await bufferPromises[0]
      // await fs.promises.writeFile(`./video.${format}`, firstBuffer)

      const promises = bufferPromises.map(p => p.then(getHash))

      const first = await promises[0]
      expect(first).toMatchSnapshot(format)
  
      for (let i = 1; i < types.length; ++i) {
        const type = types[i]
        const v = await promises[i]
        expect(v).toEqual(first)
      }  
    }
  })
})
