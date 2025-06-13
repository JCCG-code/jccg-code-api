// Packages
import { Type } from '@google/genai'
import dotenv from 'dotenv'
import { v4 as uuidv4 } from 'uuid'
import fs from 'fs/promises'
import * as mm from 'music-metadata'
// Local files
import * as prompts from '../libs/prompts.js'
import * as ffmpegLib from '../libs/ffmpeg.js'
import * as gCloudStorageLib from '../libs/gCloudStorage.js'
// Errors
import HttpError from '../errors/HttpError.js'

dotenv.config()

export const generateGeminiTTScript = async (genAI, story, tone) => {
  try {
    // Transform master prompt with desired ambience
    const promptToSend = prompts.generateGeminiTTScript
      .replaceAll('@@story_text', story)
      .replaceAll('@@narrator_tone_es', tone)
    // Generating text
    const responseData = await genAI.models.generateContent({
      model: process.env.GEMINI_MODEL_TEXT,
      contents: promptToSend,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            TTS_story: {
              type: Type.STRING
            }
          },
          propertyOrdering: ['TTS_story']
        }
      }
    })
    // Extract output
    const output = JSON.parse(responseData.text)
    // Checks output
    if (!output.TTS_story) {
      throw new HttpError({
        status: 400,
        message: `[Server ERROR] output.TTS_story does not exist`
      })
    } else {
      console.log(`[Server] The TTS Story have been created successfully`)
      // Return statement
      return output.TTS_story
    }
  } catch (error) {
    throw new HttpError({
      status: error?.status || 500,
      message: error?.message || error
    })
  }
}

export const generateGeminiVoice = async (genAI, storyToRead, voiceName) => {
  try {
    // Generating text
    const responseData = await genAI.models.generateContent({
      model: process.env.GEMINI_MODEL_VOICE,
      contents: [{ parts: [{ text: storyToRead }] }],
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName }
          }
        }
      }
    })
    // Extract audio data
    const data =
      responseData.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data
    if (!data) {
      throw new HttpError({
        status: 400,
        message: `[Server ERROR] Data audio file has not been received`
      })
    }
    // Convert to audio buffer
    const audioBuffer = Buffer.from(data, 'base64')
    // Creates localTempPath
    const tempFileName = `${uuidv4()}.mp3`
    const localTempPath = `/tmp/${tempFileName}`
    // Creates the file
    await ffmpegLib.saveMp3File(localTempPath, audioBuffer)
    // Upload file to GCS
    const destinationPath = `audios/${process.env.JCCG_CODE_PROJECTID}/${tempFileName}`
    const publicUrl = await gCloudStorageLib.uploadFileToGCS(
      localTempPath,
      destinationPath
    )
    // Extracts audio duration
    const metadata = await mm.parseFile(localTempPath)
    const duration = metadata.format.duration || 0
    // Deletes temp file
    await fs.unlink(localTempPath)
    // Return statement
    return { publicUrl, duration }
  } catch (error) {
    throw new HttpError({
      status: error?.status || 500,
      message: error?.message || error
    })
  }
}
