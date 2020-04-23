const fs = require('fs')
const Path = require('path')
const { streamToBuffer } = require('@calipsa/stream-utils')
const {
  isEqual,
  identity,
} = require('lodash')

const { imagesToVideo } = require('../dist')
const getHash = require('./utils/getHash')

const DIR = Path.join(__dirname, 'images')
const imageFileNames = fs.readdirSync(DIR).filter(name => name.endsWith('.jpg'))
const imagePaths = imageFileNames.sort().map(n => Path.join(DIR, n))

const pathToInput = {
  string: identity,
  stream: path => fs.createReadStream(path),
  // buffer: flow(fs.createReadStream, streamToBuffer),
}

describe('Images to video', () => {
  beforeEach(() => {
    jest.setTimeout(120000)
  })

  it('Should convert images to video', async () => {
    const fileNames = await fs.promises.readdir(DIR)
    const o = {}
    const types = Object.keys(pathToInput)
    const promises = types.map(async (type) => {
      const f = pathToInput[type]
      const imagePromises = imagePaths.map(f)
      const images = await Promise.all(imagePromises)
      const stream = imagesToVideo({
        images,
        fps: 10,
      })
      const buffer = await streamToBuffer(stream)
      return getHash(buffer)
    })

    for (let i = 0; i < types.length; ++i) {
      const type = types[i]
      o[type] = await promises[i]
      if (i > 0) {
        const areIdentical = isEqual(o[type], o[types[0]])
        expect(o[type]).toEqual(o[types[0]])
      }
    }

    expect(o).toMatchSnapshot()
  })
})
