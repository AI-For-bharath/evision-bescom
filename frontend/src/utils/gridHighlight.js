/**
 * Stable DOM id for scrolling to a zone card.
 * @param {string} zone
 */
export function gridZoneDomId(zone) {
  return `grid-zone-${String(zone).replace(/\s+/g, '-')}`
}

/**
 * Which zone keys to pulse for a given highlight spec.
 * @param {{ zone: string, status: string }[]} grid
 * @param {Record<string, number>|null|undefined} demand
 * @param {GridHighlightSpec} spec
 * @returns {string[]}
 */
export function resolveHighlightZones(grid, demand, spec) {
  if (!spec || !Array.isArray(grid)) return []
  if (spec.type === 'status') {
    return grid.filter((z) => z.status === spec.status).map((z) => z.zone)
  }
  if (spec.type === 'demandPeak') {
    const peaks = peakDemandZoneKeys(demand)
    return peaks.filter((z) => grid.some((g) => g.zone === z))
  }
  if (spec.type === 'all') {
    return grid.map((z) => z.zone)
  }
  return []
}

function peakDemandZoneKeys(demand) {
  if (!demand || typeof demand !== 'object') return []
  let max = -Infinity
  for (const v of Object.values(demand)) {
    if (typeof v === 'number' && v > max) max = v
  }
  if (max === -Infinity) return []
  return Object.entries(demand)
    .filter(([, v]) => typeof v === 'number' && v === max)
    .map(([z]) => z)
}
