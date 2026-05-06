import { evData } from '../data/evData.js'

/** How many sessions count as frequent / habit-based routines (Habitual in API JSON). */
const HABITUAL_MIN_SESSIONS = 3

/** Long-duration thresholds (hours). */
const LONG_AVG_HOURS = 4.5
const LONG_MAX_HOURS = 6

/** Irregularity of plug-in time across sessions (hours, sample stdev). */
const IRREGULAR_HOUR_STDEV = 2.5

function mean(values) {
  return values.reduce((a, b) => a + b, 0) / values.length
}

function sampleStdev(values) {
  if (values.length < 2) return 0
  const m = mean(values)
  const variance =
    values.reduce((s, x) => s + (x - m) ** 2, 0) / (values.length - 1)
  return Math.sqrt(variance)
}

/** Typical commuter / routine windows (demo heuristic). */
function isRegularHour(hour) {
  return (hour >= 7 && hour <= 11) || (hour >= 17 && hour <= 22)
}

/**
 * @param {Array<{ chargingTime: number, duration: number }>} sessions
 * @returns {'Habitual' | 'Urgent' | 'Flexible'} API values — Habitual = habit-based routines.
 */
export function classifyBehavior(sessions) {
  const n = sessions.length
  const durations = sessions.map((s) => s.duration)
  const hours = sessions.map((s) => s.chargingTime)
  const avgDuration = mean(durations)
  const maxDuration = Math.max(...durations)
  const hourSpread = sampleStdev(hours)

  if (n >= HABITUAL_MIN_SESSIONS) return 'Habitual'

  const longDuration =
    avgDuration >= LONG_AVG_HOURS || maxDuration >= LONG_MAX_HOURS

  const irregular =
    n >= 2
      ? hourSpread >= IRREGULAR_HOUR_STDEV ||
        hours.some((h) => !isRegularHour(h))
      : !isRegularHour(hours[0])

  if (irregular && longDuration) return 'Urgent'

  return 'Flexible'
}

/**
 * Groups `evData` by `userId`, assigns behavior, returns sorted list.
 * @returns {{ userId: number, behavior: string }[]}
 */
export function getBehaviorByUser() {
  const byUser = new Map()
  for (const row of evData) {
    const id = row.userId
    if (!byUser.has(id)) byUser.set(id, [])
    byUser.get(id).push({
      chargingTime: row.chargingTime,
      duration: row.duration,
    })
  }

  const results = []
  for (const [userId, sessions] of byUser) {
    results.push({
      userId,
      behavior: classifyBehavior(sessions),
    })
  }

  results.sort((a, b) => a.userId - b.userId)
  return results
}
