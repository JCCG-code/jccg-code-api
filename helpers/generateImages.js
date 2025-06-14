// Packages
import { Type } from '@google/genai'
import dotenv from 'dotenv'
import fs from 'fs/promises'
import { v4 as uuidv4 } from 'uuid'
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
                    },
                    propertyOrdering: ['name', 'description']
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
                    },
                    propertyOrdering: ['name', 'description']
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
                    },
                    propertyOrdering: ['name', 'description']
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
          type: Type.OBJECT,
          properties: {
            shotList: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  sceneNumber: {
                    type: Type.INTEGER
                  },
                  sceneDescription: {
                    type: Type.STRING
                  },
                  imagePrompt: {
                    type: Type.STRING
                  }
                },
                propertyOrdering: [
                  'sceneNumber',
                  'sceneDescription',
                  'imagePrompt'
                ]
              }
            }
          },
          propertyOrdering: ['shotList']
        }
      }
    })
    // Extract output
    const output = JSON.parse(responseData.text)
    // Checks output
    if (!output.shotList) {
      throw new HttpError({
        status: 400,
        message: `[Server ERROR] output.shotList does not exist`
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

export const generateImagesFromShotList = async (genAI, shotList) => {
  try {
    // Pararell image generation exec
    const imageGenerationPromises = shotList.map((shot) => {
      return (async () => {
        // Generating image
        const response = await genAI.models.generateImages({
          model: process.env.GEMINI_MODEL_IMAGE,
          prompt: shot.imagePrompt,
          config: {
            numberOfImages: 1,
            aspectRatio: '9:16'
          }
        })
        // Extracts imageBytes and mimeType
        const { imageBytes, mimeType } = response.generatedImages[0].image
        // Checks possible errors
        if (!imageBytes || !mimeType) {
          throw new HttpError({
            status: 500,
            message: '[Image ERROR] Error creating an image'
          })
        }
        // Transform to buffer
        const imageBuffer = Buffer.from(imageBytes, 'base64')
        // Creates localTempPath
        const tempFileName = `image-${shot.sceneNumber}-${uuidv4()}.png`
        const localTempPath = `/tmp/generated_images/${tempFileName}`
        // Creates the file
        await fs.mkdir('/tmp/generated_images', { recursive: true })
        await fs.writeFile(localTempPath, imageBuffer)
        // Return pararell statement
        return { sceneNumber: shot.sceneNumber, path: localTempPath }
      })()
    })
    // Promise.all pararell execution
    const generatedImagesInfo = await Promise.all(imageGenerationPromises)
    // Return statement
    return generatedImagesInfo
  } catch (error) {
    throw new HttpError({
      status: error?.status || 500,
      message: error?.message || error
    })
  }
}
