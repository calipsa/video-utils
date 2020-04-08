import { Writable } from 'stream'

import { ffmpeg } from 'ffmpeg-stream'

import type { PathOrReadable } from '../types'
import streamImages from './streamImages'

interface Params {
  images: PathOrReadable[],
  fps: number,
}

export default ({
  images,
  fps,
}: Params) => {
  const converter = ffmpeg()

  const input = converter.input({
    f: 'image2pipe',
    r: fps,
  }) as Writable

  // const output = converter.output({
  //   f: 'mpegts',
  //   vcodec: 'mpeg2video',
  //   tune: 'zerolatency',
  //   preset: 'ultrafast',
  //   'q:v': 1,
  // })

  const output = converter.output({
    f: 'avi',
    vcodec: 'wmv2',
    // buffer: true,
  })

  streamImages(images, input)
  converter.run()

  return output
}
