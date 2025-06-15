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
    path: { type: String, required: true }
  },
  { _id: false }
)

const JobSchema = new mongoose.Schema(
  {
    prompt: {
      // El prompt original del usuario, ej: "Dark Souls 2"
      type: String,
      unique: true,
      required: true
    },
    seed: {
      type: String,
      unique: true
    },

    story: {
      title: String,
      story: String,
      narrator_tone_es: String,
      suggested_voice_name: String,
      music_cues: [MusicCueSchema]
    },

    voiceGen: {
      publicUrl: String,
      duration: Number
    },

    lyriaGen: {
      publicUrl: String
    },

    generated_images: [GeneratedImageSchema],

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
