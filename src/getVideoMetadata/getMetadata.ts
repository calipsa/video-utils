import ffmpeg, { FfprobeData } from 'fluent-ffmpeg'

export default (path: string) =>
  new Promise<FfprobeData>((resolve, reject) => {
    ffmpeg.ffprobe(path, (err, metadata) => {
      if (err) {
        return reject(err)
      }
      resolve(metadata)
    })
  })
