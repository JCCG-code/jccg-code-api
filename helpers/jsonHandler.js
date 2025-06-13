import fs from 'fs/promises'

/**
 * Lee un archivo JSON. Si no existe o está vacío, devuelve un objeto vacío.
 * @param {string} filePath - La ruta al archivo JSON.
 * @returns {Promise<object>} - El objeto JSON parseado o un objeto vacío.
 */
export const readOrInitializeJson = async (filePath) => {
  try {
    const fileContent = await fs.readFile(filePath, 'utf-8')
    if (fileContent.trim() === '') {
      return {}
    }
    return JSON.parse(fileContent)
  } catch (error) {
    if (error.code === 'ENOENT') {
      return {}
    }
    throw error
  }
}

/**
 * Escribe un objeto en un archivo JSON con formato legible.
 * @param {string} filePath - La ruta al archivo JSON.
 * @param {object} data - El objeto a escribir.
 */
export const writeJson = async (filePath, data) => {
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8')
}
