/**
 * 1000 mock EV charging sessions (stable seed for repeatable demos).
 */

function mulberry32(seed) {
  return function () {
    let t = (seed += 0x6d2b79f5)
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const rand = mulberry32(20260504)

const ZONES = ['Zone A', 'Zone B', 'Zone C', 'Zone D', 'Zone E']
/** Slightly higher share in A/B (denser areas). */
const ZONE_WEIGHTS = [26, 24, 21, 17, 12]

/** Hour 0–23: overnight + morning commute + evening return peaks. */
const HOUR_WEIGHTS = [
  4, 3, 3, 2, 2, 3, 6, 10, 12, 9, 6, 5, 5, 5, 5, 5, 6, 8, 11, 14, 13, 10, 7, 5,
]

/** Session length 1–8 h: mostly short top-ups, fewer long charges. */
const DURATION_WEIGHTS = [26, 22, 18, 14, 10, 6, 3, 1]

function pickWeighted(weights) {
  const total = weights.reduce((a, b) => a + b, 0)
  let r = rand() * total
  for (let i = 0; i < weights.length; i++) {
    r -= weights[i]
    if (r <= 0) return i
  }
  return weights.length - 1
}

function buildEvData() {
  const rows = []
  for (let i = 0; i < 1000; i++) {
    const zone = ZONES[pickWeighted(ZONE_WEIGHTS)]
    const chargingTime = pickWeighted(HOUR_WEIGHTS)
    const duration = pickWeighted(DURATION_WEIGHTS) + 1

    rows.push({
      userId: i + 1,
      zone,
      chargingTime,
      duration,
    })
  }
  return rows
}

export const evData = buildEvData()
