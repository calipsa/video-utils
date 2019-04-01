import { createReadStream } from 'fs'
import { Writable } from 'stream'
import { readable as isStreamReadable } from 'is-stream'

import { PathOrReadable } from '../types'

export default (imageInput: PathOrReadable, ffmpegInput: Writable) =>
  new Promise<void>((resolve, reject) => {
    const input = isStreamReadable(imageInput)
      ? imageInput
      : createReadStream(imageInput)

    const stream = input
      .on('end', resolve)
      .on('error', reject)
      .pipe(ffmpegInput, {
        end: false,
      })
  })