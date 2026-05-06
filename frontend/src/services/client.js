import axios from 'axios'

const envBase = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '')
/** Empty = same origin (single-server prototype). */
const baseURL = envBase ?? ''

export const apiClient = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
})

export function getApiBaseUrl() {
  if (baseURL) return baseURL
  if (typeof window !== 'undefined') return window.location.origin
  return ''
}

/**
 * Label for UI copy (headers, footers). Intentionally omits hostnames so demos read
 * like a deployed system; actual transport still uses {@link getApiBaseUrl} / axios.
 */
export function getApiEndpointLabel() {
  if (baseURL) return 'External API gateway (configured service URL)'
  return 'Application backend service (same origin)'
}
