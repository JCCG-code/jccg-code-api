// Packages
import dotenv from 'dotenv'
import { GoogleGenAI } from '@google/genai'
import { v4 as uuidv4 } from 'uuid'
import fs from 'fs/promises'
// Local files
import * as ffmpegLib from '../libs/ffmpeg.js'
import * as gCloudStorageLib from '../libs/gCloudStorage.js'
// Errors
import HttpError from '../errors/HttpError.js'

dotenv.config()

const genAI = new GoogleGenAI({
  apiKey: process.env.GOOGLE_API_KEY,
  apiVersion: 'v1alpha'
})

export const generateLyriaMusic = async (music_cues, duration) => {
  return new Promise(async (resolve, reject) => {
    // Initialization of chunks array
    const audioChunks = []
    try {
      // Generating music
      const session = await genAI.live.music.connect({
        model: process.env.GEMINI_MODEL_MUSIC,
        callbacks: {
          onmessage: (message) => {
            if (message.serverContent?.audioChunks?.[0]?.data) {
              audioChunks.push(message.serverContent.audioChunks[0].data)
            }
          },
          onerror: (error) => {
            console.error('[Lyria ERROR] Error during the session: ', error)
            reject(error)
          }
        }
      })
      // Configures music cues and bpms
      await session.setWeightedPrompts({ weightedPrompts: music_cues })
      await session.setMusicGenerationConfig({
        musicGenerationConfig: { bpm: 60 }
      })
      // Starts the session
      await session.play()
      console.log(`[Lyria] Generating music during ${duration} seconds...`)

      setTimeout(async () => {
        try {
          await session.stop()
          await session.close()
          // Checks number of chunks
          if (audioChunks.length === 0) {
            return reject(new Error('Any audio chunk has been received'))
          }
          // Ensambling base64 audio to buffer
          const fullBase64Audio = audioChunks.join('')
          const audioBuffer = Buffer.from(fullBase64Audio, 'base64')
          console.log(
            `[Lyria] Music generated successfully. Sizes ${audioBuffer.length} bytes.`
          )
          // Creates localTempPath
          const tempFileName = `${uuidv4()}.mp3`
          const localTempPath = `/tmp/${tempFileName}`
          // Creates the file
          await ffmpegLib.saveMp3File(localTempPath, audioBuffer, 48000, 2)
          // Upload file to GCS
          const destinationPath = `music/${process.env.JCCG_CODE_PROJECTID}/${tempFileName}`
          const publicUrl = await gCloudStorageLib.uploadFileToGCS(
            localTempPath,
            destinationPath
          )
          // Deletes temp file
          await fs.unlink(localTempPath)
          resolve({ publicUrl })
        } catch (stopError) {
          reject(stopError)
        }
      }, duration * 1000)
    } catch (sessionError) {
      reject(
        new HttpError({
          status: 400,
          message: `[Lyria ERROR] Error opening the Lyria session: ${sessionError.message}`
        })
      )
    }
  })
}
