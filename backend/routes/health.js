import { Router } from 'express'
import { getHealthStatus } from '../services/health.service.js'

const router = Router()

router.get('/', (_req, res) => {
  res.json(getHealthStatus())
})

export default router
