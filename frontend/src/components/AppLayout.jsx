import { useEffect, useState } from 'react'
import Sidebar from './Sidebar.jsx'

export default function AppLayout({ page, onPageChange, children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  useEffect(() => {
    setIsSidebarOpen(false)
  }, [page])

  return (
    <div className="app-shell">
      <Sidebar page={page} onPageChange={onPageChange} isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      {isSidebarOpen ? <button type="button" className="app-shell__backdrop" aria-label="Close navigation" onClick={() => setIsSidebarOpen(false)} /> : null}
      <div className="app-main page-canvas">
        <header className="mobile-topbar">
          <button
            type="button"
            className="mobile-topbar__menu-btn"
            aria-label="Open navigation menu"
            aria-expanded={isSidebarOpen}
            aria-controls="sidebar-navigation"
            onClick={() => setIsSidebarOpen((open) => !open)}
          >
            <span />
            <span />
            <span />
          </button>
          <div className="mobile-topbar__brand">
            <span className="mobile-topbar__title">EVision AI</span>
            <span className="mobile-topbar__subtitle">BESCOM dashboard</span>
          </div>
        </header>
        {children}
      </div>
    </div>
  )
}
