import * as jsonHandler from '../helpers/jsonHandler.js'

// Path output file
const outputPath = '/tmp/output.json'

export const outputFile = async (req, res) => {
  try {
    const outputData = await jsonHandler.readOrInitializeJson(outputPath)
    // Return statement
    return res.status(200).send({ status: 'OK', data: outputData })
  } catch (err) {
    res
      .status(err?.status || 500)
      .send({ status: 'FAILED', data: { error: err?.message || err } })
  }
}
