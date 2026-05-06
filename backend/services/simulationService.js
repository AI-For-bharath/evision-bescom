import { gridData } from '../data/gridData.js'
import { getDemandByZone } from './demandService.js'
import { classifyLoad } from './gridService.js'

const LOAD_MIN = 0
const LOAD_MAX = 100

/**
 * What-if simulation (prototype): models higher EV adoption / charging stress as a
 * uniform growth % on baseline demand, couples stress into grid load, reclamp [0,100],
 * then reclassifies zones (overload risk view for planners).
 * Full solution: per-zone adoption, new stations, and behavior shifts as separate levers.
 *
 * @param {number} growthPercent e.g. 30 → +30% on baseline demand and grid coupling
 * @returns {{ updatedDemand: Record<string, number>, updatedGrid: { zone: string, load: number, status: string }[] }}
 */
export function simulateGrowth(growthPercent) {
  const g = Number(growthPercent)
  if (!Number.isFinite(g)) {
    throw new TypeError('growth must be a finite number')
  }

  const factor = 1 + g / 100
  const baseDemand = getDemandByZone()

  const updatedDemand = {}
  for (const [zone, value] of Object.entries(baseDemand)) {
    updatedDemand[zone] = Math.round(value * factor)
  }

  const updatedGrid = gridData.map(({ zone, load }) => {
    const nextLoad = Math.min(
      LOAD_MAX,
      Math.max(LOAD_MIN, Math.round(load * factor)),
    )
    return {
      zone,
      load: nextLoad,
      status: classifyLoad(nextLoad),
    }
  })

  return { updatedDemand, updatedGrid }
}
