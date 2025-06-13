import express from 'express'
import * as generateController from '../controllers/generate.controller.js'
import { authGoogleAI } from '../middlewares/authGoogleAI.js'

// Initializations
const router = express.Router()

// ------------------------------------------------------------------------------------------
// Generar Historia
// ------------------------------------------------------------------------------------------
/**
 * @api {post} /api/generate/story Generar Paquete de Historia Creativa
 * @apiVersion 1.0.0
 * @apiName PostStory
 * @apiGroup GeneracionContenido
 * @apiPermission autenticado (via authGoogleAI middleware)
 *
 * @apiDescription
 * Este endpoint genera un paquete de contenido creativo completo (historia, título,
 * sugerencias para TTS, música e imagen) basado en un modelo de IA y una ambientación proporcionados.
 * Utiliza el servicio de Google GenAI para la generación.
 *
 * **Middleware de Autenticación:** Requiere que la solicitud pase por el middleware `authGoogleAI`,
 * el cual valida la API Key de Google GenAI.
 *
 * @apiParam (Cuerpo de la Solicitución JSON) {String} model El identificador del modelo de IA a utilizar (ej. "gemini-1.0-pro").
 * @apiParam (Cuerpo de la Solicituión JSON) {String} ambience La descripción de la ambientación deseada para la historia.
 *
 * @apiParamExample {json} Ejemplo de Cuerpo de Solicitud:
 * HTTP/1.1 POST /api/generate/story
 * Content-Type: application/json
 *
 * {
 * "model": "gemini-1.0-pro",
 * "ambience": "un bosque encantado durante el crepúsculo"
 * }
 *
 * @apiSuccess (200 OK) {String} status Estado de la respuesta, siempre "OK".
 * @apiSuccess (200 OK) {Object} data Contenedor de los datos de la historia generada.
 * @apiSuccess (200 OK) {String} data.title Título conciso y evocador de la historia.
 * @apiSuccess (200 OK) {String} data.story La narrativa de la historia generada (aprox. 200-250 palabras).
 * @apiSuccess (200 OK) {String} data.narrator_tone Tono del narrador para la síntesis de voz (TTS).
 * @apiSuccess (200 OK) {String} data.suggested_voice_name Nombre exacto de una voz de Gemini TTS sugerida.
 * @apiSuccess (200 OK) {String[]} data.music_cues Lista de 3 cadenas de texto en INGLÉS como pistas para música ambiente.
 * @apiSuccess (200 OK) {String} data.image_prompt Prompt detallado y descriptivo para la generación de una imagen inspirada en la historia.
 *
 * @apiSuccessExample {json} Respuesta Exitosa (200 OK):
 * HTTP/1.1 200 OK
 * Content-Type: application/json
 *
 * {
 * "status": "OK",
 * "data": {
 * "title": "El Secreto del Arroyo Susurrante",
 * "story": "En el corazón del bosque Crepuscular, donde los árboles tejen sombras danzantes y el arroyo canta melodías olvidadas, vivía Elara, una guardiana solitaria...",
 * "narrator_tone": "Misterioso y calmado",
 * "suggested_voice_name": "Kore",
 * "music_cues": ["Ethereal Forest Ambient", "Mystical Harp Melody", "Gentle Night Sounds"],
 * "image_prompt": "A mystical twilight forest, a lone female guardian with silver hair standing by a whispering stream with glowing flora, cinematic fantasy art, soft ethereal lighting, detailed character design."
 * }
 * }
 *
 * @apiError (400 Bad Request) {String} status Siempre "FAILED".
 * @apiError (400 Bad Request) {Object} data Contenedor del error.
 * @apiError (400 Bad Request) {String} data.error Mensaje indicando que `model` o `ambience` son requeridos.
 *
 * @apiErrorExample {json} Error: Campos Faltantes (400 Bad Request):
 * HTTP/1.1 400 Bad Request
 * Content-Type: application/json
 *
 * {
 * "status": "FAILED",
 * "data": {
 * "error": "model or ambience are required in body parameters"
 * }
 * }
 *
 * @apiError (401 Unauthorized) {String} status Siempre "FAILED".
 * @apiError (401 Unauthorized) {Object} data Contenedor del error.
 * @apiError (401 Unauthorized) {String} data.error Mensaje indicando un problema con la API Key de Gemini.
 *
 * @apiErrorExample {json} Error: Autenticación Fallida (401 Unauthorized):
 * HTTP/1.1 401 Unauthorized
 * Content-Type: application/json
 *
 * {
 * "status": "FAILED",
 * "data": {
 * "error": "Gemini API KEY failed or instance creation failed. Please check your credential."
 * }
 * }
 *
 * @apiError (500 Internal Server Error) {String} status Siempre "FAILED".
 * @apiError (500 Internal Server Error) {Object} data Contenedor del error.
 * @apiError (500 Internal Server Error) {String} data.error Mensaje genérico de error del servidor.
 *
 * @apiErrorExample {json} Error: Error Interno del Servidor (500 Internal Server Error):
 * HTTP/1.1 500 Internal Server Error
 * Content-Type: application/json
 *
 * {
 * "status": "FAILED",
 * "data": {
 * "error": "An unexpected error occurred during story generation."
 * }
 * }
 */
router.post('/story', authGoogleAI, generateController.story)

router.post('/voice', authGoogleAI, generateController.voice)

router.post('/lyria-music', authGoogleAI, generateController.lyriaMusic)

router.post('/images', authGoogleAI, generateController.images)

export default router
