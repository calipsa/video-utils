import { promises as fsPromises } from 'fs'

import { readable as isStreamReadable } from 'is-stream'
import { streamToBuffer } from '@calipsa/stream-utils'

import type { Input } from '../types'

export default (imageInput: Input) =>
  Buffer.isBuffer(imageInput)
    ? Promise.resolve(imageInput)
    : isStreamReadable(imageInput)
      ? streamToBuffer(imageInput)
      : fsPromises.readFile(imageInput, null)
