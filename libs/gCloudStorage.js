import { Storage } from '@google-cloud/storage'
import dotenv from 'dotenv'
import mime from 'mime-types'
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
    // const storage = new Storage({
    //   projectId: process.env.JCCG_CODE_PROJECTID,
    //   keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS
    // })
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
