// Packages
import { Type } from '@google/genai'
import dotenv from 'dotenv'
import fs from 'fs'
// Local files
import * as prompts from '../libs/prompts.js'
import * as debugFile from '../libs/debugFile.js'
import Job from '../models/Job.model.js'
// Errors
import HttpError from '../errors/HttpError.js'

dotenv.config()

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
                type: Type.OBJECT,
                properties: {
                  seed: {
                    type: Type.STRING
                  },
                  suggested_genre: {
                    type: Type.STRING
                  }
                },
                propertyOrdering: ['seed', 'suggested_genre']
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
    console.log(`[Server] Selected seed: ${seed}`)
    // Transform master prompt with desired ambience
    const promptToSend = prompts.generateCreativeDirection
      .replaceAll('@@prompt_ambience', ambience)
      .replaceAll('@@story_seed', seed.seed)
      .replaceAll('@@suggested_genre', seed.suggested_genre)
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
      .replaceAll('@@story_seed', seed.seed)
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

export const generateFinalPackage = async (genAI, ambience, story, seed) => {
  try {
    // Transform master prompt with desired ambience
    const promptToSend = prompts.generateFinalPackage
      .replaceAll('@@prompt_ambience', ambience)
      .replaceAll('@@story_seed', seed.seed)
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
            narrative_style: {
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
                  text: {
                    type: Type.STRING
                  },
                  weight: {
                    type: Type.NUMBER
                  }
                },
                propertyOrdering: ['text', 'weight']
              }
            }
          },
          propertyOrdering: [
            'title',
            'story',
            'narrative_style',
            'narrator_tone_es',
            'suggested_voice_name',
            'music_cues'
          ]
        }
      }
    })
    // Extract output
    const output = JSON.parse(responseData.text)
    if (
      !output.title ||
      !output.story ||
      !output.narrative_style ||
      !output.narrator_tone_es ||
      !output.music_cues
    ) {
      throw new HttpError({
        status: 400,
        message: `[Server ERROR] output.title, output.story, output.narrative_style, output.narrator_tone_es or output.music_cues do not exist`
      })
    } else {
      console.log(
        `[Server] The final package about ${ambience} have been created successfully`
      )
      // New job
      const jobData = {
        prompt_ambience: ambience,
        seed: seed.seed,
        story: output
      }
      await Job.findOneAndUpdate({ prompt_ambience: ambience }, jobData, {
        upsert: true,
        runValidators: true
      })
      console.log(`[MongoDB] New object \'${ambience}\' created or updated`)
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
