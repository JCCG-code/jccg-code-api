// Packages
import * as mm from 'music-metadata'
import { v4 as uuidv4 } from 'uuid'
import fs from 'fs/promises'
// Local files
import * as ffmpegLib from '../libs/ffmpeg.js'
import * as gCloudStorageLib from '../libs/gCloudStorage.js'
// Errors
import HttpError from '../errors/HttpError.js'

const downloadFiles = async (voiceGen, lyriaGen, generated_images) => {
  try {
    // Downloads audio
    const audioPath = await gCloudStorageLib.downloadFileFromGCS(
      voiceGen.publicUrl,
      `/tmp/${uuidv4()}.mp3`
    )
    // Downloads music
    const musicPath = await gCloudStorageLib.downloadFileFromGCS(
      lyriaGen.publicUrl,
      `/tmp/${uuidv4()}.mp3`
    )
    // Downloads images
    const downloadsImages = generated_images.map((image) => {
      return (async () => {
        // Creates localTempPath
        const tempFileName = `image-${image.sceneNumber}-${uuidv4()}.png`
        await fs.mkdir('/tmp/generated_images', { recursive: true })
        const localTempPath = `/tmp/generated_images/${tempFileName}`
        const imageTempPath = await gCloudStorageLib.downloadFileFromGCS(
          image.path,
          localTempPath
        )
        return { sceneNumber: image.sceneNumber, path: imageTempPath }
      })()
    })
    // Downloads image in paralell
    const imagesPathObj = await Promise.all(downloadsImages)
    // Return statement
    return { audioPath, musicPath, imagesPathObj }
  } catch (error) {
    throw new HttpError({
      status: error?.status || 500,
      message: error?.message || error
    })
  }
}

export const generateVideoAssembly = async (
  voiceGen,
  lyriaGen,
  generated_images
) => {
  try {
    // Downloading files from GCS
    const { audioPath, musicPath, imagesPathObj } = await downloadFiles(
      voiceGen,
      lyriaGen,
      generated_images
    )
    // Creates video temp file
    const tempFileName = `${uuidv4()}.mp4`
    const localTempPath = `/tmp/${tempFileName}`
    // Extracts video duration
    const metadata = await mm.parseFile(musicPath)
    const duration = metadata.format.duration || 0
    // Get image paths
    const imagePaths = imagesPathObj.map((i) => i.path)
    // Building video
    const getVideoCommand = ffmpegLib.buildTiktokVideoArgsWithFades({
      imagePaths,
      narrationPath: audioPath,
      musicPath: musicPath,
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
    // Deleting temp files
    await Promise.all([
      fs.unlink(audioPath),
      fs.unlink(musicPath),
      fs.unlink(localTempPath),
      fs.rm('/tmp/generated_images', { recursive: true, force: true }),
      gCloudStorageLib.deleteFolderGCS('audio/'),
      gCloudStorageLib.deleteFolderGCS('images/'),
      gCloudStorageLib.deleteFolderGCS('music/')
    ])
    // Return statement
    return { publicUrl }
  } catch (error) {
    throw new HttpError({
      status: error?.status || 500,
      message: error?.message || error
    })
  }
}
