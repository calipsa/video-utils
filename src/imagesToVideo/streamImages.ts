import { Writable } from 'stream'

import { PathOrReadable } from '../types'
import imageToStream from './imageToStream'

export default async (imageInputs: PathOrReadable[], ffmpegInput: Writable) => {
  for (const imageInput of imageInputs) {
    await imageToStream(imageInput, ffmpegInput)
  }
  ffmpegInput.end()
}
