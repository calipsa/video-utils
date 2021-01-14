import { promises as fsPromises } from 'fs'

import * as tmp from 'tmp-promise'

import getMetadata from './getMetadata'

type Input = Buffer | string

export default async (input: Input) => {
  if (typeof input === 'string') {
    return getMetadata(input)
  }

  const { path, cleanup } = await tmp.file()
  try {
    await fsPromises.writeFile(path, input, 'binary')
    return await getMetadata(path)
  } finally {
    cleanup()
  }
}
