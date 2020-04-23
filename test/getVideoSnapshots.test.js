const fs = require('fs')
// const P = require('path')
const { streamToBuffer } = require('@calipsa/stream-utils')
const {
  isEqual,
  identity,
  flow,
} = require('lodash')

const { getVideoSnapshots } = require('../dist')
const getHash = require('./utils/getHash')

const files = [
  'building.mp4',
  'building.wmv',
]

const pathToInput = {
  string: identity,
  stream: path => fs.createReadStream(path),
  buffer: flow(fs.createReadStream, streamToBuffer),
}

const getSnapshost = (input) =>
  getVideoSnapshots({
    input,
    rate: 1,
    format: 'jpg',
    logError: console.error,
  })

async function getHashes(path, type) {
  const f = pathToInput[type]
  const input = await f(path)
  const snapshots = await getSnapshost(input)
  // if (type === 'string' && path.endsWith('.mp4')) {
  //   for (let i = 0; i < snapshots.length; ++i) {
  //     if (i % 10) {
  //       continue
  //     }
  //     const j = i / 10
  //     const nimi = `${j.toString().padStart(2, '0')}.jpg`
  //     fs.writeFileSync(P.resolve(path, '../../images', nimi), snapshots[j], {
  //       encoding: 'binary',
  //     })
  //   }
  // }
  return snapshots.map(getHash)
}

describe('Get video snapshots', () => {
  beforeEach(() => {
    jest.setTimeout(120000)
  })

  for (const file of files) {
    it(`Should convert (${file}) to images`, async () => {
      console.log(file)
      const path = `${__dirname}/videos/${file}`
      const types = Object.keys(pathToInput)
      const hashesPromises = types.map(type => getHashes(path, type))
      const o = {}
      for (let i = 0; i < types.length; ++i) {
        const type = types[i]
        const p = hashesPromises[i]
        o[type] = await p
        if (i > 0) {
          expect(o[type]).toEqual(o[types[0]])
        }
      }
      // await Promise.all(hashesPromises)
      expect(o).toMatchSnapshot()
    })
  }
})
