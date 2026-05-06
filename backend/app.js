/**
 * Main server: REST API service.
 */
import express from 'express'
import cors from 'cors'
import healthRouter from './routes/health.js'
import behaviorRouter from './routes/behavior.js'
import demandRouter from './routes/demand.js'
import gridRoutes from './routes/gridRoutes.js'
import recommendationRoutes from './routes/recommendationRoutes.js'
import simulateRouter from './routes/simulate.js'
import apiRouter from './routes/api.js'

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

app.use('/health', healthRouter)
app.use('/behavior', behaviorRouter)
app.use('/demand', demandRouter)
app.use('/', gridRoutes)
app.use('/', recommendationRoutes)
app.use('/simulate', simulateRouter)
app.use('/api', apiRouter)

app.get('/', (_req, res) => {
  res.type('html').send(
    `<!DOCTYPE html><html><body style="font-family:system-ui;padding:2rem">
      <h1>EVISION BESCOM API</h1>
      <p>Backend service is running.</p>
      <p>API: <a href="/health">/health</a>, <a href="/grid-status">/grid-status</a>, …</p>
    </body></html>`,
  )
})

const server = app.listen(PORT, () => {
  console.log(`Application server listening on port ${PORT}`)
  console.log('REST API is available on this host.')
})

server.on('error', (err) => {
  console.error('Server failed to start:', err.message)
  process.exit(1)
})
