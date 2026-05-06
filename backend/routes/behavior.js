import { Router } from 'express'
import { getBehaviorByUser } from '../services/behaviorService.js'

const router = Router()

router.get('/', (_req, res) => {
  res.json(getBehaviorByUser())
})

export default router
