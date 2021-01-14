import { promises as fsPromises } from 'fs'

import * as tmp from 'tmp-promise'
import type { FfmpegCommand } from 'fluent-ffmpeg'

import type { Input } from '../types'
import noop from '../utils/noop'

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
  logError = noop,
  configureFfmpeg,
}: Options) => {
  try {
    return await getImageBuffers(input, rate, format, configureFfmpeg)
  } catch (err) {
    if (!Buffer.isBuffer(input)) {
      throw err
    }
    logError(err, 'Conversion failed. Retrying with temp file')
    const { path, cleanup } = await tmp.file()
    try {
      await fsPromises.writeFile(path, input, 'binary')
      return await getImageBuffers(path, rate, format, configureFfmpeg)
    } finally {
      cleanup()
    }
  }
}
