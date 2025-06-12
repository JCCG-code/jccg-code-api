// Packages
import { Type } from '@google/genai'
import dotenv from 'dotenv'
// Local files
import * as prompts from '../libs/prompts.js'
// Errors
import HttpError from '../errors/HttpError.js'

dotenv.config()

/**
 * Allows to create new seeds by reading previous seeds
 * @param {object} genAI - AI Gemini generative
 * @param {string} ambience - Selected ambience from user
 * @param {Array[string]} previousSeeds - All previous seeds already used
 * @returns
 */
export const generateStorySeeds = async (genAI, ambience, previousSeeds) => {
  try {
    // Transform master prompt with desired ambience
    const promptToSend = prompts.generateStorySeedsWithContext
      .replaceAll('@@prompt_ambience', ambience)
      .replaceAll('@@previous_seeds_list', previousSeeds)
    // Generating text
    const responseData = await genAI.models.generateContent({
      model: process.env.GEMINI_MODEL_TEXT,
      contents: promptToSend,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            story_seeds: {
              type: Type.ARRAY,
              items: {
                type: Type.STRING
              }
            }
          },
          propertyOrdering: ['story_seeds']
        }
      }
    })
    // Extract output
    const output = JSON.parse(responseData.text)
    // Checks output
    if (output.story_seeds && output.story_seeds.length > 0) {
      // Console log
      console.log(
        `[Server] ${output.story_seeds.length} new seeds about ${ambience} have been created successfully`
      )
      // Return statement
      return output
    } else {
      throw new HttpError({
        status: 400,
        message: `[Server ERROR] output.story_seeds does not exist. An error occurred by creating new seeds`
      })
    }
  } catch (error) {
    throw new HttpError({
      status: error?.status || 500,
      message: error?.message || error
    })
  }
}

export const generateCreativeDirection = async (genAI, ambience, seed) => {
  try {
    // Transform master prompt with desired ambience
    const promptToSend = prompts.generateCreativeDirection
      .replaceAll('@@prompt_ambience', ambience)
      .replaceAll('@@story_seed', seed)
    // Generating text
    const responseData = await genAI.models.generateContent({
      model: process.env.GEMINI_MODEL_TEXT,
      contents: promptToSend,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            chosen_tone: {
              type: Type.STRING
            },
            narrative_perspective: {
              type: Type.STRING
            },
            key_dramatic_moment: {
              type: Type.STRING
            }
          },
          propertyOrdering: [
            'chosen_tone',
            'narrative_perspective',
            'key_dramatic_moment'
          ]
        }
      }
    })
    // Extract output
    const output = JSON.parse(responseData.text)
    // Checks output
    if (
      !output.chosen_tone ||
      !output.narrative_perspective ||
      !output.key_dramatic_moment
    ) {
      throw new HttpError({
        status: 400,
        message: `[Server ERROR] output.chosen_tone, output.narrative_perspective or output.key_dramatic_moment does not exist`
      })
    } else {
      console.log(
        `[Server] Creative direction about ${ambience} have been done successfully`
      )
      // Return statement
      return output
    }
  } catch (error) {
    throw new HttpError({
      status: error?.status || 500,
      message: error?.message || error
    })
  }
}

export const generateStoryFromDirection = async (
  genAI,
  ambience,
  seed,
  tone,
  storyFocus,
  keyElement
) => {
  try {
    // Transform master prompt with desired ambience
    const promptToSend = prompts.generateStoryFromDirection
      .replaceAll('@@prompt_ambience', ambience)
      .replaceAll('@@story_seed', seed)
      .replaceAll('@@chosen_tone', tone)
      .replaceAll('@@narrative_perspective', storyFocus)
      .replaceAll('@@key_dramatic_moment', keyElement)
    // Generating text
    const responseData = await genAI.models.generateContent({
      model: process.env.GEMINI_MODEL_TEXT,
      contents: promptToSend,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            story: {
              type: Type.STRING
            }
          },
          propertyOrdering: ['story']
        }
      }
    })
    // Extract output
    const output = JSON.parse(responseData.text)
    // Checks output
    if (!output.story) {
      throw new HttpError({
        status: 400,
        message: `[Server ERROR] output.story does not exist`
      })
    } else {
      console.log(
        `[Server] The story from direction about ${ambience} have been done successfully`
      )
      // Return statement
      return output
    }
  } catch (error) {
    throw new HttpError({
      status: error?.status || 500,
      message: error?.message || error
    })
  }
}

export const generateFinalPackage = async (genAI, ambience, story) => {
  try {
    // Transform master prompt with desired ambience
    const promptToSend = prompts.generateFinalPackage
      .replaceAll('@@prompt_ambience', ambience)
      .replaceAll('@@story_text', story)
    // Generating text
    const responseData = await genAI.models.generateContent({
      model: process.env.GEMINI_MODEL_TEXT,
      contents: promptToSend,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: {
              type: Type.STRING
            },
            story: {
              type: Type.STRING
            },
            narrator_tone_es: {
              type: Type.STRING
            },
            suggested_voice_name: {
              type: Type.STRING
            },
            music_cues: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  prompt: {
                    type: Type.STRING
                  },
                  weight: {
                    type: Type.NUMBER
                  }
                }
              }
            },
            image_prompt: {
              type: Type.STRING
            }
          },
          propertyOrdering: [
            'title',
            'story',
            'narrator_tone_es',
            'suggested_voice_name',
            'music_cues',
            'image_prompt'
          ]
        }
      }
    })
    // Extract output
    const output = JSON.parse(responseData.text)
    if (
      !output.title ||
      !output.story ||
      !output.narrator_tone_es ||
      !output.music_cues ||
      !output.image_prompt
    ) {
      throw new HttpError({
        status: 400,
        message: `[Server ERROR] output.title, output.story, output.narrator_tone_es, output.music_cues, output.image_prompt do not exist`
      })
    } else {
      console.log(
        `[Server] The final package about ${ambience} have been created successfully`
      )
      // Return statement
      return output
    }
  } catch (error) {
    throw new HttpError({
      status: error?.status || 500,
      message: error?.message || error
    })
  }
}
