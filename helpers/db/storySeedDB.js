// Models
import StorySeed from '../../models/StorySeed.model.js'
// Errors
import HttpError from '../../errors/HttpError.js'

export const addSeeds = async (ambience, seeds) => {
  try {
    // Inserting new seeds
    const seedsToInsert = seeds.map((text) => ({
      ambience: ambience,
      seed_text: text
    }))
    // Saving
    await StorySeed.insertMany(seedsToInsert, { ordered: false })
    // Return statement
    return true
  } catch (error) {
    throw new HttpError({
      status: error?.status || 500,
      message: error?.message || error
    })
  }
}

export const getUsedSeeds = async (ambience) => {
  try {
    // Get used seeds
    const response = await StorySeed.find({
      ambience: ambience,
      is_used: true
    }).select('seed_text -_id')
    // Return statement
    return response
  } catch (error) {
    throw new HttpError({
      status: error?.status || 500,
      message: error?.message || error
    })
  }
}

export async function countUnusedSeeds(ambience) {
  try {
    // Get unused seeds
    const count = await StorySeed.countDocuments({
      ambience: ambience,
      is_used: false
    })
    // Return statement
    return count
  } catch (error) {
    throw new HttpError({
      status: error?.status || 500,
      message: error?.message || error
    })
  }
}

export async function getAndUseNextSeed(ambience) {
  try {
    // Get unused seeds and updates to used
    const seed = await StorySeed.findOneAndUpdate(
      { ambience: ambience, is_used: false },
      { $set: { is_used: true } },
      { new: false, sort: { createdAt: 1 } }
    ).select('seed_text -_id')
    // Return statement
    return seed
  } catch (error) {
    throw new HttpError({
      status: error?.status || 500,
      message: error?.message || error
    })
  }
}
