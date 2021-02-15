import * as tmp from 'tmp-promise'
import type { FfmpegCommand } from 'fluent-ffmpeg'

import type { Input } from '../types'
import writePolymorphic from '../utils/writePolymorphic'
// import noop from '../utils/noop'

import getImageBuffers from './getImageBuffers'

interface Options {
  input: Input,
  rate: number,
  format: 'jpg' | 'png',
  logError: (...args: any[]) => void,
  configureFfmpeg?: (ffmpegCommand: FfmpegCommand) => void,
}

export default async ({
  input,
  rate = 1,
  format = 'jpg',
  // logError = noop,
  configureFfmpeg,
}: Options) => {
  if (typeof input === 'string') {
    // eslint-disable-next-line no-return-await
    return await getImageBuffers(input, rate, format, configureFfmpeg)
  }

  const { path, cleanup } = await tmp.file()
  try {
    await writePolymorphic(path, input)
    return await getImageBuffers(path, rate, format, configureFfmpeg)
  } finally {
    await cleanup()
  }
}
