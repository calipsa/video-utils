import type { Input } from '../types'

import convert from './convert'

interface Params {
  images: Input[],
  fps: number,
}

export default ({
  images,
  fps,
}: Params) => convert(images, fps)
