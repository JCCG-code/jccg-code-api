import express from 'express'
import dotenv from 'dotenv'

// Dot env
dotenv.config()

// Routers
import generateRouter from './routers/generate.router.js'

// Initializations
const app = express()
const PORT = process.env.PORT || 3000

// Middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Routes
app.use('/api/generate', generateRouter)

// Server is listening
app.listen(PORT, () => {
  console.log(`Servidor Express escuchando en el puerto ${PORT}`)
  console.log(`Accede en http://localhost:${PORT}`)
})

// Optional: export to test or other modules
export default app
