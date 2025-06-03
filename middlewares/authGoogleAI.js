import { GoogleGenAI } from '@google/genai'
import dotenv from 'dotenv'
import HttpError from '../errors/HttpError.js'

dotenv.config()

/**
 * Allows to iniciate a googleGenAI instance
 * @param {object} req - Request express object
 * @param {object} res - Response express object
 * @param {object} next - Next express object
 */
export const authGoogleAI = async (req, res, next) => {
  // genAI instance
  const aiInstance = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY })
  if (!aiInstance) {
    throw new HttpError({
      status: 400,
      message: 'Gemini API KEY failed. Please check your credential.'
    })
  }
  // Save isntance in request object
  req.genAI = aiInstance
  next()
}
