const MAP = {
  Normal: 'status-pill--normal',
  Warning: 'status-pill--warning',
  Critical: 'status-pill--critical',
}

export default function StatusPill({ status }) {
  if (!status) return null
  const cls = MAP[status] || 'status-pill--muted'
  return <span className={`status-pill ${cls}`}>{status}</span>
}
