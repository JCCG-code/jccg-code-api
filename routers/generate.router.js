import express from 'express'
import * as generateController from '../controllers/generate.controller.js'
import { authGoogleAI } from '../middlewares/authGoogleAI.js'

// Initializations
const router = express.Router()

/**
 * @api {post} /api/generate/story Generar Historia
 * @apiVersion 1.0.0
 * @apiName GenerateStory
 * @apiGroup Generation
 * @apiPermission authGoogleAI
 *
 * @apiDescription Genera una historia corta basada en una ambientación proporcionada. Devuelve el texto de la historia, un título, el tono del narrador, un nombre de voz sugerido y pistas musicales.
 *
 * @apiBody {String} ambience La ambientación o tema deseado para la historia.
 *
 * @apiExample {json} Ejemplo de Body:
 * {
 *    "ambience": "Dark Souls 2"
 * }
 *
 * @apiSuccess {String} status Estado de la solicitud.
 * @apiSuccess {Object} data Contenedor de los datos de la historia.
 * @apiSuccess {String} data.title Título generado para la historia.
 * @apiSuccess {String} data.story El texto completo de la historia generada.
 * @apiSuccess {String} data.narrator_tone_es El tono del narrador en español.
 * @apiSuccess {String} data.suggested_voice_name Nombre sugerido para la voz del Text-to-Speech.
 * @apiSuccess {Object[]} data.music_cues Array de objetos con pistas musicales sugeridas.
 * @apiSuccess {String} data.music_cues.text Descripción del elemento musical.
 * @apiSuccess {Number} data.music_cues.weight Peso o importancia de la pista (valor numérico).
 *
 * @apiSuccessExample {json} Respuesta Exitosa (200 OK):
 * HTTP/1.1 200 OK
 * {
 *     "status": "OK",
 *     "data": {
 *         "title": "Ecos del Bosque Caído",
 *         "story": "El aire denso y húmedo del Bosque de los Gigantes Caídos se aferraba a mi piel marchita...",
 *         "narrator_tone_es": "Melancólico, desolado, introspectivo",
 *         "suggested_voice_name": "Charon",
 *         "music_cues": [
 *             { "text": "Dark Ambient Score", "weight": 1 },
 *             { "text": "Sorrowful Strings", "weight": 1.2 },
 *             { "text": "Ethereal Chimes", "weight": 1.1 },
 *             { "text": "Subtle Drones", "weight": 0.8 }
 *         ]
 *     }
 * }
 *
 * @apiError (400 Bad Request) MissingField El campo `ambience` es obligatorio.
 * @apiErrorExample {json} Error-Response (400 Bad Request):
 * HTTP/1.1 400 Bad Request
 * {
 *   "status": "error",
 *   "message": "El campo 'ambience' es obligatorio en el cuerpo de la solicitud."
 * }
 *
 * @apiError (500 Internal Server Error) AIFailure Error en la comunicación con el modelo de IA.
 * @apiErrorExample {json} Error-Response (500 Internal Server Error):
 * HTTP/1.1 500 Internal Server Error
 * {
 *   "status": "error",
 *   "message": "No se pudo generar la historia. Por favor, inténtelo de nuevo más tarde."
 * }
 */
router.post('/story', authGoogleAI, generateController.story)

/**
 * @api {post} /api/generate/voice Generar Voz (TTS)
 * @apiVersion 1.0.0
 * @apiName GenerateVoice
 * @apiGroup Generation
 * @apiPermission authGoogleAI
 *
 * @apiDescription Convierte un texto en un archivo de audio (Text-to-Speech) utilizando un tono y nombre de voz específicos. Devuelve la ruta local temporal del archivo de audio y su duración.
 *
 * @apiBody {String} story El texto que se convertirá en voz.
 * @apiBody {String} tone El tono del narrador (ej. "Melancólico, desolado, introspectivo").
 * @apiBody {String} suggested_voice_name El nombre de la voz a utilizar para la generación.
 *
 * @apiExample {json} Ejemplo de Body:
 * {
 *    "story": "El aire denso y húmedo del Bosque de los Gigantes Caídos...",
 *    "tone": "Melancólico, desolado, introspectivo",
 *    "suggested_voice_name": "Charon"
 * }
 *
 * @apiSuccess {String} status Estado de la solicitud.
 * @apiSuccess {Object} data Contenedor de los datos del audio.
 * @apiSuccess {String} data.localTempPath Ruta en el servidor donde se ha guardado temporalmente el archivo MP3.
 * @apiSuccess {Number} data.duration Duración del archivo de audio en segundos.
 *
 * @apiSuccessExample {json} Respuesta Exitosa (200 OK):
 * HTTP/1.1 200 OK
 * {
 *     "status": "OK",
 *     "data": {
 *         "localTempPath": "/tmp/43c8179e-06bc-47f3-85ab-d3a6c50aaffb.mp3",
 *         "duration": 139.152
 *     }
 * }
 *
 * @apiError (400 Bad Request) MissingFields Faltan campos obligatorios en la solicitud.
 * @apiErrorExample {json} Error-Response (400 Bad Request):
 * HTTP/1.1 400 Bad Request
 * {
 *   "status": "error",
 *   "message": "Faltan campos obligatorios: 'story', 'tone', 'suggested_voice_name'."
 * }
 *
 * @apiError (500 Internal Server Error) TTSFailure Fallo en el servicio de Text-to-Speech.
 * @apiErrorExample {json} Error-Response (500 Internal Server Error):
 * HTTP/1.1 500 Internal Server Error
 * {
 *   "status": "error",
 *   "message": "Error al generar el audio."
 * }
 */
router.post('/voice', authGoogleAI, generateController.voice)

/**
 * @api {post} /api/generate/lyria-music Generar Música
 * @apiVersion 1.0.0
 * @apiName GenerateMusic
 * @apiGroup Generation
 * @apiPermission authGoogleAI
 *
 * @apiDescription Genera una pista de música instrumental basada en un conjunto de descripciones (cues) y una duración objetivo. Devuelve la ruta local temporal del archivo de música generado.
 *
 * @apiBody {Object[]} music_cues Array de objetos con las pistas musicales a generar.
 * @apiBody {String} music_cues.text Descripción textual del elemento musical.
 * @apiBody {Number} music_cues.weight Peso o importancia del elemento.
 * @apiBody {Number} duration Duración total deseada para la pista de música en segundos.
 *
 * @apiExample {json} Ejemplo de Body:
 * {
 *   "music_cues": [
 *        { "text": "Dark Ambient Score", "weight": 1 },
 *        { "text": "Sorrowful Strings", "weight": 1.2 },
 *        { "text": "Ethereal Chimes", "weight": 1.1 },
 *        { "text": "Subtle Drones", "weight": 0.8 }
 *    ],
 *    "duration": 139.152
 * }
 *
 * @apiSuccess {String} status Estado de la solicitud.
 * @apiSuccess {Object} data Contenedor de los datos de la música.
 * @apiSuccess {String} data.localTempPath Ruta en el servidor donde se ha guardado temporalmente el archivo MP3 de la música.
 *
 * @apiSuccessExample {json} Respuesta Exitosa (200 OK):
 * HTTP/1.1 200 OK
 * {
 *     "status": "OK",
 *     "data": {
 *         "localTempPath": "/tmp/d0e68804-6c89-4c1e-8e32-315ebc5db47f.mp3"
 *     }
 * }
 *
 * @apiError (400 Bad Request) MissingFields Faltan campos obligatorios en la solicitud.
 * @apiErrorExample {json} Error-Response (400 Bad Request):
 * HTTP/1.1 400 Bad Request
 * {
 *   "status": "error",
 *   "message": "Los campos 'music_cues' y 'duration' son obligatorios."
 * }
 *
 * @apiError (500 Internal Server Error) MusicGenFailure Fallo en el servicio de generación de música.
 * @apiErrorExample {json} Error-Response (500 Internal Server Error):
 * HTTP/1.1 500 Internal Server Error
 * {
 *   "status": "error",
 *   "message": "No se pudo generar la pista de música."
 * }
 */
router.post('/lyria-music', authGoogleAI, generateController.lyriaMusic)

/**
 * @api {post} /api/generate/images Generar Imágenes
 * @apiVersion 1.0.0
 * @apiName GenerateImages
 * @apiGroup Generation
 * @apiPermission authGoogleAI
 *
 * @apiDescription Analiza una historia y genera un conjunto de imágenes que representan escenas clave. Devuelve una lista de las rutas locales temporales de las imágenes generadas.
 *
 * @apiBody {String} ambience La ambientación general (ej. "Dark Souls 2").
 * @apiBody {String} story_seed Una breve idea o semilla que originó la historia.
 * @apiBody {String} story El texto completo de la historia para la cual se generarán las imágenes.
 *
 * @apiExample {json} Ejemplo de Body:
 * {
 *    "ambience": "Dark Souls 2",
 *    "story_seed": "Desenterrar las ruinas de una civilización pre-gigante...",
 *    "story": "El aire denso y húmedo del Bosque de los Gigantes Caídos..."
 * }
 *
 * @apiSuccess {String} status Estado de la solicitud.
 * @apiSuccess {Object[]} data Array de objetos, cada uno representando una imagen generada.
 * @apiSuccess {Number} data.sceneNumber Número de la escena asociada a la imagen.
 * @apiSuccess {String} data.path Ruta local temporal del archivo de imagen (PNG).
 *
 * @apiSuccessExample {json} Respuesta Exitosa (200 OK):
 * HTTP/1.1 200 OK
 * {
 *     "status": "OK",
 *     "data": [
 *         { "sceneNumber": 1, "path": "/tmp/generated_images/image-1-a2934beb-ee05-4317-bd2c-1c9f30d6b872.png" },
 *         { "sceneNumber": 2, "path": "/tmp/generated_images/image-2-3462a9f2-95dc-4219-90da-d37abf98b0b5.png" }
 *     ]
 * }
 *
 * @apiError (400 Bad Request) MissingField El campo `story` es obligatorio.
 * @apiErrorExample {json} Error-Response (400 Bad Request):
 * HTTP/1.1 400 Bad Request
 * {
 *   "status": "error",
 *   "message": "El campo 'story' es obligatorio para generar las imágenes."
 * }
 *
 * @apiError (500 Internal Server Error) ImageGenFailure Fallo en el servicio de generación de imágenes.
 * @apiErrorExample {json} Error-Response (500 Internal Server Error):
 * HTTP/1.1 500 Internal Server Error
 * {
 *   "status": "error",
 *   "message": "Error durante la generación de imágenes."
 * }
 */
router.post('/images', authGoogleAI, generateController.images)

/**
 * @api {post} /api/generate/video-assembly Ensamblar Vídeo
 * @apiVersion 1.0.0
 * @apiName AssembleVideo
 * @apiGroup Generation
 * @apiPermission authGoogleAI
 *
 * @apiDescription Recopila todos los recursos generados previamente (historia, voz, música, imágenes) para ensamblarlos en un único archivo de vídeo. Sube el vídeo final a un bucket de almacenamiento y devuelve la URL pública.
 *
 * @apiBody {Object} story Objeto que contiene los detalles de la historia.
 * @apiBody {String} seed La semilla o idea original de la historia.
 * @apiBody {Object} voiceGen Objeto con los datos del audio de voz generado.
 * @apiBody {Object} lyriaGen Objeto con los datos de la música generada.
 * @apiBody {Object[]} generated_images Array con los datos de las imágenes generadas.
 *
 * @apiExample {json} Ejemplo de Body:
 * {
 *   "story": {
 *     "title": "Ecos del Bosque Caído",
 *     "story": "El aire denso y húmedo...",
 *     "narrator_tone_es": "Melancólico, desolado, introspectivo",
 *     "suggested_voice_name": "Charon",
 *     "music_cues": [{ "text": "Dark Ambient Score", "weight": 1 }]
 *   },
 *   "seed": "Desenterrar las ruinas de una civilización pre-gigante...",
 *   "voiceGen": {
 *     "localTempPath": "/tmp/43c8179e-06bc-47f3-85ab-d3a6c50aaffb.mp3",
 *     "duration": 139.152
 *   },
 *   "lyriaGen": {
 *     "localTempPath": "/tmp/d0e68804-6c89-4c1e-8e32-315ebc5db47f.mp3"
 *   },
 *   "generated_images": [
 *     { "sceneNumber": 1, "path": "/tmp/generated_images/image-1-a2934beb-ee05-4317-bd2c-1c9f30d6b872.png" }
 *   ]
 * }
 *
 * @apiSuccess {String} status Estado de la solicitud.
 * @apiSuccess {Object} data Contenedor del resultado.
 * @apiSuccess {String} data.publicUrl URL pública del vídeo final ensamblado y subido al bucket de almacenamiento.
 *
 * @apiSuccessExample {json} Respuesta Exitosa (200 OK):
 * HTTP/1.1 200 OK
 * {
 *     "status": "OK",
 *     "data": {
 *         "publicUrl": "https://storage.googleapis.com/jccg-code-api-bucket/video/fit-land-461912-e9/c42352ba-3dc1-4ca4-9d11-d7005f5a2740.mp4"
 *     }
 * }
 *
 * @apiError (400 Bad Request) MissingAssets Faltan recursos necesarios para el ensamblaje.
 * @apiErrorExample {json} Error-Response (400 Bad Request):
 * HTTP/1.1 400 Bad Request
 * {
 *   "status": "error",
 *   "message": "Faltan recursos para el ensamblaje del vídeo. Se requiere 'voiceGen', 'lyriaGen' y 'generated_images'."
 * }
 *
 * @apiError (500 Internal Server Error) AssemblyFailure Error durante el proceso de ensamblaje (ej. FFmpeg).
 * @apiErrorExample {json} Error-Response (500 Internal Server Error):
 * HTTP/1.1 500 Internal Server Error
 * {
 *   "status": "error",
 *   "message": "El proceso de ensamblaje de vídeo ha fallado."
 * }
 */
router.post('/video-assembly', authGoogleAI, generateController.videoAssembly)

export default router
