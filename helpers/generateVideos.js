// Packages
import { Type } from '@google/genai'
import dotenv from 'dotenv'
import fs from 'fs/promises'
import { createWriteStream } from 'fs'
import { Readable } from 'stream'
import { finished } from 'stream/promises'
import { v4 as uuidv4 } from 'uuid'
// Local files
import * as prompts from '../libs/prompts.js'
import * as gCloudStorageLib from '../libs/gCloudStorage.js'
// Errors
import HttpError from '../errors/HttpError.js'

dotenv.config()

export const generateVisualBible = async (
  genAI,
  ambience,
  story_seed,
  scene_outline
) => {
  try {
    // Transform master prompt with desired ambience
    const promptToSend = prompts.generateVisualBible
      .replaceAll('@@prompt_ambience', ambience)
      .replaceAll('@@story_seed', story_seed)
      .replaceAll(
        '@@scene_outline_json',
        JSON.stringify(scene_outline, null, 2)
      )
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
                },
                negativePrompt: {
                  type: Type.STRING
                }
              },
              propertyOrdering: [
                'globalStyle',
                'characters',
                'keyObjects',
                'keyLocations',
                'negativePrompt'
              ]
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

export const generateVeoPrompts = async (
  genAI,
  consistencyTokens,
  scene_outline
) => {
  try {
    // Transform master prompt with desired ambience
    const promptToSend = prompts.generateVeoPrompts
      .replaceAll(
        '@@consistency_tokens_json',
        JSON.stringify(consistencyTokens, null, 2)
      )
      .replaceAll(
        '@@scene_outline_json',
        JSON.stringify(scene_outline, null, 2)
      )
    // Generating text
    const responseData = await genAI.models.generateContent({
      model: process.env.GEMINI_MODEL_TEXT,
      contents: promptToSend,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              sceneNumber: {
                type: Type.INTEGER
              },
              videoPrompt: {
                type: Type.STRING
              },
              negativePrompt: {
                type: Type.STRING
              }
            },
            propertyOrdering: ['sceneNumber', 'videoPrompt', 'negativePrompt']
          }
        }
      }
    })
    // Extract output
    const output = JSON.parse(responseData.text)
    // Checks output
    if (!output.length > 0) {
      throw new HttpError({
        status: 400,
        message: `[Server ERROR] output of Veo prompts does not exist`
      })
    }
    console.log(`[Server] Veo prompts have been created successfully`)
    // Return statement
    return output
  } catch (error) {
    throw new HttpError({
      status: error?.status || 500,
      message: error?.message || error
    })
  }
}

export const generateVideos = async (genAI, promptList, storyBoard) => {
  // Initializations
  const generatedVideosInfo = []
  try {
    // Creates folder
    await fs.mkdir('/tmp/generated_videos', { recursive: true })
    // Read entries
    for (const [index, single] of promptList.entries()) {
      console.log('[Server] Prompt to video: ', single.videoPrompt)
      // Generating video
      let operation = await genAI.models.generateVideos({
        model: process.env.GEMINI_MODEL_VIDEO,
        prompt: single.videoPrompt,
        config: {
          personGeneration: 'allow_adult',
          aspectRatio: '9:16',
          numberOfVideos: 1,
          durationSeconds: storyBoard[index].duration_seconds,
          negativePrompt: single.negativePrompt
        }
      })
      // Checks if video is genereated
      while (!operation.done) {
        // 10 seconds timer
        await new Promise((resolve) => setTimeout(resolve, 10000))
        operation = await genAI.operations.getVideosOperation({
          operation: operation
        })
      }
      if (operation.response?.generatedVideos.length > 0) {
        // Extract uri of generated video
        const { video } = operation.response.generatedVideos[0]
        console.log(`[Server] Downloading video ${index}...`)
        // Localpath
        const tempFileName = `video-${index}-${uuidv4()}.mp4`
        const localTempPath = `/tmp/generated_videos/${tempFileName}`
        try {
          // Get video from google
          const resp = await fetch(
            `${video?.uri}&key=${process.env.GOOGLE_API_KEY}`
          )
          const writer = createWriteStream(localTempPath)
          Readable.fromWeb(resp.body).pipe(writer)
          await finished(writer)
          // Push to GCS
          const destinationPath = `videos/${process.env.JCCG_CODE_PROJECTID}/${tempFileName}`
          const publicUrl = await gCloudStorageLib.uploadFileToGCS(
            localTempPath,
            destinationPath
          )
          generatedVideosInfo.push({
            sceneNumber: single.sceneNumber,
            path: publicUrl
          })
          await fs.unlink(localTempPath)
        } catch (error) {
          throw new HttpError({
            status: error?.status || 500,
            message: error?.message || error
          })
        }
      }
    }
    // Return statement
    return generatedVideosInfo
  } catch (error) {
    throw new HttpError({
      status: error?.status || 500,
      message: error?.message || error
    })
  }
}
