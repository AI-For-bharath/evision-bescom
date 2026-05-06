export default function StatusCard({ title, children, className = '' }) {
  return (
    <section className={`surface-card card ${className}`.trim()}>
      <div className="surface-card__accent" aria-hidden />
      <h2 className="surface-card__heading">{title}</h2>
      <div className="surface-card__body">{children}</div>
    </section>
  )
}
