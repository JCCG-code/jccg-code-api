// Local imports
import * as generateStory from '../helpers/generateStory.js'
import * as generateVoice from '../helpers/generateVoice.js'
import * as generateMusic from '../helpers/generateMusic.js'
import * as generateImages from '../helpers/generateImages.js'
import * as jsonHandler from '../helpers/jsonHandler.js'
import * as storySeedDB from '../helpers/db/storySeedDB.js'

// Path output file
const outputPath = '/tmp/output.json'

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
  if (!body.ambience) {
    return res.status(400).json({
      status: 'FAILED',
      data: { error: 'ambience are required in body parameters' }
    })
  }
  if (!req.genAI) {
    return res.status(400).json({
      status: 'FAILED',
      data: { error: 'genAI not provided' }
    })
  }
  try {
    // Gets used seeds
    const usedSeeds = await storySeedDB.getUsedSeeds(body.ambience)
    const seedTexts = usedSeeds.map((it) => it.seed_text)
    // Count unused seeds
    const unusedSeeds = await storySeedDB.countUnusedSeeds(body.ambience)
    if (unusedSeeds < 5) {
      // Generating new seeds
      const newSeeds = await generateStory.generateStorySeeds(
        req.genAI,
        body.ambience,
        seedTexts
      )
      // Saving into DB
      await storySeedDB.addSeeds(body.ambience, newSeeds.story_seeds)
    }
    // Getting one seeds to the new story
    const seed = await storySeedDB.getAndUseNextSeed(body.ambience)
    // Generating direction
    const direction = await generateStory.generateCreativeDirection(
      req.genAI,
      body.ambience,
      seed
    )
    // Generating story
    const story = await generateStory.generateStoryFromDirection(
      req.genAI,
      body.ambience,
      seed,
      direction.chosen_tone,
      direction.narrative_perspective,
      direction.key_dramatic_moment
    )
    // Generating final package
    const finalPackage = await generateStory.generateFinalPackage(
      req.genAI,
      body.ambience,
      story.story
    )
    // Saving into output json file
    const outputData = await jsonHandler.readOrInitializeJson(outputPath)
    outputData.story = finalPackage
    outputData.seed = seed.seed_text
    await jsonHandler.writeJson(outputPath, outputData)
    // Return statement
    return res.status(200).send({ status: 'OK', data: finalPackage })
  } catch (err) {
    res
      .status(err?.status || 500)
      .send({ status: 'FAILED', data: { error: err?.message || err } })
  }
}

export const voice = async (req, res) => {
  const { body } = req
  // Mandatory fields
  if (!body.story || !body.tone || !body.suggested_voice_name) {
    return res.status(400).json({
      status: 'FAILED',
      data: {
        error:
          'model, story, tone or suggested voice are required in body parameters'
      }
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
    const TTSStory = await generateVoice.generateGeminiTTScript(
      req.genAI,
      body.story,
      body.tone
    )
    // Generating voice
    // Info log
    console.log(
      '[Server] FFmpeg is transforming audio to mp3 file. Please wait...'
    )
    const voiceGen = await generateVoice.generateGeminiVoice(
      req.genAI,
      TTSStory,
      body.suggested_voice_name
    )
    // Saving into output json file
    const outputData = await jsonHandler.readOrInitializeJson(outputPath)
    outputData.voiceGen = voiceGen
    await jsonHandler.writeJson(outputPath, outputData)
    // Return statement
    return res.status(200).send({ status: 'OK', data: voiceGen })
  } catch (err) {
    res
      .status(err?.status || 500)
      .send({ status: 'FAILED', data: { error: err?.message || err } })
  }
}

export const lyriaMusic = async (req, res) => {
  const { body } = req
  // Mandatory fields
  if (!body.music_cues || !body.duration) {
    return res.status(400).json({
      status: 'FAILED',
      data: {
        error: 'music_cues or duration are required in body parameters'
      }
    })
  }
  try {
    // Generating music by Lyria Realtime
    const response = await generateMusic.generateLyriaMusic(
      body.music_cues,
      body.duration + 5
    )
    // Saving into output json file
    const outputData = await jsonHandler.readOrInitializeJson(outputPath)
    outputData.lyriaGen = response
    await jsonHandler.writeJson(outputPath, outputData)
    // Return statement
    return res.status(200).send({ status: 'OK', data: response })
  } catch (err) {
    res
      .status(err?.status || 500)
      .send({ status: 'FAILED', data: { error: err?.message || err } })
  }
}

export const images = async (req, res) => {
  const { body } = req
  // Mandatory fields
  if (!body.ambience || !body.story_seed || !body.story) {
    return res.status(400).json({
      status: 'FAILED',
      data: {
        error: 'story is required in body parameters'
      }
    })
  }
  if (!req.genAI) {
    return res.status(400).json({
      status: 'FAILED',
      data: { error: 'genAI not provided' }
    })
  }
  try {
    // Extracts visual tokens
    const visualTokens = await generateImages.extractVisualTokens(
      req.genAI,
      body.ambience,
      body.story_seed,
      body.story
    )
    // Generates shot list from tokens
    const shotList = await generateImages.generateShotListFromTokens(
      req.genAI,
      visualTokens,
      body.story
    )
    console.log(shotList)
    // Return statement
    return res.status(200).send({ status: 'OK' })
  } catch (err) {
    res
      .status(err?.status || 500)
      .send({ status: 'FAILED', data: { error: err?.message || err } })
  }
}
