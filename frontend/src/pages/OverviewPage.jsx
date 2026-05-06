import { useMemo } from 'react'
import ErrorBanner from '../components/ErrorBanner.jsx'
import LoadingBlock from '../components/LoadingBlock.jsx'
import PageHeader from '../components/PageHeader.jsx'
import StatusCard from '../components/StatusCard.jsx'
import { useDashboardData } from '../hooks/useDashboardData.js'
import { getApiEndpointLabel } from '../services/client.js'
import { aggregateBehavior } from '../utils/behaviorStats.js'

function sumDemand(demand) {
  if (!demand || typeof demand !== 'object') return 0
  return Object.values(demand).reduce((a, v) => a + (typeof v === 'number' ? v : 0), 0)
}

export default function OverviewPage({ onNavigateToGrid }) {
  const { grid, demand, behavior, loading, error, retry } = useDashboardData()

  const stats = useMemo(() => {
    const critical = grid.filter((z) => z.status === 'Critical').length
    const warning = grid.filter((z) => z.status === 'Warning').length
    const normal = grid.filter((z) => z.status === 'Normal').length
    const hours = sumDemand(demand)
    const pie = aggregateBehavior(behavior)
    return { critical, warning, normal, hours, records: behavior.length, pie }
  }, [grid, demand, behavior])

  const goGrid = (spec) => {
    if (typeof onNavigateToGrid === 'function') onNavigateToGrid(spec)
  }

  return (
    <div className="dashboard">
      <PageHeader
        eyebrow="EVision AI"
        title="Operations overview"
        description="Executive snapshot of grid stress, aggregated charging load, and behavior mix — tuned for operator and jury walkthroughs."
        meta={
          <>
            <span>Data source</span>
            <code className="page-header__code">{getApiEndpointLabel()}</code>
          </>
        }
      />

      {error && (
        <ErrorBanner className="dashboard__stack" title="Could not load data" onRetry={retry}>
          {error} Verify the application backend service is running and reachable.
        </ErrorBanner>
      )}

      {loading && !error && <LoadingBlock label="Loading overview…" />}

      {!loading && !error && (
        <>
          <div className="overview__stats">
            <button
              type="button"
              className="overview__stat overview__stat--action"
              onClick={() => goGrid({ type: 'status', status: 'Critical' })}
              aria-label="Open grid status filtered to critical zones"
            >
              <span className="overview__stat-label">Critical zones</span>
              <span className="overview__stat-value overview__stat-value--critical">{stats.critical}</span>
            </button>
            <button
              type="button"
              className="overview__stat overview__stat--action"
              onClick={() => goGrid({ type: 'status', status: 'Warning' })}
              aria-label="Open grid status filtered to warning zones"
            >
              <span className="overview__stat-label">Warning zones</span>
              <span className="overview__stat-value overview__stat-value--warning">{stats.warning}</span>
            </button>
            <button
              type="button"
              className="overview__stat overview__stat--action"
              onClick={() => goGrid({ type: 'status', status: 'Normal' })}
              aria-label="Open grid status filtered to normal zones"
            >
              <span className="overview__stat-label">Normal zones</span>
              <span className="overview__stat-value">{stats.normal}</span>
            </button>
            <button
              type="button"
              className="overview__stat overview__stat--action"
              onClick={() => goGrid({ type: 'demandPeak' })}
              aria-label="Open grid status and highlight peak demand zones"
            >
              <span className="overview__stat-label">Total charging hours</span>
              <span className="overview__stat-value">{stats.hours.toFixed(1)}</span>
            </button>
            <button
              type="button"
              className="overview__stat overview__stat--action"
              onClick={() => goGrid({ type: 'all' })}
              aria-label="Open grid status and highlight all zones"
            >
              <span className="overview__stat-label">EV session records</span>
              <span className="overview__stat-value">{stats.records}</span>
            </button>
          </div>

          {stats.pie.length > 0 && (
            <StatusCard title="Behavior mix (summary)">
              <p className="card__lede">
                Quick read on urgent vs flexible vs habit-style users — open Demand intelligence for the interactive
                breakdown.
              </p>
              <ul className="overview__behavior-list">
                {stats.pie.map((row) => (
                  <li key={row.key}>
                    <strong>{row.name}</strong>
                    <span className="muted"> — {row.value}</span>
                  </li>
                ))}
              </ul>
            </StatusCard>
          )}

          <StatusCard title="Where to go next">
            <p className="card__lede">
              Use the sidebar: drill into <strong>Demand intelligence</strong> and <strong>Grid status</strong>, open{' '}
              <strong>Planning</strong> for prioritized actions and siting, run <strong>What-if simulation</strong> for
              adoption stress, and read <strong>About</strong> for the narrative behind the product. Tip: click the KPI
              tiles above to jump to Grid status with matching zones highlighted.
            </p>
          </StatusCard>
        </>
      )}
    </div>
  )
}
