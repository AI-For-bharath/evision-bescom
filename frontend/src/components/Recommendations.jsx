import { useEffect, useState } from 'react'
import ErrorBanner from './ErrorBanner.jsx'
import LoadingBlock from './LoadingBlock.jsx'
import { fetchRecommendations } from '../services/api.js'
import { getErrorMessage } from '../services/errorMessage.js'

const BADGE_CLASS = {
  Critical: 'recommendation__badge--critical',
  Warning: 'recommendation__badge--warning',
  Normal: 'recommendation__badge--normal',
}

export default function Recommendations() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [retryKey, setRetryKey] = useState(0)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await fetchRecommendations()
        if (!cancelled) setData(res)
      } catch (e) {
        if (!cancelled) setError(getErrorMessage(e, 'Could not load recommendations.'))
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [retryKey])

  const suggestions = data?.suggestions ?? []
  const bestZones = data?.bestZones ?? []

  const retry = () => setRetryKey((k) => k + 1)

  return (
    <section className="recommendation" aria-labelledby="recommendations-heading">
      <h2 id="recommendations-heading" className="dashboard__section-title">
        Grid response & infrastructure planning
      </h2>
      <p className="dashboard__section-desc">
        Ranked interventions and siting candidates derived from live zone stress and spare capacity — designed for
        control-room briefings and investment committee decks.
      </p>

      {error && (
        <ErrorBanner
          className="recommendation__stack"
          title="Recommendations unavailable"
          onRetry={retry}
        >
          {error}
        </ErrorBanner>
      )}

      {loading && !error && <LoadingBlock label="Loading recommendations…" />}

      {!loading && !error && (
        <div className="recommendation__grid fade-in">
          <div className="card recommendation__card">
            <h3 className="recommendation__card-title">Suggested actions</h3>
            {suggestions.length === 0 ? (
              <p className="muted recommendation__empty">
                No priority actions — all zones are <span className="status-pill status-pill--normal">Normal</span>.
              </p>
            ) : (
              <ul className="recommendation__action-list">
                {suggestions.map((s) => (
                  <li key={s.zone} className="recommendation__action-item">
                    <div className="recommendation__action-head">
                      <span className="recommendation__zone">{s.zone}</span>
                      <span
                        className={`recommendation__badge ${BADGE_CLASS[s.status] || ''}`.trim()}
                      >
                        {s.status}
                      </span>
                    </div>
                    <p className="recommendation__message">{s.message}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="card recommendation__card">
            <h3 className="recommendation__card-title">Best zones for new stations</h3>
            <p className="card__lede recommendation__lede">
              Lowest current grid load first — better headroom for new capacity.
            </p>
            {bestZones.length === 0 ? (
              <p className="muted recommendation__empty">No zone data.</p>
            ) : (
              <ol className="recommendation__zone-rank">
                {bestZones.map((z, i) => (
                  <li key={z.zone} className="recommendation__zone-card">
                    <span className="recommendation__rank">{i + 1}</span>
                    <div className="recommendation__zone-body">
                      <span className="recommendation__zone-name">{z.zone}</span>
                      <span className="recommendation__zone-load">{z.load}% load</span>
                    </div>
                  </li>
                ))}
              </ol>
            )}
          </div>
        </div>
      )}
    </section>
  )
}
