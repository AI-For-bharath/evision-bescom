import { evData } from '../data/evData.js'

const ZONES = ['Zone A', 'Zone B', 'Zone C', 'Zone D', 'Zone E']

/**
 * Behavior-aware demand view (prototype): total charging hours per zone = Σ session duration
 * for EV rows in that zone (concentrated time/location load input to planning).
 * @returns {Record<string, number>}
 */
export function getDemandByZone() {
  const demand = Object.fromEntries(ZONES.map((z) => [z, 0]))

  for (const row of evData) {
    const z = row.zone
    if (demand[z] === undefined) demand[z] = 0
    demand[z] += row.duration
  }

  return demand
}
