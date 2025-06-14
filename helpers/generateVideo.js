// Packages
import * as mm from 'music-metadata'
import { v4 as uuidv4 } from 'uuid'
// Local files
import * as ffmpegLib from '../libs/ffmpeg.js'
import * as gCloudStorageLib from '../libs/gCloudStorage.js'
// Errors
import HttpError from '../errors/HttpError.js'

export const generateVideoAssembly = async (
  story,
  seed,
  voiceGen,
  lyriaGen,
  generated_images
) => {
  try {
    // Creates video temp file
    const tempFileName = `${uuidv4()}.mp4`
    const localTempPath = `/tmp/${tempFileName}`
    // Extracts video duration
    const metadata = await mm.parseFile(lyriaGen.localTempPath)
    const duration = metadata.format.duration || 0
    // Get image paths
    const imagePaths = generated_images.map((i) => i.path)
    // Building video
    const getVideoCommand = ffmpegLib.buildTiktokVideoArgsWithFades({
      imagePaths,
      narrationPath: voiceGen.localTempPath,
      musicPath: lyriaGen.localTempPath,
      totalDuration: duration,
      outputPath: localTempPath
    })
    // Creates mp4 file
    await ffmpegLib.saveMp4File(getVideoCommand)
    // Upload file to GCS
    const destinationPath = `video/${process.env.JCCG_CODE_PROJECTID}/${tempFileName}`
    const publicUrl = await gCloudStorageLib.uploadFileToGCS(
      localTempPath,
      destinationPath
    )
    // Return statement
    return { publicUrl }
  } catch (error) {
    throw new HttpError({
      status: error?.status || 500,
      message: error?.message || error
    })
  }
}
