import fs from 'fs'
import Path from 'path'
import { streamToBuffer } from '@calipsa/stream-utils'
import { identity } from 'lodash'

import { imagesToVideoStream } from '../src'
import getHash from './utils/getHash'

const formats = [
  'wmv',
  'mp4',
] as const

const IMAGES_DIR = Path.join(__dirname, 'images')
const imageFileNames = fs.readdirSync(IMAGES_DIR).filter(name => name.endsWith('.jpg'))
const imagePaths = imageFileNames.sort().map(n => Path.join(IMAGES_DIR, n))

const pathToInput = {
  string: identity,
  stream: (path: string) => fs.createReadStream(path),
  buffer: (path: string) => fs.promises.readFile(path, null)
} as const

describe('Images to video stream', () => {
  beforeEach(() => {
    jest.setTimeout(120000)
  })

  it('Should convert images to video', async () => {
    const fileNames = await fs.promises.readdir(IMAGES_DIR)
    for (const format of formats) {
      const types = Object.keys(pathToInput)
      const bufferPromises = types.map(async (type) => {
        const f = pathToInput[type]
        const imagePromises = imagePaths.map(f) as any[]
        const images = await Promise.all(imagePromises)
        const stream = imagesToVideoStream({
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
        const v = await promises[i]
        expect(v).toEqual(first)
      }  
    }
  })
})
