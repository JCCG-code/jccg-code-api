/**
 *
 */
export default class HttpError extends Error {
  /**
   * @description A custom http error
   * @constructor
   * @param {number} status Status error code
   * @param {message} message Error message
   */
  constructor({ status, message }) {
    super(message)
    this.status = status
  }
}
