import PageHeader from '../components/PageHeader.jsx'
import Recommendations from '../components/Recommendations.jsx'
import { getApiEndpointLabel } from '../services/client.js'

export default function PlanningPage() {
  return (
    <div className="dashboard">
      <PageHeader
        eyebrow="Optimization layer"
        title="Planning & recommendations"
        description="Prioritized operator actions and ranked siting options — bridges raw grid state to what teams can do this week and where to expand next."
        meta={
          <>
            <span>Endpoint</span>
            <code className="page-header__code">GET /recommendations</code>
            <span className="page-header__meta-sep">·</span>
            <code className="page-header__code">{getApiEndpointLabel()}</code>
          </>
        }
      />

      <Recommendations />
    </div>
  )
}
