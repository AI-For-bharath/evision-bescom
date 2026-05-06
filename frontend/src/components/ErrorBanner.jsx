export default function ErrorBanner({
  title,
  children,
  onRetry,
  className = '',
}) {
  return (
    <div
      className={`ui-banner ui-banner--error ${className}`.trim()}
      role="alert"
    >
      <div className="ui-banner__content">
        {title ? <p className="ui-banner__title">{title}</p> : null}
        <p className="ui-banner__message">{children}</p>
      </div>
      {typeof onRetry === 'function' && (
        <button type="button" className="ui-banner__retry" onClick={onRetry}>
          Retry
        </button>
      )}
    </div>
  )
}
