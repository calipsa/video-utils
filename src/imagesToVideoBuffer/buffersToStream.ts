import { PassThrough } from 'stream'

export default (buffers: Buffer[]) => {
  const imagesStream = new PassThrough()

  // repeat for every image...
  for (const buf of buffers) {
    imagesStream.write(buf, 'binary')
  }

  // then finally end the stream
  imagesStream.end()

  return imagesStream
}
