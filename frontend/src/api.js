const BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/$/, '')

const buildUrl = (path) => `${BASE_URL}${path}`

export const getGridStatus = async () => {
  try {
    const res = await fetch(buildUrl('/grid-status'))
    if (!res.ok) throw new Error('Failed to fetch grid status')
    return res.json()
  } catch (error) {
    throw new Error('Backend not reachable')
  }
}

export const getRecommendations = async () => {
  try {
    const res = await fetch(buildUrl('/recommendations'))
    if (!res.ok) throw new Error('Failed to fetch recommendations')
    return res.json()
  } catch (error) {
    throw new Error('Backend not reachable')
  }
}
