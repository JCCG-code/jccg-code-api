// Packages
import { Type } from '@google/genai'
import dotenv from 'dotenv'
// Local files
import * as prompts from '../libs/prompts.js'
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
      console.log(
        `[Server] The TTS Story about ${ambience} have been created successfully`
      )
      // Return statement
      return output
    }
    // Return statement
    return output
  } catch (error) {
    throw new HttpError({
      status: error?.status || 500,
      message: error?.message || error
    })
  }
}
