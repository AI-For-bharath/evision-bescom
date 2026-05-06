import Sidebar from './Sidebar.jsx'

export default function AppLayout({ page, onPageChange, children }) {
  return (
    <div className="app-shell">
      <Sidebar page={page} onPageChange={onPageChange} />
      <div className="app-main page-canvas">{children}</div>
    </div>
  )
}
