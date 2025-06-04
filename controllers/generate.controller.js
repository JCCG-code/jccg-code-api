import { Type } from '@google/genai'
import * as prompts from '../libs/prompts.js'

/**
 * Genera una historia basada en un modelo y una ambientación proporcionados.
 * @async
 * @function story
 * @memberof module:controllers/generateController
 * @param {object} req - Objeto de solicitud Express.
 * `req.body` debe contener `model` y `ambience`.
 * Se espera que `req.genAI` haya sido adjuntado por el middleware `authGoogleAI`.
 * @param {object} res - Objeto de respuesta Express.
 * @returns {Promise<void>}
 */
export const story = async (req, res) => {
  const { body } = req
  // Mandatory fields
  if (!body.model || !body.ambience) {
    return res.status(400).json({
      status: 'FAILED',
      data: { error: 'model or ambience are required in body parameters' }
    })
  }
  try {
    // Transform master prompt with desired ambience
    const promptToSend = prompts.generateStory.replaceAll(
      '@@prompt_ambience',
      body.ambience
    )
    // Generating text
    const responseData = await req.genAI.models.generateContent({
      model: body.model,
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
            narrator_tone: {
              type: Type.STRING
            },
            suggested_voice_name: {
              type: Type.STRING
            },
            music_cues: {
              type: Type.ARRAY,
              items: {
                type: Type.STRING
              }
            },
            image_prompt: {
              type: Type.STRING
            }
          },
          propertyOrdering: [
            'title',
            'story',
            'narrator_tone',
            'suggested_voice_name',
            'music_cues',
            'image_prompt'
          ]
        }
      }
    })
    // Extract output
    const output = JSON.parse(responseData.text)
    return res.status(200).send({ status: 'OK', data: output })
  } catch (err) {
    res
      .status(err?.status || 500)
      .send({ status: 'FAILED', data: { error: err?.message || err } })
  }
}
