import express from 'express'
import { authGoogleAI } from '../middlewares/authGoogleAI.js' // Asumo que este middleware existe

// Initializations
const router = express.Router()

// Generate controller
import * as generateController from '../controllers/generate.controller.js'

/**
 * @file Rutas para la generación de contenido creativo multimedia utilizando modelos de IA.
 * @module routes/generateRoutes
 * @requires express
 * @requires middlewares/authGoogleAI
 * @requires controllers/generate.controller
 */

/**
 * Conjunto de rutas relacionadas con la generación de contenido.
 * Base Path: / (relativo al montaje de estas rutas en la app principal, ej. /api/v1/generate)
 * @name GenerateRoutes
 * @namespace GenerateRoutes
 */

/**
 * @typedef {object} StoryRequestBody
 * @property {string} model - El nombre o identificador del modelo de IA a utilizar para la generación (ej. "gemini-1.5-flash-latest"). Obligatorio.
 * @property {string} ambience - La temática o ambientación deseada para la historia (ej. "Dark Souls 2", "Elden Ring", "Córdoba"). Obligatorio.
 */

/**
 * @typedef {object} GeneratedStoryData
 * @property {string} title - Título de la historia generada.
 * @property {string} story - El texto completo de la historia narrativa.
 * @property {string} narrator_tone - Descripción del tono que debe adoptar un narrador para la historia.
 * @property {string} suggested_voice_name - Nombre de la voz sugerida de Gemini TTS para narrar la historia.
 * @property {string[]} music_cues - Array de tres cadenas de texto con sugerencias para música ambiente.
 * @property {string} image_prompt - Prompt detallado para generar una imagen basada en la historia.
 */

/**
 * @typedef {object} SuccessStoryResponse
 * @property {string} status - Estado de la respuesta, siempre "OK" en caso de éxito.
 * @property {GeneratedStoryData} data - El objeto con el paquete de contenido generado.
 */

/**
 * Ruta para generar un paquete de contenido creativo multimedia (historia, prompts, etc.).
 * @name POST/story
 * @function
 * @memberof module:routes/generateRoutes~GenerateRoutes
 * @inner
 * @param {string} path - URL del endpoint: `/story`.
 * @param {function} authGoogleAI - Middleware para autenticación o preparación específica antes de llamar al controlador.
 * @param {function} generateController.story - Controlador que maneja la lógica de generación de la historia.
 * @returns {void} - No devuelve directamente, sino que envía una respuesta HTTP.
 *
 * @description
 * Este endpoint recibe el nombre de un modelo de IA y una ambientación temática.
 * Internamente, utiliza un prompt maestro para instruir al modelo de IA especificado
 * para generar un paquete de contenido creativo que incluye un título, una historia narrativa,
 * tono para el narrador, voz sugerida para TTS, pistas para música ambiente y un prompt para imagen.
 * La `X-API-KEY` para la autenticación de esta API debe ser enviada en las cabeceras.
 *
 * @consumes application/json
 * @produces application/json
 *
 * @param {StoryRequestBody} request.body.required - El cuerpo de la solicitud en formato JSON.
 *
 * @response {200} SuccessStoryResponse - Respuesta exitosa con el paquete de contenido generado.
 *   @example response - 200 - Ejemplo de respuesta exitosa
 *   {
 *     "status": "OK",
 *     "data": {
 *       "title": "Ecos de Ceniza y Olvido",
 *       "story": "Drangleic se extiende, un sudario de ruinas y ecos...",
 *       "narrator_tone": "Melancólico, reflexivo y desolador",
 *       "suggested_voice_name": "Charon",
 *       "music_cues": [
 *         "Dark ambient drone",
 *         "Symphonic despair",
 *         "Ethereal choir dirge"
 *       ],
 *       "image_prompt": "A lone, heavily armored knight..."
 *     }
 *   }
 * @response {400} ErrorResponse - Solicitud incorrecta (ej. campos obligatorios faltantes).
 *   @example response - 400 - Ejemplo de error de validación
 *   {
 *     "message": "model y ambience son requeridos."
 *   }
 * @response {401} ErrorResponse - No autorizado (ej. API Key de la API propia inválida o faltante).
 *   @example response - 401 - Ejemplo de error de autorización
 *   {
 *     "message": "Unauthorized: Invalid or missing API Key"
 *   }
 * @response {500} ErrorResponse - Error interno del servidor (ej. fallo al contactar la IA).
 *   @example response - 500 - Ejemplo de error interno
 *   {
 *     "message": "Error al generar paquete de contenido.",
 *     "error": "Detalle del error de la IA o del sistema."
 *   }
 *
 * @see {@link module:controllers/generate.controller.story} Para la implementación del controlador.
 */
router.post('/story', authGoogleAI, generateController.story)

export default router
