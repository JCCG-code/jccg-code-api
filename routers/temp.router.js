import express from 'express'
import * as tempController from '../controllers/temp.controller.js'

// Initializations
const router = express.Router()

router.get('/output-file', tempController.outputFile)

export default router
