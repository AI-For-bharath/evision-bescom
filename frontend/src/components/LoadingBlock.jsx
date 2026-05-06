export default function LoadingBlock({ label = 'Loading…' }) {
  return (
    <div className="loading-block" role="status" aria-live="polite" aria-busy="true">
      <span className="loading-block__spinner" aria-hidden />
      <span className="loading-block__label">{label}</span>
    </div>
  )
}
