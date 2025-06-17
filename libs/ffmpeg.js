import fs from 'fs'
import { spawn } from 'node:child_process'
import { v4 as uuidv4 } from 'uuid'
// Errors
import HttpError from '../errors/HttpError.js'

export const saveMp3File = async (
  filename,
  pcmData,
  sampleRate = 24000,
  channels = 1
) => {
  return new Promise((resolve, reject) => {
    // FFmpeg arguments
    const ffmpegArgs = [
      // signed 16-bit little-endian PCM
      '-f',
      's16le',
      // Sample rate
      '-ar',
      `${sampleRate}`,
      // Channels config
      '-ac',
      `${channels}`,
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

export const saveMp4File = async (args) => {
  const command = 'ffmpeg'

  return new Promise((resolve, reject) => {
    console.log(`[FFmpeg] Emsambling video. Please wait...`)
    const ffmpegProcess = spawn(command, args)

    let stderrOutput = ''
    let lastProgressLogTime = 0
    ffmpegProcess.stdout.on('data', (data) => {
      console.log(`[FFmpeg STDOUT]: ${data.toString()}`)
    })

    ffmpegProcess.stderr.on('data', (data) => {
      const output = data.toString()
      stderrOutput += output
      const now = Date.now()
      if (now - lastProgressLogTime > 2000) {
        const lines = output.trim().split('\n')
        const lastLine = lines[lines.length - 1]

        if (lastLine.includes('time=')) {
          const timeMatch = lastLine.match(/time=(\d{2}:\d{2}:\d{2}\.\d{2})/)
          const speedMatch = lastLine.match(/speed=\s*([\d.]+)x/)

          const time = timeMatch ? timeMatch[1] : 'N/A'
          const speed = speedMatch ? speedMatch[1] : 'N/A'

          console.log(
            `[FFmpeg] Progreso: Tiempo codificado = ${time} | Velocidad = ${speed}x`
          )
          lastProgressLogTime = now
        }
      }
    })

    ffmpegProcess.on('close', (code) => {
      if (code === 0) {
        console.log('[FFmpeg] Video assembled successfully')
        resolve()
      } else {
        console.error(`[FFmpeg] Proceso finalizó con código de error: ${code}`)
        reject(
          new Error(
            `FFmpeg process exited with code ${code}. Stderr: ${stderrOutput}`
          )
        )
      }
    })

    ffmpegProcess.on('error', (err) => {
      console.error('[FFmpeg] Fallo al iniciar el proceso.', err)
      reject(err)
    })
  })
}

export function buildVideoFromClipsArgs(params, options = {}) {
  const { videoPaths, narrationPath, musicPath, outputPath } = params
  const { musicVolume = 0.3 } = options

  if (!videoPaths || videoPaths.length === 0) {
    throw new Error('No se proporcionaron clips de video.')
  }

  const listFilePath = `/tmp/${uuidv4()}-concat-list.txt`
  const fileContent = videoPaths
    .map((p) => `file '${p.replace(/'/g, "'\\''")}'`)
    .join('\n')
  fs.writeFileSync(listFilePath, fileContent)
  console.log(`[FFmpeg] Lista generada: ${listFilePath}`)

  const args = []
  args.push('-y')

  // Inputs: Música (0), Videos (1), Narración (2)
  args.push('-i', musicPath)
  args.push('-f', 'concat', '-safe', '0', '-i', listFilePath)
  args.push('-i', narrationPath)

  const finalFilterComplex = `[0:a]volume=${musicVolume}[music_bg];[2:a][music_bg]amix=inputs=2:duration=longest[outa]`
  // ==============================================================================

  args.push('-filter_complex', finalFilterComplex)

  // Mapeo
  args.push('-map', '1:v')
  args.push('-map', '[outa]')

  // Codificación
  args.push('-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-shortest')

  args.push(outputPath)

  return { args, listFilePath }
}
