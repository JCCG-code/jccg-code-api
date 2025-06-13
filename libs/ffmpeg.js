import { spawn } from 'node:child_process'
// Errors
import HttpError from '../errors/HttpError.js'

export const saveMp3File = async (filename, pcmData, sampleRate = 24000) => {
  return new Promise((resolve, reject) => {
    // FFmpeg arguments
    const ffmpegArgs = [
      // signed 16-bit little-endian PCM
      '-f',
      's16le',
      // Sample rate
      '-ar',
      `${sampleRate}`,
      // Mono config
      '-ac',
      '1',
      // 'pipe' 0 (stdin)
      '-i',
      'pipe:0',

      // Output arguments
      // Overwrite
      '-y',
      // Bitrate
      '-b:a',
      '128k',
      // Without metadata
      '-map_metadata',
      '-1',
      // Output filename
      filename
    ]

    // Starts FFmpeg process
    const ffmpegProcess = spawn('ffmpeg', ffmpegArgs)
    // Writes pcm data into ffmpeg stdin
    ffmpegProcess.stdin.write(pcmData)
    ffmpegProcess.stdin.end()
    // Error output catching
    let errorOutput = ''
    ffmpegProcess.stderr.on('data', (data) => {
      errorOutput += data.toString()
    })
    // Process finished
    ffmpegProcess.on('close', (code) => {
      if (code === 0) {
        console.log(
          `[Server] FFmpeg finished successfully. File saved: ${filename}`
        )
        // Extracting audio duration
        resolve()
      } else {
        throw new HttpError({
          status: code,
          message: errorOutput
        })
      }
    })
    // Error during the process
    ffmpegProcess.on('error', (err) => {
      console.error('[Server ERROR] FFmpeg cannot be executed')
      reject(err)
    })
  })
}
