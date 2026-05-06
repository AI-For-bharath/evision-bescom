import { Router } from 'express'
import { getDemandByZone } from '../services/demandService.js'

const router = Router()

router.get('/', (_req, res) => {
  res.json(getDemandByZone())
})

export default router
