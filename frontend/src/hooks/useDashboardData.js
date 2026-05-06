import { useCallback, useEffect, useState } from 'react'
import { fetchBehavior, fetchDemand, fetchGridStatus } from '../services/api.js'
import { getErrorMessage } from '../services/errorMessage.js'

export function useDashboardData() {
  const [grid, setGrid] = useState([])
  const [demand, setDemand] = useState(null)
  const [behavior, setBehavior] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [retryKey, setRetryKey] = useState(0)

  const loadData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [g, d, b] = await Promise.all([fetchGridStatus(), fetchDemand(), fetchBehavior()])
      setGrid(Array.isArray(g) ? g : [])
      setDemand(d)
      setBehavior(Array.isArray(b) ? b : [])
    } catch (e) {
      setError(getErrorMessage(e, 'Could not load data.'))
      setGrid([])
      setDemand(null)
      setBehavior([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData, retryKey])

  const retry = useCallback(() => {
    setRetryKey((k) => k + 1)
  }, [])

  return { grid, demand, behavior, loading, error, retry }
}
