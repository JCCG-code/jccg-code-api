// Packages
import fs from 'fs'

const localPath = '/usr/src/app/debug_log.txt'

export const writeDebugFile = (promptName, promptContent) => {
  const content = `------
  PROMPT ${promptName}
  ${promptContent}
  ------`
  fs.appendFile(localPath, content, (err) => {
    if (err) {
      console.log(
        '[Server ERROR] An error occurred while writting into debug_log.txt'
      )
      return
    }
  })
}
