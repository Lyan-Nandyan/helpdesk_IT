// src/index.js
import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import publicRoutes from './routes/publicRoute.js'
import ticketsRoutes from './routes/ticketRoute.js'
import adminRoutes from './routes/adminRoute.js'
import 'dotenv/config'

const app = express()
const port = process.env.PORT
// middleware global
app.use(cors({
  origin: 'http://localhost:5173',   credentials: true,
}))
app.use(express.json())
app.use(morgan('dev'))

// route dasar
app.get('/', (req, res) => {
  res.json({ message: 'Helpdesk IT API' })
})

// pasang route dengan prefix
app.use('/api', publicRoutes)
app.use('/api/tickets', ticketsRoutes)
app.use('/api', adminRoutes)

// error handler fallback
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err)
  res.status(500).json({ message: 'Internal server error' })
})

app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`)
})
