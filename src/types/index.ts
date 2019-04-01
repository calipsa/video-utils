import { Readable } from 'stream'

export type PathOrReadable = string | Readable
export type Input = PathOrReadable | Buffer
