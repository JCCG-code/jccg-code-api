// Packages
import { Type } from '@google/genai'
// Local files
import * as prompts from '../libs/prompts.js'
// Errors
import HttpError from '../errors/HttpError.js'

export const generateCreativeDirection = async (genAI, model, ambience) => {
  try {
    // Transform master prompt with desired ambience
    const promptToSend = prompts.generateCreativeDirection.replaceAll(
      '@@prompt_ambience',
      ambience
    )
    // Generating text
    const responseData = await genAI.models.generateContent({
      model: model,
      contents: promptToSend,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            chosen_tone: {
              type: Type.STRING
            },
            story_focus: {
              type: Type.STRING
            },
            key_element: {
              type: Type.STRING
            }
          },
          propertyOrdering: ['chosen_tone', 'story_focus', 'key_element']
        }
      }
    })
    // Extract output
    const output = JSON.parse(responseData.text)
    // Return statement
    return output
  } catch (error) {
    throw new HttpError({
      status: error?.status || 500,
      message: error?.message || error
    })
  }
}

export const generateStoryFromDirection = async (
  genAI,
  model,
  ambience,
  tone,
  storyFocus,
  keyElement
) => {
  try {
    // Transform master prompt with desired ambience
    const promptToSend = prompts.generateStoryFromDirection
      .replaceAll('@@prompt_ambience', ambience)
      .replaceAll('@@chosen_tone', tone)
      .replaceAll('@@story_focus', storyFocus)
      .replaceAll('@@key_element', keyElement)
    // Generating text
    const responseData = await genAI.models.generateContent({
      model: model,
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
    // Return statement
    return output
  } catch (error) {
    throw new HttpError({
      status: error?.status || 500,
      message: error?.message || error
    })
  }
}

export const generateFinalPackage = async (genAI, model, ambience, story) => {
  try {
    // Transform master prompt with desired ambience
    const promptToSend = prompts.generateFinalPackage
      .replaceAll('@@prompt_ambience', ambience)
      .replaceAll('@@story_text', story)
    // Generating text
    const responseData = await genAI.models.generateContent({
      model: model,
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
    // Return statement
    return output
  } catch (error) {
    throw new HttpError({
      status: error?.status || 500,
      message: error?.message || error
    })
  }
}
