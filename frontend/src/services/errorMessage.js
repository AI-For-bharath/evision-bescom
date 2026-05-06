/**
 * @param {unknown} err
 * @param {string} [fallback]
 */
export function getErrorMessage(err, fallback = 'Something went wrong') {
  const data = err?.response?.data
  if (typeof data === 'string' && data.trim()) {
    return data
  }
  if (data && typeof data === 'object' && data.error != null) {
    return String(data.error)
  }
  if (data && typeof data === 'object' && data.message != null) {
    return String(data.message)
  }
  if (typeof err?.message === 'string') {
    if (err.message === 'Network Error') {
      return 'Network error — check that the API is reachable.'
    }
    return err.message
  }
  return fallback
}
