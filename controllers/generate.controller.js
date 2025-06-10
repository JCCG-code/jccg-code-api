// Local imports
import * as generateStory from '../helpers/generateStory.js'

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
  if (!req.genAI) {
    return res.status(400).json({
      status: 'FAILED',
      data: { error: 'genAI not provided' }
    })
  }
  try {
    // Generating direction
    const direction = await generateStory.generateCreativeDirection(
      req.genAI,
      body.model,
      body.ambience
    )
    // Checking output
    if (
      !direction.chosen_tone ||
      !direction.story_focus ||
      !direction.key_element
    ) {
      return res.status(400).json({
        status: 'FAILED',
        data: {
          error:
            'chosen_tone, story_focus or key_element have not been provided or they are missing.'
        }
      })
    }
    console.log('[Server Generation]: Creative direction created successfully.')
    // Generating story
    const story = await generateStory.generateStoryFromDirection(
      req.genAI,
      body.model,
      body.ambience,
      direction.chosen_tone,
      direction.story_focus,
      direction.key_element
    )
    if (!story.story) {
      return res.status(400).json({
        status: 'FAILED',
        data: {
          error: `An error occurred by creating an story of ${body.ambience}.`
        }
      })
    }
    console.log(
      '[Server Generation]: Tone, story foucs and key element created successfully.'
    )
    // Generating final package
    const finalPackage = await generateStory.generateFinalPackage(
      req.genAI,
      body.model,
      body.ambience,
      story.story
    )
    if (
      !finalPackage.title ||
      !finalPackage.story ||
      !finalPackage.narrator_tone_es ||
      !finalPackage.music_cues ||
      !finalPackage.image_prompt
    ) {
      return res.status(400).json({
        status: 'FAILED',
        data: {
          error: `An error occurred by creating a final package of ${body.ambience}.`
        }
      })
    }
    console.log('[Server Generation]: Final package created successfully.')
    // Return statement
    return res.status(200).send({ status: 'OK', data: finalPackage })
  } catch (err) {
    res
      .status(err?.status || 500)
      .send({ status: 'FAILED', data: { error: err?.message || err } })
  }
}
