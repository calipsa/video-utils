import fs from 'fs'

import ffmpeg from 'fluent-ffmpeg'

import tmp from 'tmp-promise'

import type { Input } from '../types'

import inputToBuffer from './inputToBuffer'
import buffersToStream from './buffersToStream'

export default async (images: Input[], fps: number) => {
  const imageBufferPromises = images.map(inputToBuffer)
  const imageBuffers = await Promise.all(imageBufferPromises)
  const imagesStream = buffersToStream(imageBuffers)

  const { path, cleanup } = await tmp.file()
  try {
    await new Promise<Buffer>((resolve, reject) => {
      const proc = ffmpeg(imagesStream)
        .withInputFps(fps)
        .output(path, { end: true })
        .withFpsOutput(fps)
        .noAudio()
        .format('mp4') // -f
        .videoCodec('libx264') // -vcodec
        .size('640x480')
        .outputOption('-pix_fmt', 'yuv420p')
        .outputOption('-tune', 'zerolatency')
        .outputOption('-preset', 'ultrafast')
        .outputOption('-movflags', 'faststart')
        // .outputOption('-q:v', '2')
        .on('error', reject)
        // .on('start', commandLine => {
        //   console.log(`Spawned Ffmpeg with command: ${commandLine}`)
        // })
        .on('end', () => {
          resolve()
        })

      proc.run()
    })

    return fs.promises.readFile(path, null)
  } finally {
    cleanup()
  }
}
