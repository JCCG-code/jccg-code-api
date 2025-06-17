import mongoose from 'mongoose'

const storySeedSchema = new mongoose.Schema(
  {
    ambience: { type: String, required: true, index: true },
    story_seed: {
      seed: { type: String, required: true },
      suggested_genre: { type: String, required: true }
    },
    is_used: { type: Boolean, default: false }
  },
  {
    versionKey: false,
    timestamps: false
  }
)

const StorySeed = mongoose.model('StorySeed', storySeedSchema)

export default StorySeed
