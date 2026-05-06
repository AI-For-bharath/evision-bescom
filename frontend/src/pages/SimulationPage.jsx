import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import ErrorBanner from '../components/ErrorBanner.jsx'
import LoadingBlock from '../components/LoadingBlock.jsx'
import PageHeader from '../components/PageHeader.jsx'
import StatusPill from '../components/StatusPill.jsx'
import { getApiEndpointLabel } from '../services/client.js'
import { getErrorMessage } from '../services/errorMessage.js'
import { fetchDemand, fetchGridStatus, postSimulate } from '../services/api.js'

const BEFORE_FILL = '#94a3b8'
const AFTER_FILL = '#2563eb'
const CHART_GRID = '#e8ecf1'
const TOOLTIP_STYLE = {
  borderRadius: 12,
  border: '1px solid rgba(15, 23, 42, 0.08)',
  boxShadow: '0 12px 40px rgba(15, 23, 42, 0.12)',
}

export default function SimulationPage() {
  const [growth, setGrowth] = useState(30)
  const [beforeDemand, setBeforeDemand] = useState(null)
  const [beforeGrid, setBeforeGrid] = useState([])
  const [after, setAfter] = useState(null)
  const [baselineLoading, setBaselineLoading] = useState(true)
  const [runLoading, setRunLoading] = useState(false)
  const [baselineError, setBaselineError] = useState(null)
  const [simulateError, setSimulateError] = useState(null)
  const [baselineRetryKey, setBaselineRetryKey] = useState(0)

  const loadBaseline = useCallback(async () => {
    setBaselineLoading(true)
    setBaselineError(null)
    try {
      const [d, g] = await Promise.all([fetchDemand(), fetchGridStatus()])
      setBeforeDemand(d)
      setBeforeGrid(Array.isArray(g) ? g : [])
    } catch (e) {
      setBaselineError(getErrorMessage(e, 'Failed to load baseline.'))
      setBeforeDemand(null)
      setBeforeGrid([])
    } finally {
      setBaselineLoading(false)
    }
  }, [])

  useEffect(() => {
    loadBaseline()
  }, [loadBaseline, baselineRetryKey])

  const demandCompare = useMemo(() => {
    if (!beforeDemand) return []
    return Object.entries(beforeDemand)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([zone, before]) => ({
        zone: zone.replace('Zone ', ''),
        before,
        after: after?.updatedDemand?.[zone] ?? null,
      }))
  }, [beforeDemand, after])

  const gridCompare = useMemo(() => {
    if (!beforeGrid.length) return []
    return beforeGrid.map((row) => {
      const next = after?.updatedGrid?.find((z) => z.zone === row.zone)
      return {
        zone: row.zone.replace('Zone ', ''),
        before: row.load,
        after: next?.load ?? null,
        afterStatus: next?.status,
      }
    })
  }, [beforeGrid, after])

  const runSimulation = useCallback(async () => {
    setRunLoading(true)
    setSimulateError(null)
    try {
      const data = await postSimulate(Number(growth))
      setAfter(data)
    } catch (e) {
      setSimulateError(getErrorMessage(e, 'Simulation failed.'))
    } finally {
      setRunLoading(false)
    }
  }, [growth])

  const retryBaseline = () => setBaselineRetryKey((k) => k + 1)

  const baselineReady = beforeDemand && beforeGrid.length > 0

  return (
    <div className="simulation">
      <PageHeader
        eyebrow="Scenario lab"
        title="What-if simulation"
        description="Stress-test adoption and charging intensity: demand and feeder load scale together so you can narrate overload risk before capital is committed."
        meta={
          <>
            <span>Baseline API</span>
            <code className="page-header__code">{getApiEndpointLabel()}</code>
          </>
        }
      />

      {baselineError && (
        <ErrorBanner
          className="simulation__stack"
          title="Baseline not loaded"
          onRetry={retryBaseline}
        >
          {baselineError}
        </ErrorBanner>
      )}

      <section className="simulation__controls card fade-in">
        <h2 className="simulation__controls-title">EV adoption / charging stress</h2>
        <div className="simulation__slider-row">
          <label className="simulation__label" htmlFor="growth-slider">
            Growth
          </label>
          <input
            id="growth-slider"
            className="simulation__slider"
            type="range"
            min={0}
            max={100}
            step={1}
            value={growth}
            onChange={(e) => {
              setGrowth(Number(e.target.value))
              setAfter(null)
              setSimulateError(null)
            }}
            disabled={runLoading || baselineLoading}
          />
          <output className="simulation__growth-value" htmlFor="growth-slider">
            {growth}%
          </output>
        </div>
        <p className="simulation__hint">
          <code>POST /simulate</code> with <code>{`{ "growth": ${growth} }`}</code> — prototype lever for “more EVs charging” (full product: per-zone adoption, new stations, behavior shifts).
        </p>
        {simulateError && (
          <div className="simulation__inline-error">
            <ErrorBanner onRetry={runSimulation}>{simulateError}</ErrorBanner>
          </div>
        )}
        <button
          type="button"
          className="simulation__run"
          onClick={runSimulation}
          disabled={runLoading || !baselineReady || baselineLoading}
        >
          {runLoading ? 'Running…' : 'Run scenario'}
        </button>
        {baselineLoading && !baselineError && (
          <LoadingBlock label="Loading baseline…" />
        )}
        {after && !simulateError && (
          <p className="simulation__ran fade-in">
            Projected <strong>+{growth}%</strong> adoption-style stress — compare before vs after demand and feeder load.
          </p>
        )}
      </section>

      <section className="simulation__charts">
        <article className="card simulation__chart-card">
          <h2 className="simulation__chart-title">Demand by zone</h2>
          <p className="card__lede">Total charging hours — baseline vs simulated.</p>
          {baselineLoading && !baselineError && <LoadingBlock label="Loading chart data…" />}
          {!baselineLoading && baselineReady && (
            <div className="chart-wrap chart-wrap--sim chart-surface">
              <ResponsiveContainer width="100%" height={320}>
                <BarChart
                  data={demandCompare}
                  margin={{ top: 12, right: 12, left: 4, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke={CHART_GRID} vertical={false} />
                  <XAxis dataKey="zone" tick={{ fill: '#64748b', fontSize: 12 }} />
                  <YAxis tick={{ fill: '#64748b', fontSize: 12 }} />
                  <Tooltip
                    formatter={(value, name) => [value == null ? '—' : value, name]}
                    contentStyle={TOOLTIP_STYLE}
                  />
                  <Legend />
                  <Bar dataKey="before" name="Before" fill={BEFORE_FILL} radius={[6, 6, 0, 0]} maxBarSize={44} />
                  {after && (
                    <Bar dataKey="after" name="After" fill={AFTER_FILL} radius={[6, 6, 0, 0]} maxBarSize={44} />
                  )}
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </article>

        <article className="card simulation__chart-card">
          <h2 className="simulation__chart-title">Grid load by zone</h2>
          <p className="card__lede">Load % — baseline vs simulated (status uses green / yellow / red thresholds).</p>
          {baselineLoading && !baselineError && <LoadingBlock label="Loading chart data…" />}
          {!baselineLoading && baselineReady && (
            <div className="chart-wrap chart-wrap--sim chart-surface">
              <ResponsiveContainer width="100%" height={320}>
                <BarChart
                  data={gridCompare}
                  margin={{ top: 12, right: 12, left: 4, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke={CHART_GRID} vertical={false} />
                  <XAxis dataKey="zone" tick={{ fill: '#64748b', fontSize: 12 }} />
                  <YAxis domain={[0, 100]} tick={{ fill: '#64748b', fontSize: 12 }} />
                  <Tooltip
                    formatter={(value, name) => [value == null ? '—' : value, name]}
                    contentStyle={TOOLTIP_STYLE}
                  />
                  <Legend />
                  <Bar dataKey="before" name="Before" fill={BEFORE_FILL} radius={[6, 6, 0, 0]} maxBarSize={44} />
                  {after && (
                    <Bar dataKey="after" name="After" fill={AFTER_FILL} radius={[6, 6, 0, 0]} maxBarSize={44} />
                  )}
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </article>
      </section>

      {after && gridCompare.length > 0 && (
        <section className="simulation__summary card fade-in">
          <h2 className="simulation__chart-title">After status by zone</h2>
          <ul className="simulation__summary-list">
            {gridCompare.map((row) => (
              <li key={row.zone}>
                <strong>Zone {row.zone}</strong>
                <span className="simulation__summary-metric">
                  <span className="simulation__summary-arrow">
                    {row.before}% → {row.after}%
                  </span>
                  {row.afterStatus ? <StatusPill status={row.afterStatus} /> : null}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}
