import fs from 'fs'
// const P = require('path')
import { streamToBuffer } from '@calipsa/stream-utils'

import { getVideoSnapshots } from '../src'

const FILE = 'alleged-no-frames.webm'

const getSnapshots = (input: Parameters<(typeof getVideoSnapshots)>[0]['input']) =>
  getVideoSnapshots({
    input,
    rate: 1,
    format: 'jpg',
    logError: console.error,
  })

async function main() {
  const path = `${__dirname}/videos/${FILE}`
  const incomingBuffer = await streamToBuffer(fs.createReadStream(path))
  const buffers = await getSnapshots(incomingBuffer)
  console.log('buffers', buffers)
}

main()
