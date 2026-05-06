import { apiClient } from './client.js'

export async function fetchHealth() {
  const { data } = await apiClient.get('/health')
  return data
}

export async function fetchMetrics() {
  const { data } = await apiClient.get('/api/metrics')
  return data
}

export async function fetchGridStatus() {
  const { data } = await apiClient.get('/grid-status')
  return data
}

export async function fetchDemand() {
  const { data } = await apiClient.get('/demand')
  return data
}

export async function fetchBehavior() {
  const { data } = await apiClient.get('/behavior')
  return data
}

export async function fetchRecommendations() {
  const { data } = await apiClient.get('/recommendations')
  return data
}

export async function postSimulate(growth) {
  const { data } = await apiClient.post('/simulate', { growth })
  return data
}
