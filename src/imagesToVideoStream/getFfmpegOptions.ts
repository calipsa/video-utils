type Format = 'wmv' | 'mp4'

const options = {
  mp4: {
    f: 'mpegts',
    vcodec: 'libx264',
    pix_fmt: 'yuv420p',
    tune: 'zerolatency',
    preset: 'ultrafast',
    movflags: 'faststart',
  },
  wmv: {
    f: 'avi',
    vcodec: 'wmv2',
    // buffer: true,
  },
} as const

export default (format: Format) => {
  if (!(format in options)) {
    throw new Error(`Invalid format: ${format}`)
  }
  return options[format]
}
