import { GoogleGenAI } from '@google/genai'
import dotenv from 'dotenv'
import HttpError from '../errors/HttpError.js'

dotenv.config()

/**
 * Middleware de Express para autenticar con la API de Google GenAI.
 * Crea una instancia del cliente de GenAI y la adjunta al objeto `req`.
 * Lanza un HttpError si la clave API falla.
 * @function authGoogleAI
 * @async
 * @param {object} req - Objeto de solicitud Express. Se le añadirá la propiedad `genAI`.
 * @param {object} res - Objeto de respuesta Express.
 * @param {object} next - Función para pasar al siguiente middleware.
 * @throws {HttpError} Si la API Key de Gemini no es válida o falla la instanciación.
 */
export const authGoogleAI = async (req, res, next) => {
  try {
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
  } catch (error) {
    // An error by GoogleGenAI
    const httpError = new HttpError({
      status: error.status || 500,
      message: error.message || 'Failed to initialize Google GenAI client.'
    })
    next(httpError)
  }
}
