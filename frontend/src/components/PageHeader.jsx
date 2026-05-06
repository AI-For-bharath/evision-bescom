export default function PageHeader({ eyebrow, title, description, meta }) {
  return (
    <header className="page-header">
      <div className="page-header__top">
        {eyebrow ? (
          <span className="page-header__eyebrow">
            <span className="page-header__eyebrow-dot" aria-hidden />
            {eyebrow}
          </span>
        ) : null}
      </div>
      <div className="page-header__title-row">
        <h1 className="page-header__title">{title}</h1>
      </div>
      {description ? <p className="page-header__description">{description}</p> : null}
      {meta ? <div className="page-header__meta">{meta}</div> : null}
    </header>
  )
}
