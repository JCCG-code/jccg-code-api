import { Storage } from '@google-cloud/storage'
import dotenv from 'dotenv'
import mime from 'mime-types'
import axios from 'axios'
// Errors
import HttpError from '../errors/HttpError.js'

dotenv.config()

export const uploadFileToGCS = async (localFilePath, destinationPath) => {
  try {
    if (!process.env.GCS_BUCKET_NAME) {
      throw new HttpError({
        status: 404,
        message: '[Server ERROR] GCS_BUCKET_NAME not provided'
      })
    }
    // Initializations
    const storage = new Storage()
    const bucketName = process.env.GCS_BUCKET_NAME
    // Detects the content type
    const detectedContentType = mime.lookup(localFilePath)
    const contentType = detectedContentType || 'application/octet-stream'
    // Uploads the file
    await storage.bucket(bucketName).upload(localFilePath, {
      destination: destinationPath,
      metadata: {
        contentType,
        cacheControl: 'public, max-age=31536000'
      }
    })
    // Obtaning public url
    const publicUrl = `https://storage.googleapis.com/${bucketName}/${destinationPath}`
    console.log(`[Server] File uploaded successfully. Public url: ${publicUrl}`)
    // Return statement
    return publicUrl
  } catch (error) {
    throw new HttpError({
      status: error?.status || 500,
      message: error?.message || error
    })
  }
}

export const downloadFileFromGCS = async (publicUrl, localTempPath) => {
  if (!process.env.GCS_BUCKET_NAME) {
    throw new HttpError({
      status: 404,
      message: '[Server ERROR] GCS_BUCKET_NAME not provided'
    })
  }
  // Initializations
  const storage = new Storage()
  const bucketName = process.env.GCS_BUCKET_NAME
  // Extract filename from GCS
  const prefix = `https://storage.googleapis.com/${bucketName}/`
  if (!publicUrl.startsWith(prefix)) {
    throw new HttpError({
      status: 400,
      message: '[Server ERROR] PublicUrl received to download is wrong'
    })
  }
  const fileName = publicUrl.replace(prefix, '')
  try {
    // Download file
    await storage
      .bucket(bucketName)
      .file(fileName)
      .download({ destination: localTempPath })
    console.log(
      `[Server] File downloaded successfully. Local path: ${localTempPath}`
    )
    // Return statement
    return localTempPath
  } catch (error) {
    throw new HttpError({
      status: error?.status || 500,
      message: error?.message || error
    })
  }
}

export const deleteFolderGCS = async (folderName) => {
  if (!process.env.GCS_BUCKET_NAME) {
    throw new HttpError({
      status: 404,
      message: '[Server ERROR] GCS_BUCKET_NAME not provided'
    })
  }
  // Initializations
  const storage = new Storage()
  const bucketName = process.env.GCS_BUCKET_NAME
  try {
    // Download file
    await storage.bucket(bucketName).deleteFiles({
      prefix: folderName
    })
    console.log(`[GCS] Files from ${folderName} have been deleted successfully`)
  } catch (error) {
    throw new HttpError({
      status: error?.status || 500,
      message: error?.message || error
    })
  }
}
