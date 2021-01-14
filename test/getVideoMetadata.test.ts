import fs from 'fs'
// const P = require('path')
import { streamToBuffer } from '@calipsa/stream-utils'
import {
  identity,
  flow,
  omit,
} from 'lodash'

import { getVideoMetadata } from '../src'
import getHash from './utils/getHash'

const files = [
  'building.mp4',
  'building.wmv',
]

const pathToInput = {
  string: identity,
  buffer: flow(fs.createReadStream, streamToBuffer),
} as const

async function getHashes(path, type) {
  const f = pathToInput[type]
  const input = await f(path)
  const metadata = await getVideoMetadata(input)
  return omit(metadata, [
    'format.filename',
  ])
}

describe('Get video metdata', () => {
  beforeEach(() => {
    jest.setTimeout(120000)
  })

  for (const file of files) {
    it(`Should get metadata (${file})`, async () => {
      console.log(file)
      const path = `${__dirname}/videos/${file}`
      const types = Object.keys(pathToInput)
      const metadataPromises = types.map(type => getHashes(path, type))
      const o = {}
      for (let i = 0; i < types.length; ++i) {
        const type = types[i]
        const p = metadataPromises[i]
        o[type] = await p
        if (i > 0) {
          expect(o[type]).toEqual(o[types[0]])
        }
      }
      expect(o).toMatchSnapshot()
    })
  }
})
