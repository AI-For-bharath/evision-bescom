import { apiClient } from './client.js'
import { getGridStatus, getRecommendations } from '../api.js'

export async function fetchHealth() {
  const { data } = await apiClient.get('/health')
  return data
}

export async function fetchMetrics() {
  const { data } = await apiClient.get('/api/metrics')
  return data
}

export async function fetchGridStatus() {
  return getGridStatus()
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
  return getRecommendations()
}

export async function postSimulate(growth) {
  const { data } = await apiClient.post('/simulate', { growth })
  return data
}
