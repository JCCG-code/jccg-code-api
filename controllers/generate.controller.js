// Local imports
import * as generateStory from '../helpers/generateStory.js'
import * as generateVoice from '../helpers/generateVoice.js'
import * as generateMusic from '../helpers/generateMusic.js'
import * as generateImages from '../helpers/generateImages.js'
import * as generateVideos from '../helpers/generateVideos.js'
import * as generateVideo from '../helpers/generateVideo.js'
import * as storySeedDB from '../helpers/db/storySeedDB.js'
// Models
import Job from '../models/Job.model.js'

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
    // Count unused seeds
    const unusedSeeds = await storySeedDB.countUnusedSeeds(body.ambience)
    if (unusedSeeds < 5) {
      // Generating new seeds
      const newSeeds = await generateStory.generateStorySeeds(
        req.genAI,
        body.ambience,
        usedSeeds
      )
      // Saving into DB
      await storySeedDB.addSeeds(body.ambience, newSeeds.story_seeds)
    }
    // Getting one seeds to the new story
    const { story_seed } = await storySeedDB.getAndUseNextSeed(body.ambience)
    // Generating direction
    const direction = await generateStory.generateCreativeDirection(
      req.genAI,
      body.ambience,
      story_seed
    )
    // Generating story
    const { story } = await generateStory.generateStoryFromDirection(
      req.genAI,
      body.ambience,
      story_seed,
      direction.chosen_tone,
      direction.narrative_perspective,
      direction.key_dramatic_moment
    )
    // Generating final package
    const finalPackage = await generateStory.generateFinalPackage(
      req.genAI,
      body.ambience,
      story,
      story_seed
    )
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
  if (!body.story || !body.narrative_style || !body.suggested_voice_name) {
    return res.status(400).json({
      status: 'FAILED',
      data: {
        error:
          'story, narrative_style or suggested_voice_name are required in body parameters'
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
      body.narrative_style
    )
    // Generating voice
    // Info log
    console.log(
      '[Server] FFmpeg is transforming audio to mp3 file. Please wait...'
    )
    const voiceGen = await generateVoice.generateGeminiVoice(
      TTSStory,
      body.suggested_voice_name
    )
    // Update instance
    const existingJob = await Job.findOne({
      'story.story': body.story,
      'story.narrative_style': body.narrative_style,
      'story.suggested_voice_name': body.suggested_voice_name
    })
    if (!existingJob) {
      console.log('[Mongoose] Existing Job was not found')
    } else {
      await Job.findOneAndUpdate({ _id: existingJob._id }, { voiceGen })
      console.log('[Mongoose] Object updated')
    }
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
      body.duration + 2
    )
    // Update instance
    const existingJob = await Job.findOne({
      'voiceGen.duration': body.duration,
      'story.music_cues': body.music_cues
    })
    if (!existingJob) {
      console.log('[Mongoose] Existing Job was not found')
    } else {
      await Job.findOneAndUpdate(
        { _id: existingJob._id },
        { lyriaGen: response }
      )
      console.log('[Mongoose] Object updated')
    }
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
    // Generates images and upload to GCS
    const images = await generateImages.generateImagesFromShotList(
      req.genAI,
      shotList.shotList
    )
    // Update instance
    const existingJob = await Job.findOne({
      prompt_ambience: body.ambience
    })
    if (!existingJob) {
      console.log('[Mongoose] Existing Job was not found')
    } else {
      await Job.findOneAndUpdate(
        { _id: existingJob._id },
        { generated_images: images }
      )
      console.log('[Mongoose] Object updated')
    }
    // Return statement
    return res.status(200).send({ status: 'OK', data: images })
  } catch (err) {
    res
      .status(err?.status || 500)
      .send({ status: 'FAILED', data: { error: err?.message || err } })
  }
}

export const videos = async (req, res) => {
  const { body } = req
  // Mandatory fields
  if (!body.ambience || !body.story_seed || !body.story || !body.duration) {
    return res.status(400).json({
      status: 'FAILED',
      data: {
        error:
          'ambience, story_seed, story or duration are required in body parameters'
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
    console.log('[Server] Extracting visual tokens...')
    // Extracts visual tokens
    const visualTokens = await generateImages.extractVisualTokens(
      req.genAI,
      body.ambience,
      body.story_seed,
      body.story
    )
    console.log('[Server] Extracting a list of clips...')
    // Generates shot list from tokens
    const clipList = await generateVideos.planClipStoryboard(
      req.genAI,
      body.duration,
      body.story
    )
    console.log('CLip list created: ', JSON.stringify(clipList, null, 2))
    console.log('[Server] Extracting prompts to images...')
    const storyBoardWithImage =
      await generateVideos.enrichStoryboardWithPrompts(
        req.genAI,
        visualTokens,
        clipList
      )
    console.log('[Server] Extracting prompts to videos and creating videos...')
    const imageVideoPrompts = await generateVideos.generateVideoPrompts(
      req.genAI,
      storyBoardWithImage
    )
    const videosResponse = await generateVideos.createsVideos(
      req.genAI,
      imageVideoPrompts
    )
    // Update instance
    const existingJob = await Job.findOne({
      prompt_ambience: body.ambience
    })
    if (!existingJob) {
      console.log('[Mongoose] Existing Job was not found')
    } else {
      await Job.findOneAndUpdate(
        { _id: existingJob._id },
        { generated_videos: videosResponse }
      )
      console.log('[Mongoose] Object updated')
    }
    // Return statement
    return res.status(200).send({ status: 'OK', data: videosResponse })
  } catch (err) {
    res
      .status(err?.status || 500)
      .send({ status: 'FAILED', data: { error: err?.message || err } })
  }
}

export const videoAssembly = async (req, res) => {
  const { body } = req
  // Mandatory fields
  if (!body.voiceGen || !body.lyriaGen || !body.generated_videos) {
    return res.status(400).json({
      status: 'FAILED',
      data: {
        error:
          'voiceGen, lyriaGen or generated_videos are required in body parameters'
      }
    })
  }
  try {
    // Assembling video
    const responseData = await generateVideo.generateVideoAssembly(
      body.voiceGen,
      body.lyriaGen,
      body.generated_videos
    )
    // Update instance
    const existingJob = await Job.findOne({
      voiceGen: body.voiceGen,
      lyriaGen: body.lyriaGen,
      generated_videos: body.generated_videos
    })
    if (!existingJob) {
      console.log('[Mongoose] Existing Job was not found')
    } else {
      await Job.findOneAndUpdate(
        { _id: existingJob._id },
        {
          $set: { finalVideo: responseData },
          $unset: {
            voiceGen: {},
            lyriaGen: {},
            generated_videos: []
          }
        },
        { new: false }
      )
      console.log(
        '[Mongoose] Object updated: finalVideo added and old fields removed.'
      )
    }
    // Return statement
    return res.status(200).send({ status: 'OK', data: responseData })
  } catch (err) {
    res
      .status(err?.status || 500)
      .send({ status: 'FAILED', data: { error: err?.message || err } })
  }
}
