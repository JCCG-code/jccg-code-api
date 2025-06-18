// Packages
import { Type, GoogleGenAI } from '@google/genai'
import dotenv from 'dotenv'
import fs from 'fs/promises'
import { v4 as uuidv4 } from 'uuid'
// Local files
import * as prompts from '../libs/prompts.js'
import * as gCloudStorageLib from '../libs/gCloudStorage.js'
// Errors
import HttpError from '../errors/HttpError.js'

// Initializations
dotenv.config()

export const planClipStoryboard = async (genAI, duration, story) => {
  try {
    // Transform master prompt with desired ambience
    const promptToSend = prompts.planClipStoryboard
      .replaceAll('@@total_duration_seconds', duration)
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
            type: Type.OBJECT,
            properties: {
              clipNumber: {
                type: Type.INTEGER
              },
              duration_seconds: {
                type: Type.INTEGER
              },
              clipDescription: {
                type: Type.STRING
              }
            },
            propertyOrdering: [
              'clipNumber',
              'duration_seconds',
              'clipDescription'
            ]
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
        message: `[Server ERROR] Error creating clips from director`
      })
    }
    console.log(`[Server] Video clips have been created successfully`)
    // Return statement
    return output
  } catch (error) {
    throw new HttpError({
      status: error?.status || 500,
      message: error?.message || error
    })
  }
}

export const enrichStoryboardWithPrompts = async (genAI, tokens, clipList) => {
  try {
    // Transform master prompt with desired ambience
    const promptToSend = prompts.enrichStoryboardWithPrompts
      .replaceAll('@@consistency_tokens', JSON.stringify(tokens, null, 2))
      .replaceAll('@@clip_list_json', JSON.stringify(clipList, null, 2))
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
              clipNumber: {
                type: Type.INTEGER
              },
              duration_seconds: {
                type: Type.INTEGER
              },
              clipDescription: {
                type: Type.STRING
              },
              imagePrompt: {
                type: Type.STRING
              }
            },
            propertyOrdering: [
              'clipNumber',
              'duration_seconds',
              'clipDescription',
              'imagePrompt'
            ]
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
        message: `[Server ERROR] Error creating image prompts from director`
      })
    }
    console.log(
      `[Server] Image prompts for each scene have been created successfully`
    )
    // Return statement
    return output
  } catch (error) {
    throw new HttpError({
      status: error?.status || 500,
      message: error?.message || error
    })
  }
}

export const generateVideoPrompts = async (genAI, storyBoard) => {
  try {
    // Transform master prompt with desired ambience
    const promptToSend = prompts.generateVideoPrompts.replaceAll(
      '@@full_storyboard_json',
      JSON.stringify(storyBoard, null, 2)
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
              clipNumber: {
                type: Type.INTEGER
              },
              duration_seconds: {
                type: Type.INTEGER
              },
              clipDescription: {
                type: Type.STRING
              },
              imagePrompt: {
                type: Type.STRING
              },
              videoPrompt: {
                type: Type.STRING
              }
            },
            propertyOrdering: [
              'clipNumber',
              'duration_seconds',
              'clipDescription',
              'imagePrompt',
              'videoPrompt'
            ]
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
        message: `[Server ERROR] Error creating video prompts from director`
      })
    }
    console.log(
      `[Server] Video prompts for each scene have been created successfully`
    )
    // Return statement
    return output
  } catch (error) {
    throw new HttpError({
      status: error?.status || 500,
      message: error?.message || error
    })
  }
}

export const createsVideos = async (genAI, imageVideoPrompts) => {
  // Creates seed
  const randomSeed = Math.floor(Math.random() * 99999)
  // Creates folder
  await fs.mkdir('/tmp/generated_videos', { recursive: true })
  // Creates genAI instance for images
  // const genAImage = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY })
  try {
    const resVideos = []
    // Pararell image generation exec
    for (const shot of imageVideoPrompts) {
      // Generating image
      const response = await genAI.models.generateImages({
        model: process.env.GEMINI_MODEL_IMAGE,
        prompt: shot.imagePrompt,
        config: {
          addWatermark: false,
          numberOfImages: 1,
          aspectRatio: '9:16',
          seed: randomSeed
        }
      })
      // Extracts imageBytes and mimeType
      const imageGen = response.generatedImages[0].image
      // Checks possible errors
      if (!imageGen.imageBytes || !imageGen.mimeType) {
        throw new HttpError({
          status: 400,
          message: '[Image ERROR] Error creating an image'
        })
      }
      console.log('[Server] Image generated successfully')
      const videoGenerated = await createSingleVideo(
        genAI,
        imageGen,
        shot.videoPrompt,
        shot.duration_seconds,
        shot.clipNumber,
        randomSeed
      )
      // Return pararell statement
      resVideos.push({
        sceneNumber: shot.clipNumber,
        publicUrl: videoGenerated
      })
    }
    // Return statement
    return resVideos
  } catch (error) {
    throw new HttpError({
      status: error?.status || 500,
      message: error?.message || error
    })
  }
}

const createSingleVideo = async (
  genAI,
  imageGen,
  videoPrompt,
  duration,
  clipNumber,
  randomSeed
) => {
  try {
    // Console log
    console.log('[Server] Creating a video based on image...')
    // Generating video
    let operation = await genAI.models.generateVideos({
      model: process.env.GEMINI_MODEL_VIDEO,
      prompt: videoPrompt,
      image: {
        imageBytes: imageGen.imageBytes,
        mimeType: imageGen.mimeType
      },
      config: {
        aspectRatio: '9:16',
        numberOfVideos: 1,
        durationSeconds: duration,
        personGeneration: 'allow_adult',
        seed: randomSeed
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
    // Checks operation response
    if (
      !operation.response?.generatedVideos ||
      operation.response.generatedVideos.length === 0
    ) {
      console.log(
        '[Server] Operation finished. Full response:',
        JSON.stringify(operation, null, 2)
      )
      throw new HttpError({
        status: 400,
        message: `[Server ERROR] Video generation failed. The operation completed but no video was returned. Finish Reason might be safety or other issues.`
      })
    }
    // Extract uri of generated video
    const { video } = operation.response.generatedVideos[0]
    // Checks possible errors
    if (!video.videoBytes || !video.mimeType) {
      throw new HttpError({
        status: 400,
        message: '[Server ERROR] Error creating a video'
      })
    }
    // Transform to buffer
    const videoBuffer = Buffer.from(video.videoBytes, 'base64')
    // Localpath
    const tempFileName = `video-${clipNumber}-${uuidv4()}.mp4`
    const localTempPath = `/tmp/generated_videos/${tempFileName}`
    await fs.writeFile(localTempPath, videoBuffer)
    // Upload file to GCS
    const destinationPath = `videos/${process.env.JCCG_CODE_PROJECTID}/${tempFileName}`
    const publicUrl = await gCloudStorageLib.uploadFileToGCS(
      localTempPath,
      destinationPath
    )
    // Deletes localTempPath
    fs.unlink(localTempPath)
    // Return statement
    return publicUrl
  } catch (error) {
    throw new HttpError({
      status: error?.status || 500,
      message: error?.message || error
    })
  }
}
