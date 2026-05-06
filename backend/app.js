/**
 * Main server: REST API + static React app (single process for prototype).
 */
import express from 'express'
import cors from 'cors'
import { existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import healthRouter from './routes/health.js'
import behaviorRouter from './routes/behavior.js'
import demandRouter from './routes/demand.js'
import gridRoutes from './routes/gridRoutes.js'
import recommendationRoutes from './routes/recommendationRoutes.js'
import simulateRouter from './routes/simulate.js'
import apiRouter from './routes/api.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const FRONTEND_DIST = join(__dirname, '../frontend/dist')

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

if (existsSync(join(FRONTEND_DIST, 'index.html'))) {
  app.use(express.static(FRONTEND_DIST))
  app.use((req, res) => {
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      return res.status(404).json({ error: 'Not found' })
    }
    if (req.path.includes('.')) {
      return res.status(404).end()
    }
    return res.sendFile(join(FRONTEND_DIST, 'index.html'))
  })
} else {
  app.get('/', (_req, res) => {
    res.type('html').send(
      `<!DOCTYPE html><html><body style="font-family:system-ui;padding:2rem">
        <h1>EVISION BESCOM API</h1>
        <p>No UI build found. Run <code>npm run build</code> in <code>frontend/</code>, then restart.</p>
        <p>API: <a href="/health">/health</a>, <a href="/grid-status">/grid-status</a>, …</p>
      </body></html>`,
    )
  })
}

const server = app.listen(PORT, () => {
  console.log(`Application server listening on port ${PORT}`)
  console.log('REST API and static UI are available on this host (same-origin deployment).')
})

server.on('error', (err) => {
  console.error('Server failed to start:', err.message)
  process.exit(1)
})
