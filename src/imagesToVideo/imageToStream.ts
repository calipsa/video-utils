import { createReadStream } from 'fs'
import { Writable } from 'stream'

import { readable as isStreamReadable } from 'is-stream'
import { bufferToStream } from '@calipsa/stream-utils'

import type { Input } from '../types'

export default (imageInput: Input, ffmpegInput: Writable) =>
  new Promise<void>((resolve, reject) => {
    const input = isStreamReadable(imageInput)
      ? imageInput
      : Buffer.isBuffer(imageInput)
        ? bufferToStream(imageInput)
        : createReadStream(imageInput)

    // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
    const stream = input
      .on('end', resolve)
      .on('error', reject)
      .pipe(ffmpegInput, {
        end: false,
      })
  })
