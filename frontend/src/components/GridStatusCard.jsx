const STATUS_BADGE = {
  Normal: 'grid-zone-card__badge--normal',
  Warning: 'grid-zone-card__badge--warning',
  Critical: 'grid-zone-card__badge--critical',
}

const STATUS_CARD = {
  Normal: 'grid-zone-card--normal',
  Warning: 'grid-zone-card--warning',
  Critical: 'grid-zone-card--critical',
}

export default function GridStatusCard({ id, zone, load, status, pulse }) {
  const cardMod = STATUS_CARD[status] || ''
  const badgeMod = STATUS_BADGE[status] || ''
  const pulseMod = pulse ? ' grid-zone-card--pulse' : ''

  return (
    <article id={id} className={`grid-zone-card ${cardMod}${pulseMod}`.trim()}>
      <div className="grid-zone-card__top">
        <h3 className="grid-zone-card__zone">{zone}</h3>
        <span className={`grid-zone-card__badge ${badgeMod}`.trim()}>{status}</span>
      </div>
      <p className="grid-zone-card__load">
        <span className="grid-zone-card__load-value">{load}</span>
        <span className="grid-zone-card__load-unit">% load</span>
      </p>
    </article>
  )
}
