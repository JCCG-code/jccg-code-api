// Packages
import { Type } from '@google/genai'
import dotenv from 'dotenv'
// Local files
import * as prompts from '../libs/prompts.js'
// Errors
import HttpError from '../errors/HttpError.js'

dotenv.config()

export const extractVisualTokens = async (
  genAI,
  ambience,
  story_seed,
  story
) => {
  try {
    // Transform master prompt with desired ambience
    const promptToSend = prompts.extractVisualTokens
      .replaceAll('@@prompt_ambience', ambience)
      .replaceAll('@@story_seed', story_seed)
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
            consistencyTokens: {
              type: Type.OBJECT,
              properties: {
                globalStyle: {
                  type: Type.STRING
                },
                characters: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      name: {
                        type: Type.STRING
                      },
                      description: {
                        type: Type.STRING
                      }
                    }
                  }
                },
                keyObjects: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      name: {
                        type: Type.STRING
                      },
                      description: {
                        type: Type.STRING
                      }
                    }
                  }
                },
                keyLocations: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      name: {
                        type: Type.STRING
                      },
                      description: {
                        type: Type.STRING
                      }
                    }
                  }
                }
              }
            }
          },
          propertyOrdering: ['consistencyTokens']
        }
      }
    })
    // Extract output
    const output = JSON.parse(responseData.text)
    // Checks output
    if (!output.consistencyTokens) {
      throw new HttpError({
        status: 400,
        message: `[Server ERROR] output.consistencyTokens does not exist`
      })
    }
    console.log(`[Server] Visual tokens have been extracted successfully`)
    // Return statement
    return output
  } catch (error) {
    throw new HttpError({
      status: error?.status || 500,
      message: error?.message || error
    })
  }
}

export const generateShotListFromTokens = async (genAI, tokens, story) => {
  try {
    // Transform master prompt with desired ambience
    const promptToSend = prompts.generateShotListFromTokens
      .replaceAll('@@consistency_tokens', JSON.stringify(tokens, null, 2))
      .replaceAll('@@story_text', story)
    // Generating text
    const responseData = await genAI.models.generateContent({
      model: process.env.GEMINI_MODEL_TEXT,
      contents: promptToSend,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            sceneNumber: {
              type: Type.INTEGER
            },
            sceneDescription: {
              type: Type.INTEGER
            },
            imagePrompt: {
              type: Type.INTEGER
            }
          },
          propertyOrdering: ['sceneNumber', 'sceneDescription', 'imagePrompt']
        }
      }
    })
    // Extract output
    const output = JSON.parse(responseData.text)
    console.log(output)
    // Checks output
    if (
      !output.sceneNumber ||
      !output.sceneDescription ||
      !output.imagePrompt
    ) {
      throw new HttpError({
        status: 400,
        message: `[Server ERROR] output.sceneNumber, output.sceneDescription or output.imagePrompt does not exist`
      })
    }
    console.log(`[Server] All shots list have been created successfully`)
    // Return statement
    return output
  } catch (error) {
    throw new HttpError({
      status: error?.status || 500,
      message: error?.message || error
    })
  }
}
