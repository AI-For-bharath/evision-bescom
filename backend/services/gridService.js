import { gridData } from '../data/gridData.js'

/** Real-time grid response (prototype): load % vs thresholds → zone status for decision support. */

/**
 * @param {number} load
 * @returns {'Normal' | 'Warning' | 'Critical'}
 */
export function classifyLoad(load) {
  if (load > 90) return 'Critical'
  if (load >= 70) return 'Warning'
  return 'Normal'
}

/**
 * @returns {{ zone: string, load: number, status: string }[]}
 */
export function getGridStatus() {
  return gridData.map(({ zone, load }) => ({
    zone,
    load,
    status: classifyLoad(load),
  }))
}
