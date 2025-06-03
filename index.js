import express, { request, response } from 'express';

const app = express();

const PORT = process.env.PORT || 3000;

/**
 * @file Archivo principal de la API.
 * @module index
 * @description Configura y arranca el servidor Express.
 */

/**
 * Manejador para la ruta principal (GET /).
 * Devuelve un saludo.
 * @name handleGetRoot
 * @function
 * @memberof module:index
 * @param {request} req - Objeto de solicitud Express.
 * @param {response} res - Objeto de respuesta Express.
 * @returns {void}
 */
app.get('/', (req, res) => {
  res.status(200).send('¡Hola Mundo desde Express.js con ES Modules!');
});

app.listen(PORT, () => {
  console.log(`Servidor Express escuchando en el puerto ${PORT}`);
  console.log(`Accede en http://localhost:${PORT}`);
});

// Optional: export to test or other modules
export default app;
