import { spawn } from 'node:child_process'
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
    console.log(`[FFmpeg] Iniciando proceso...`)
    const ffmpegProcess = spawn(command, args)

    let stderrOutput = ''
    ffmpegProcess.stdout.on('data', (data) => {
      console.log(`[FFmpeg STDOUT]: ${data.toString()}`)
    })

    ffmpegProcess.stderr.on('data', (data) => {
      const output = data.toString()
      console.log(`[FFmpeg Progress]: ${output}`)
      stderrOutput += output
    })

    ffmpegProcess.on('close', (code) => {
      if (code === 0) {
        console.log('[FFmpeg] Proceso completado con éxito.')
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

/**
 *
 * @param params
 * @param options
 */
export function buildTiktokVideoArgsWithFades(params, options = {}) {
  const { imagePaths, narrationPath, musicPath, totalDuration, outputPath } =
    params

  const {
    fadeDuration = 1,
    musicVolume = 0.3,
    videoSize = '1080x1920',
    fps = 25
  } = options

  const sceneCount = imagePaths.length
  if (sceneCount === 0) {
    throw new Error('No se proporcionaron imágenes para el video.')
  }

  const durationPerScene = totalDuration / sceneCount

  const args = []
  args.push('-y')

  // Inputs de imagen
  imagePaths.forEach((path) => {
    args.push('-loop', '1', '-t', String(durationPerScene), '-i', path)
  })

  // Inputs de audio
  args.push('-i', narrationPath, '-i', musicPath)

  // Construcción del filtro complejo simplificado
  let filterComplex = ''
  const fadeOutStartTime = durationPerScene - fadeDuration
  imagePaths.forEach((_, i) => {
    // --- ÚNICO CAMBIO REQUERIDO ---
    // Eliminamos la cadena scale+pad y solo nos aseguramos del formato de píxeles y el fundido.
    // FFmpeg usará el tamaño original de la imagen, que ya es correcto.
    const fade = `fade=t=in:st=0:d=${fadeDuration},fade=t=out:st=${fadeOutStartTime}:d=${fadeDuration}`
    filterComplex += `[${i}:v]format=yuv420p,${fade}[v${i}];`
  })

  // Concatenación y mezcla de audio (sin cambios)
  const videoStreams = imagePaths.map((_, i) => `[v${i}]`).join('')
  filterComplex += `${videoStreams}concat=n=${sceneCount}:v=1:a=0[outv];`

  const narrationInputIndex = sceneCount
  const musicInputIndex = sceneCount + 1
  filterComplex += `[${musicInputIndex}:a]volume=${musicVolume}[music_bg];[${narrationInputIndex}:a][music_bg]amix=inputs=2:duration=first[outa]`

  args.push('-filter_complex', filterComplex)

  // Parámetros de salida (sin cambios)
  args.push('-map', '[outv]', '-map', '[outa]')
  args.push(
    '-c:v',
    'libx264',
    '-preset',
    'veryfast',
    '-c:a',
    'aac',
    '-b:a',
    '192k',
    '-r',
    String(fps),
    '-shortest',
    '-s',
    videoSize
  )
  args.push(outputPath)

  return args
}
