import mongoose from 'mongoose'

const MusicCueSchema = new mongoose.Schema(
  {
    text: { type: String, required: true },
    weight: { type: Number, required: true }
  },
  { _id: false }
)

const SceneSchema = new mongoose.Schema(
  {
    description: { type: String, required: true },
    duration_seconds: { type: Number, required: true }
  },
  { _id: false }
)

const CuttingScriptEntrySchema = new mongoose.Schema(
  {
    sceneNumber: { type: Number, required: true },
    start_time: { type: Number, required: true },
    end_time: { type: Number, required: true }
  },
  { _id: false }
)

const GeneratedVideoClipSchema = new mongoose.Schema(
  {
    sceneNumber: { type: Number, required: true },
    publicUrl: { type: String, required: true }
  },
  { _id: false }
)

const JobSchema = new mongoose.Schema(
  {
    prompt: {
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
      title: { type: String, required: true },
      chosenTone: { type: String, required: true },
      narrationScript: { type: String, required: true },
      narratorTone_es: { type: String, required: true },
      suggestedVoiceName: { type: String, required: true },
      music_cues: [MusicCueSchema],
      storyboard: [SceneSchema],
      cuttingScript: [CuttingScriptEntrySchema]
    },

    voiceGen: {
      publicUrl: String,
      duration: Number
    },

    lyriaGen: {
      publicUrl: String
    },

    videoClips: [GeneratedVideoClipSchema],

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

JobSchema.index({ prompt: 1, seed: 1 }, { unique: true })

const Job = mongoose.model('Job', JobSchema)

export default Job
