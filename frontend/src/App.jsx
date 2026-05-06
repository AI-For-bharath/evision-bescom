import { useCallback, useState } from 'react'
import AppLayout from './components/AppLayout.jsx'
import AboutPage from './pages/AboutPage.jsx'
import DemandPage from './pages/DemandPage.jsx'
import GridPage from './pages/GridPage.jsx'
import OverviewPage from './pages/OverviewPage.jsx'
import PlanningPage from './pages/PlanningPage.jsx'
import SimulationPage from './pages/SimulationPage.jsx'

function App() {
  const [page, setPage] = useState('overview')
  const [gridHighlight, setGridHighlight] = useState(null)

  const handlePageChange = useCallback((next) => {
    if (next !== 'grid') setGridHighlight(null)
    setPage(next)
  }, [])

  const goToGridWithHighlight = useCallback((spec) => {
    setGridHighlight({ id: Date.now(), spec })
    setPage('grid')
  }, [])

  const clearGridHighlight = useCallback(() => {
    setGridHighlight(null)
  }, [])

  let content = null
  switch (page) {
    case 'overview':
      content = <OverviewPage onNavigateToGrid={goToGridWithHighlight} />
      break
    case 'demand':
      content = <DemandPage />
      break
    case 'grid':
      content = <GridPage highlightRequest={gridHighlight} onHighlightConsumed={clearGridHighlight} />
      break
    case 'planning':
      content = <PlanningPage />
      break
    case 'simulation':
      content = <SimulationPage />
      break
    case 'about':
      content = <AboutPage />
      break
    default:
      content = <OverviewPage />
  }

  return (
    <AppLayout page={page} onPageChange={handlePageChange}>
      {content}
    </AppLayout>
  )
}

export default App
