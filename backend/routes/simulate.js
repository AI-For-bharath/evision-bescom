import { Router } from 'express'
import { simulateGrowth } from '../services/simulationService.js'

const router = Router()

router.post('/', (req, res) => {
  const { growth } = req.body ?? {}
  if (growth === undefined || growth === null) {
    return res.status(400).json({ error: 'Missing "growth" in JSON body' })
  }
  try {
    const result = simulateGrowth(growth)
    res.json(result)
  } catch (err) {
    res.status(400).json({ error: err.message ?? 'Invalid growth' })
  }
})

export default router
