import HttpError from '../errors/HttpError.js'
import Job from '../models/Job.model.js'

function normalize(str) {
  return str.toLowerCase().replace(/-/g, ' ').replace(/\s+/g, ' ').trim()
}

export const getOneJob = async (req, res) => {
  // Req params
  const { params } = req
  if (!params.ambience) {
    res.status(400).send({
      status: 'FAILED',
      data: {
        error: 'Ambience not provided'
      }
    })
    return
  }
  try {
    // Extract all initial prompts
    const prompts = await Job.find({}).select('prompt_ambience -_id')
    // Normalizing to compare
    const normalizedQuery = normalize(params.ambience)
    // Search and compare
    const match = prompts.find(
      (item) => normalize(item.prompt_ambience) === normalizedQuery
    )
    if (!match || !match.prompt_ambience) {
      throw new HttpError({
        status: 401,
        message:
          '[Server ERROR] Ambience from query paramenters not found in our systems'
      })
    }
    // Extracts selected job
    const selectedJob = await Job.findOne({
      prompt_ambience: match.prompt_ambience
    })
    // Return statement
    return res.status(200).send({ status: 'OK', data: selectedJob })
  } catch (err) {
    res
      .status(err?.status || 500)
      .send({ status: 'FAILED', data: { error: err?.message || err } })
  }
}
