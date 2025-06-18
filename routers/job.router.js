import express from 'express'
import * as jobController from '../controllers/job.controller.js'
import { authGoogleAI } from '../middlewares/authGoogleAI.js'

// Initializations
const router = express.Router()

router.get('/:ambience', jobController.getOneJob)

export default router
