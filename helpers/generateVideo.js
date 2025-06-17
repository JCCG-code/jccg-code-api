// Packages
import * as mm from 'music-metadata'
import { v4 as uuidv4 } from 'uuid'
import fs from 'fs/promises'
// Local files
import * as ffmpegLib from '../libs/ffmpeg.js'
import * as gCloudStorageLib from '../libs/gCloudStorage.js'
// Errors
import HttpError from '../errors/HttpError.js'

const downloadFiles = async (voiceGen, lyriaGen, generated_videos) => {
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
    // Downloads videos
    const downloadsVideos = generated_videos.map((video) => {
      return (async () => {
        // Creates localTempPath
        const tempFileName = `video-${video.sceneNumber}-${uuidv4()}.mp4`
        await fs.mkdir('/tmp/generated_videos', { recursive: true })
        const localTempPath = `/tmp/generated_videos/${tempFileName}`
        const videoTempPath = await gCloudStorageLib.downloadFileFromGCS(
          video.publicUrl,
          localTempPath
        )
        return { sceneNumber: video.sceneNumber, path: videoTempPath }
      })()
    })
    // Downloads video in paralell
    const videosPathObj = await Promise.all(downloadsVideos)
    // Return statement
    return { audioPath, musicPath, videosPathObj }
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
  generated_videos
) => {
  try {
    // Downloading files from GCS
    const { audioPath, musicPath, videosPathObj } = await downloadFiles(
      voiceGen,
      lyriaGen,
      generated_videos
    )
    // Creates video temp file
    const tempFileName = `${uuidv4()}.mp4`
    const localTempPath = `/tmp/${tempFileName}`
    // Get video paths
    const videoPaths = videosPathObj.map((i) => i.path)
    // Building video
    const { args, listFilePath } = ffmpegLib.buildVideoFromClipsArgs({
      videoPaths,
      narrationPath: audioPath,
      musicPath: musicPath,
      outputPath: localTempPath
    })
    // Creates mp4 file
    await ffmpegLib.saveMp4File(args)
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
      fs.unlink(listFilePath),
      fs.rm('/tmp/generated_images', { recursive: true, force: true }),
      fs.rm('/tmp/generated_videos', { recursive: true, force: true }),
      gCloudStorageLib.deleteFolderGCS('audio/'),
      gCloudStorageLib.deleteFolderGCS('music/'),
      gCloudStorageLib.deleteFolderGCS('images/'),
      gCloudStorageLib.deleteFolderGCS('videos/')
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
