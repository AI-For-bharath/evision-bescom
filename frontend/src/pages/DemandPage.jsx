import { useMemo } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import ErrorBanner from '../components/ErrorBanner.jsx'
import LoadingBlock from '../components/LoadingBlock.jsx'
import PageHeader from '../components/PageHeader.jsx'
import StatusCard from '../components/StatusCard.jsx'
import { useDashboardData } from '../hooks/useDashboardData.js'
import { getApiEndpointLabel } from '../services/client.js'
import { aggregateBehavior, BEHAVIOR_COLORS } from '../utils/behaviorStats.js'

const DEMAND_BAR = '#2563eb'
const CHART_GRID = '#e2e8f0'
const TOOLTIP_STYLE = {
  borderRadius: 12,
  border: '1px solid rgba(15, 23, 42, 0.08)',
  boxShadow: '0 12px 40px rgba(15, 23, 42, 0.12)',
}

export default function DemandPage() {
  const { demand, behavior, loading, error, retry } = useDashboardData()

  const demandChartData = useMemo(() => {
    if (!demand || typeof demand !== 'object') return []
    return Object.entries(demand).map(([zone, value]) => ({
      zone: zone.replace('Zone ', ''),
      hours: value,
    }))
  }, [demand])

  const behaviorPieData = useMemo(() => aggregateBehavior(behavior), [behavior])

  return (
    <div className="dashboard">
      <PageHeader
        eyebrow="Demand intelligence"
        title="Behavior-aware load"
        description="Zone-level charging concentration plus user archetypes — the inputs that make scheduling and infrastructure guidance credible."
        meta={
          <>
            <span>Source</span>
            <code className="page-header__code">{getApiEndpointLabel()}</code>
          </>
        }
      />

      {error && (
        <ErrorBanner className="dashboard__stack" title="Could not load data" onRetry={retry}>
          {error} Verify the application backend service is running and reachable.
        </ErrorBanner>
      )}

      <StatusCard title="Charging hours by zone">
        <p className="card__lede">
          Aggregated session duration per zone — where time and geography stack up before you run scenarios or pick new
          sites.
        </p>
        {loading && !error && <LoadingBlock label="Loading demand…" />}
        {!loading && !error && demandChartData.length > 0 && (
          <div className="chart-wrap chart-wrap--demand chart-surface">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={demandChartData}
                margin={{ top: 16, right: 16, left: 4, bottom: 8 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke={CHART_GRID} vertical={false} />
                <XAxis dataKey="zone" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={{ stroke: '#cbd5e1' }} />
                <YAxis tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip cursor={{ fill: 'rgba(37, 99, 235, 0.06)' }} contentStyle={TOOLTIP_STYLE} />
                <Legend />
                <Bar dataKey="hours" name="Hours" fill={DEMAND_BAR} radius={[8, 8, 0, 0]} maxBarSize={52} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
        {!loading && !error && demandChartData.length === 0 && <p className="muted">No demand data.</p>}
      </StatusCard>

      <StatusCard title="Behavior segmentation">
        <p className="card__lede">
          Urgent (charge now), Flexible (shiftable), and Habit-based (routine) — replaces a single “average driver”
          assumption when you reason about peaks and policy.
        </p>
        {loading && !error && <LoadingBlock label="Loading behavior…" />}
        {!loading && !error && behaviorPieData.length > 0 && (
          <div className="chart-wrap chart-wrap--pie chart-surface">
            <ResponsiveContainer width="100%" height={320}>
              <PieChart>
                <Pie
                  data={behaviorPieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={72}
                  outerRadius={118}
                  paddingAngle={2}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={{ stroke: '#94a3b8' }}
                >
                  {behaviorPieData.map((entry) => (
                    <Cell key={entry.key} fill={BEHAVIOR_COLORS[entry.key] || '#64748b'} />
                  ))}
                </Pie>
                <Tooltip formatter={(value, name) => [`${value} users`, name]} contentStyle={TOOLTIP_STYLE} />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
        {!loading && !error && behavior.length > 0 && behaviorPieData.length === 0 && (
          <p className="muted">No behavior data.</p>
        )}
      </StatusCard>
    </div>
  )
}
