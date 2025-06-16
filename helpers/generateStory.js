// Packages
import { Type } from '@google/genai'
import dotenv from 'dotenv'
// Local files
import * as prompts from '../libs/prompts.js'
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

export const generateSceneOutline = async (
  genAI,
  ambience,
  seed,
  chosenTone,
  narrativePerspective,
  keyDramatic
) => {
  try {
    // Transform master prompt with desired ambience
    const promptToSend = prompts.generateSceneOutline
      .replaceAll('@@prompt_ambience', ambience)
      .replaceAll('@@story_seed', seed)
      .replaceAll('@@chosen_tone', chosenTone)
      .replaceAll('@@narrative_perspective', narrativePerspective)
      .replaceAll('@@key_dramatic_moment', keyDramatic)
    // Generating text
    const responseData = await genAI.models.generateContent({
      model: process.env.GEMINI_MODEL_TEXT,
      contents: promptToSend,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            scene_outline: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  description: {
                    type: Type.STRING
                  },
                  duration_seconds: {
                    type: Type.INTEGER
                  }
                },
                propertyOrdering: ['description', 'duration_seconds']
              }
            }
          },
          propertyOrdering: ['scene_outline']
        }
      }
    })
    // Extract output
    const output = JSON.parse(responseData.text)
    // Checks output
    if (!output.scene_outline || output.scene_outline.length < 1) {
      throw new HttpError({
        status: 400,
        message: `[Server ERROR] output.scene_outline does not exist`
      })
    } else {
      console.log(
        `[Server] The scene outline about ${ambience} have been done successfully`
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

export const generateNarrationScript = async (
  genAI,
  ambience,
  seed,
  chosenTone,
  sceneOutline
) => {
  try {
    // Get total duration scene
    const totalDuration = sceneOutline.reduce((sum, currentScene) => {
      return sum + currentScene.duration_seconds
    }, 0)
    // Transform master prompt with desired ambience
    const promptToSend = prompts.generateMasterNarration
      .replaceAll('@@prompt_ambience', ambience)
      .replaceAll('@@story_seed', seed)
      .replaceAll('@@chosen_tone', chosenTone)
      .replaceAll('@@scene_outline_json', JSON.stringify(sceneOutline, null, 2))
      .replaceAll('@@total_duration', totalDuration)
    // Generating text
    const responseData = await genAI.models.generateContent({
      model: process.env.GEMINI_MODEL_TEXT,
      contents: promptToSend,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            narration_script: {
              type: Type.STRING
            },
            estimated_narration_duration: {
              type: Type.STRING
            },
            video_duration: {
              type: Type.STRING
            }
          },
          propertyOrdering: [
            'narration_script',
            'estimated_narration_duration',
            'video_duration'
          ]
        }
      }
    })
    // Extract output
    const output = JSON.parse(responseData.text)
    // Checks output
    if (
      !output.narration_script ||
      !output.estimated_narration_duration ||
      !output.video_duration
    ) {
      throw new HttpError({
        status: 400,
        message: `[Server ERROR] output of narration script does not exist`
      })
    } else {
      console.log(
        `[Server] The narration about ${ambience} have been done successfully`
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

export const generateCuttingScript = async (
  genAI,
  narration,
  narrationDuration,
  sceneOutline,
  videoDuration
) => {
  try {
    // Transform master prompt with desired ambience
    const promptToSend = prompts.generateCuttingScript
      .replaceAll('@@narration_script', narration)
      .replaceAll('@@narration_duration', narrationDuration)
      .replaceAll('@@scene_outline_json', JSON.stringify(sceneOutline, null, 2))
      .replaceAll('@@video_duration', videoDuration)
    // Generating text
    const responseData = await genAI.models.generateContent({
      model: process.env.GEMINI_MODEL_TEXT,
      contents: promptToSend,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            cutting_script: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  sceneNumber: {
                    type: Type.INTEGER
                  },
                  start_time: {
                    type: Type.NUMBER
                  },
                  end_time: {
                    type: Type.NUMBER
                  }
                },
                propertyOrdering: ['sceneNumber', 'start_time', 'end_time']
              }
            }
          },
          propertyOrdering: ['cutting_script']
        }
      }
    })
    // Extract output
    const output = JSON.parse(responseData.text)
    // Checks output
    if (!output.cutting_script) {
      throw new HttpError({
        status: 400,
        message: `[Server ERROR] output.cutting_script does not exist`
      })
    } else {
      console.log(`[Server] The cutting script have been done successfully`)
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

export const generateFinalPackage = async (
  genAI,
  ambience,
  seed,
  chosenTone,
  narration,
  sceneOutline,
  cuttingScript
) => {
  try {
    // Transform master prompt with desired ambience
    const promptToSend = prompts.generateFinalPackage
      .replaceAll('@@prompt_ambience', ambience)
      .replaceAll('@@story_seed', seed)
      .replaceAll('@@chosen_tone', chosenTone)
      .replaceAll('@@narration_script', narration)
      .replaceAll('@@scene_outline_json', JSON.stringify(sceneOutline, null, 2))
      .replaceAll(
        '@@cutting_script_json',
        JSON.stringify(cuttingScript, null, 2)
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
            title: {
              type: Type.STRING
            },
            seed: {
              type: Type.STRING
            },
            narrationScript: {
              type: Type.STRING
            },
            chosenTone: {
              type: Type.STRING
            },
            narratorTone_es: {
              type: Type.STRING
            },
            suggestedVoiceName: {
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
            },
            storyboard: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  description: {
                    type: Type.STRING
                  },
                  duration_seconds: {
                    type: Type.INTEGER
                  }
                },
                propertyOrdering: ['description', 'duration_seconds']
              }
            },
            cuttingScript: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  sceneNumber: {
                    type: Type.INTEGER
                  },
                  start_time: {
                    type: Type.NUMBER
                  },
                  end_time: {
                    type: Type.NUMBER
                  }
                },
                propertyOrdering: ['sceneNumber', 'start_time', 'end_time']
              }
            }
          },
          propertyOrdering: [
            'title',
            'seed',
            'narrationScript',
            'chosenTone',
            'narratorTone_es',
            'suggestedVoiceName',
            'music_cues',
            'storyboard',
            'cuttingScript'
          ]
        }
      }
    })
    // Extract output
    const output = JSON.parse(responseData.text)
    if (
      !output.title ||
      !output.seed ||
      !output.narrationScript ||
      !output.chosenTone
    ) {
      throw new HttpError({
        status: 400,
        message: `[Server ERROR] output final package do not exist`
      })
    } else {
      console.log(
        `[Server] The final package about ${ambience} have been created successfully`
      )
      // Saving new job
      const newJob = {
        prompt: ambience,
        seed: output.seed,
        story: {
          title: output.title,
          chosenTone: output.chosenTone,
          narrationScript: output.narrationScript,
          narratorTone_es: output.narratorTone_es,
          suggestedVoiceName: output.suggestedVoiceName,
          music_cues: output.music_cues,
          storyboard: output.storyboard,
          cuttingScript: output.cuttingScript
        }
      }
      const existingJob = await Job.findOne({ prompt: ambience })
      if (!existingJob) {
        await new Job(newJob).save()
        console.log('[Mongoose] Object created')
      } else {
        // Deletes object
        await Job.findByIdAndDelete(existingJob._id)
        // Creates a new one
        await new Job(newJob).save()
        console.log('[Mongoose] Object created')
      }
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
