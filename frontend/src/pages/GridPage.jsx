import { useEffect, useMemo, useState } from 'react'
import ErrorBanner from '../components/ErrorBanner.jsx'
import GridStatusCard from '../components/GridStatusCard.jsx'
import LoadingBlock from '../components/LoadingBlock.jsx'
import PageHeader from '../components/PageHeader.jsx'
import ZoneVisualization from '../components/ZoneVisualization.jsx'
import { useDashboardData } from '../hooks/useDashboardData.js'
import { getApiEndpointLabel } from '../services/client.js'
import { gridZoneDomId, resolveHighlightZones } from '../utils/gridHighlight.js'

const PULSE_MS = 4500
const PULSE_MS_EMPTY = 800

export default function GridPage({ highlightRequest, onHighlightConsumed }) {
  const { grid, demand, loading, error, retry } = useDashboardData()
  const [pulseZoneSet, setPulseZoneSet] = useState(() => new Set())

  const gridSig = useMemo(
    () => grid.map((z) => `${z.zone}:${z.load}:${z.status}`).join('|'),
    [grid],
  )

  const demandSig = useMemo(() => JSON.stringify(demand ?? {}), [demand])

  useEffect(() => {
    if (!highlightRequest?.spec) {
      setPulseZoneSet(new Set())
      return undefined
    }

    if (loading) {
      setPulseZoneSet(new Set())
      return undefined
    }

    const zones = resolveHighlightZones(grid, demand, highlightRequest.spec)
    setPulseZoneSet(new Set(zones))

    const scrollId = window.requestAnimationFrame(() => {
      const first = zones[0]
      if (first) {
        document.getElementById(gridZoneDomId(first))?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        })
      }
    })

    const delay = zones.length > 0 ? PULSE_MS : PULSE_MS_EMPTY
    const clearId = window.setTimeout(() => {
      setPulseZoneSet(new Set())
      onHighlightConsumed?.()
    }, delay)

    return () => {
      window.cancelAnimationFrame(scrollId)
      window.clearTimeout(clearId)
    }
  }, [highlightRequest?.id, highlightRequest?.spec, gridSig, demandSig, loading, onHighlightConsumed])

  return (
    <div className="dashboard">
      <PageHeader
        eyebrow="Grid operations"
        title="Real-time zone status"
        description="Each zone is scored against headroom thresholds — the same signal that powers deferrals, load shifting, and incentive messaging in Planning."
        meta={
          <>
            <span>Telemetry (prototype)</span>
            <code className="page-header__code">{getApiEndpointLabel()}</code>
          </>
        }
      />

      {error && (
        <ErrorBanner className="dashboard__stack" title="Could not load data" onRetry={retry}>
          {error} Verify the application backend service is running and reachable.
        </ErrorBanner>
      )}

      <div className="dashboard__section" id="grid-feeder-section">
        <h2 className="dashboard__section-title">Feeder load & health</h2>
        <p className="dashboard__section-desc">
          Normal · Warning · Critical — color language matches utility control-room conventions so the story reads
          instantly in a demo.
        </p>
        {loading && !error && <LoadingBlock label="Loading grid status…" />}
        {!loading && !error && grid.length > 0 && (
          <>
            <div className="grid-status-cards">
              {grid.map((z) => (
                <GridStatusCard
                  key={z.zone}
                  id={gridZoneDomId(z.zone)}
                  zone={z.zone}
                  load={z.load}
                  status={z.status}
                  pulse={pulseZoneSet.has(z.zone)}
                />
              ))}
            </div>
            <ZoneVisualization zones={grid} pulseZones={pulseZoneSet} />
          </>
        )}
        {!loading && !error && grid.length === 0 && <p className="muted">No grid data.</p>}
      </div>
    </div>
  )
}
