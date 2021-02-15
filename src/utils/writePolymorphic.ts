import fs from 'fs'
import type { Readable } from 'stream'

import { pump } from '@calipsa/stream-utils'

export default (path: string, input: Buffer | Readable) => {
  if (Buffer.isBuffer(input)) {
    return fs.promises.writeFile(path, input, 'binary')
  }
  const out = fs.createWriteStream(path, 'binary')
  return pump(input, out)
}
