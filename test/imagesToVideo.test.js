const fs = require('fs')
const Path = require('path')
const { streamToBuffer } = require('@calipsa/stream-utils')
const { identity } = require('lodash')

const { imagesToVideo } = require('../dist')
const getHash = require('./utils/getHash')

const formats = [
  'wmv',
]

const DIR = Path.join(__dirname, 'images')
const imageFileNames = fs.readdirSync(DIR).filter(name => name.endsWith('.jpg'))
const imagePaths = imageFileNames.sort().map(n => Path.join(DIR, n))

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
    const fileNames = await fs.promises.readdir(DIR)
    for (const format of formats) {
      const types = Object.keys(pathToInput)
      const promises = types.map(async (type) => {
        const f = pathToInput[type]
        const imagePromises = imagePaths.map(f)
        const images = await Promise.all(imagePromises)
        const stream = imagesToVideo({
          images,
          format,
          fps: 10,
        })
        const buffer = await streamToBuffer(stream)
        return getHash(buffer)
      })

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
