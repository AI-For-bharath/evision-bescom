import { useMemo } from 'react'

const ZONE_ORDER = ['Zone A', 'Zone B', 'Zone C', 'Zone D', 'Zone E']

const STATUS_MOD = {
  Normal: 'zone-viz__cell--normal',
  Warning: 'zone-viz__cell--warning',
  Critical: 'zone-viz__cell--critical',
}

/**
 * Simple schematic grid of zones (not a map). Colors follow grid status.
 * @param {{ zone: string, load: number, status: string }[]} zones
 * @param {Set<string>} [pulseZones] zones to briefly emphasize (same keys as `zone`, e.g. "Zone A")
 */
export default function ZoneVisualization({ zones, pulseZones }) {
  const tiles = useMemo(() => {
    const byZone = new Map((zones || []).map((z) => [z.zone, z]))
    return ZONE_ORDER.map((zone) => {
      const row = byZone.get(zone)
      return {
        zone,
        load: row?.load,
        status: row?.status,
      }
    })
  }, [zones])

  return (
    <div className="zone-viz" aria-label="Zone status schematic">
      <h3 className="zone-viz__title">Zone overview</h3>
      <div className="zone-viz__grid" role="list">
        {tiles.map((t) => {
          const mod = t.status ? STATUS_MOD[t.status] || 'zone-viz__cell--unknown' : 'zone-viz__cell--unknown'
          const pulse = pulseZones?.has(t.zone) ? ' zone-viz__cell--pulse' : ''
          return (
            <div
              key={t.zone}
              className={`zone-viz__cell ${mod}${pulse}`.trim()}
              role="listitem"
              title={`${t.zone}: ${t.load != null ? `${t.load}% load` : '—'} · ${t.status ?? 'Unknown'}`}
            >
              <span className="zone-viz__name">{t.zone.replace('Zone ', '')}</span>
              <span className="zone-viz__load-line">{t.load != null ? `${t.load}%` : '—'}</span>
              {t.status ? <span className="zone-viz__status">{t.status}</span> : null}
            </div>
          )
        })}
      </div>
      <p className="zone-viz__note muted">Schematic grid — not geographic. Color = grid status.</p>
    </div>
  )
}
