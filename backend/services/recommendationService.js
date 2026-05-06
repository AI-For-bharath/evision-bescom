import { getGridStatus } from './gridService.js'

function suggestionForZone(zone, status) {
  if (status === 'Critical') {
    return `${zone}: Critical — prioritize charging deferrals for non-urgent sessions, redistribute flexible load to lower-stress feeders, and stagger remaining demand to relieve localized overload.`
  }
  if (status === 'Warning') {
    return `${zone}: Warning — strengthen off-peak incentives (overnight / valley tariffs) and pre-position flexible charging before the feeder approaches critical limits.`
  }
  return null
}

/**
 * Intelligent infrastructure planning (prototype): combines real-time grid state with
 * headroom ranking — best zones for new stations avoid already-stressed feeders.
 * @returns {{ suggestions: { zone: string, status: string, message: string }[], bestZones: { zone: string, load: number }[] }}
 */
export function getRecommendations() {
  const grid = getGridStatus()

  const suggestions = []
  for (const { zone, load, status } of grid) {
    if (status === 'Critical' || status === 'Warning') {
      suggestions.push({
        zone,
        status,
        message: suggestionForZone(zone, status),
      })
    }
  }

  const bestZones = [...grid]
    .sort((a, b) => a.load - b.load)
    .map(({ zone, load }) => ({ zone, load }))

  return { suggestions, bestZones }
}
