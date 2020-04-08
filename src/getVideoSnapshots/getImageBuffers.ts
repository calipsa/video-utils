import ffmpeg from 'fluent-ffmpeg'
// eslint-disable-next-line import/order
import {
  StreamWithFrames,
  bufferToStream,
} from '@calipsa/stream-utils'

import type { Input } from '../types'

export default (input: Input, rate: number, format: string) =>
  new Promise<Buffer[]>((resolve, reject) => {
    const outStream = new StreamWithFrames(rate)

    const vcodec = format === 'png' ? 'png' : 'mjpeg'

    if (Buffer.isBuffer(input)) {
      // eslint-disable-next-line no-param-reassign
      input = bufferToStream(input)
    }

    const proc = ffmpeg(input)
      .output(outStream, { end: true })
      .noAudio()
      .format('image2pipe') // -f
      .videoCodec(vcodec) // -vcodec
      .size('640x480')
      .outputOption('-q:v', '2')
      .on('error', reject)
      // .on('start', commandLine => {
      //   console.log(`Spawned Ffmpeg with command: ${commandLine}`)
      // })
      .on('end', () => {
        resolve(outStream.buffers)
      })

    proc.run()
  })
