import { Router } from 'express'
import { getMetrics } from '../services/sampleService.js'

const router = Router()

router.get('/metrics', (_req, res) => {
  res.json(getMetrics())
})

export default router
