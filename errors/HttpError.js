/**
 * Clase para representar errores HTTP con un estado y mensaje.
 * Extiende la clase Error nativa.
 * @class HttpError
 * @augments {Error}
 */
export default class HttpError extends Error {
  /**
   * Crea una instancia de HttpError.
   * @param {object} params - Parámetros para el error.
   * @param {number} params.status - El código de estado HTTP para este error.
   * @param {string} params.message - El mensaje de error.
   */
  constructor({ status, message }) {
    super(message)
    this.status = status
  }
}
