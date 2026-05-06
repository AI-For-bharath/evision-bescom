import { Router } from 'express'
import { getRecommendations } from '../services/recommendationService.js'

const router = Router()

router.get('/recommendations', (req, res) => {
  console.log("Recommendations API hit")
  const data = getRecommendations()
  res.json(data)
})

export default router
