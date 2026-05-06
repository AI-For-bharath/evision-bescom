import {
  GlyphAbout,
  GlyphDemand,
  GlyphGrid,
  GlyphOverview,
  GlyphPlanning,
  GlyphSimulation,
} from './NavGlyph.jsx'

const NAV = [
  { id: 'overview', label: 'Overview', Icon: GlyphOverview },
  { id: 'demand', label: 'Demand intelligence', Icon: GlyphDemand },
  { id: 'grid', label: 'Grid status', Icon: GlyphGrid },
  { id: 'planning', label: 'Planning', Icon: GlyphPlanning },
  { id: 'simulation', label: 'What-if simulation', Icon: GlyphSimulation },
  { id: 'about', label: 'About', Icon: GlyphAbout },
]

export default function Sidebar({ page, onPageChange, isOpen, onClose }) {
  const handleNavigate = (id) => {
    onPageChange(id)
    onClose?.()
  }

  return (
    <aside className={`sidebar${isOpen ? ' sidebar--open' : ''}`} aria-label="Main navigation" id="sidebar-navigation">
      <div className="sidebar__brand">
        <div className="sidebar__mark" aria-hidden>
          <span className="sidebar__mark-inner">⚡</span>
        </div>
        <div className="sidebar__brand-text">
          <div className="sidebar__title">EVision AI</div>
          <div className="sidebar__subtitle">BESCOM · prototype</div>
        </div>
      </div>
      <nav className="sidebar__nav" aria-label="Sections">
        {NAV.map(({ id, label, Icon }) => (
          <button
            key={id}
            type="button"
            className={`sidebar__link${page === id ? ' sidebar__link--active' : ''}`}
            onClick={() => handleNavigate(id)}
          >
            <span className="sidebar__icon" aria-hidden>
              <Icon />
            </span>
            <span className="sidebar__label">{label}</span>
          </button>
        ))}
      </nav>
      <div className="sidebar__footer">
        <div className="sidebar__pill">
          <span className="sidebar__pill-dot" aria-hidden />
          Live decision support
        </div>
        <p className="sidebar__hint">Bengaluru grid ops narrative</p>
      </div>
    </aside>
  )
}
