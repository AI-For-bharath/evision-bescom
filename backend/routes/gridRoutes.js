import { Router } from 'express'
import { getGridStatus } from '../services/gridService.js'

const router = Router()

router.get('/grid-status', (req, res) => {
  console.log("Grid status API hit")
  const data = getGridStatus()
  res.json(data)
})

export default router
