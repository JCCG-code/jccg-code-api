import mongoose from 'mongoose'

const MusicCueSchema = new mongoose.Schema(
  {
    text: { type: String, required: true },
    weight: { type: Number, required: true }
  },
  { _id: false }
)

const GeneratedImageSchema = new mongoose.Schema(
  {
    sceneNumber: { type: Number, required: true },
    publicUrl: { type: String, required: true }
  },
  { _id: false }
)

const JobSchema = new mongoose.Schema(
  {
    prompt_ambience: {
      type: String,
      unique: true,
      required: true
    },
    seed: {
      type: String,
      unique: true,
      required: true
    },

    story: {
      title: String,
      story: String,
      narrator_tone_es: String,
      narrative_style: String,
      suggested_voice_name: String,
      music_cues: [MusicCueSchema]
    },

    voiceGen: {
      publicUrl: String,
      duration: Number
    },

    lyriaGen: {
      publicUrl: String,
      duration: Number
    },

    generated_images: [GeneratedImageSchema],
    generated_videos: [GeneratedImageSchema],

    finalVideo: {
      publicUrl: String
    }
  },

  // --- Timestamps ---
  {
    versionKey: false,
    timestamps: true
  }
)

const Job = mongoose.model('Job', JobSchema)

export default Job
