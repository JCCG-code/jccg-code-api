import express from 'express'
import dotenv from 'dotenv'
import mongoose from 'mongoose'

// Dot env
dotenv.config()

// Routers
import generateRouter from './routers/generate.router.js'
import tempRouter from './routers/temp.router.js'

// Initializations
const app = express()
const PORT = process.env.PORT || 4500

// Middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Routes
app.use('/api/generate', generateRouter)
app.use('/api/temp', tempRouter)

// Mongoose connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('[Server] DB connection has been done successfully')
  })
  .catch((err) => {
    console.log('[Server ERROR] DB connection failed. ', err)
  })
// Server is listening
app.listen(PORT, () => {
  console.log(`[Server] Application is listening on http://localhost:${PORT}`)
})

// Optional: export to test or other modules
export default app
