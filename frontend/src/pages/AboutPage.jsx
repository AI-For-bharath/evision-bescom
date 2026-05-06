import PageHeader from '../components/PageHeader.jsx'
import StatusCard from '../components/StatusCard.jsx'

export default function AboutPage() {
  return (
    <div className="dashboard about">
      <PageHeader
        eyebrow="Product narrative"
        title="About EVision AI"
        description="Purpose-built story for utility stakeholders — what breaks today, and how this stack closes the loop between drivers, the grid, and planners."
      />

      <StatusCard title="What we are solving">
        <p className="about__text">
          As electric vehicle adoption grows in Bengaluru, charging demand clusters in time and place. That can stress
          parts of the distribution grid. Many tools focus on forecasting demand and suggesting schedules, but they
          often assume users always follow advice and that patterns stay fixed.
        </p>
        <p className="about__text">
          In practice, drivers weigh convenience, urgency, and habit. Planners also need to think about uncertain
          futures—not only today&apos;s load. The gap we target is a system that ties together{' '}
          <strong>behavior-aware demand</strong>, <strong>grid-aware response</strong>, and{' '}
          <strong>scenario-style planning</strong> in one place.
        </p>
      </StatusCard>

      <StatusCard title="How this application helps">
        <p className="about__text">
          <strong>EVision AI</strong> (this prototype) is a decision dashboard backed by a small API. It does not
          replace utility control systems; it demonstrates the workflow judges and operators care about:
        </p>
        <ul className="about__list">
          <li>
            <strong>Demand intelligence</strong> — see charging hours by zone and a simple split of urgent, flexible,
            and habit-style users so recommendations are grounded in behavior, not a single generic profile.
          </li>
          <li>
            <strong>Grid status</strong> — each zone is labeled Normal, Warning, or Critical from load so teams can see
            where stress concentrates before it becomes an outage risk.
          </li>
          <li>
            <strong>Planning</strong> — suggested actions (deferrals, redistribution, off-peak incentives) and ranked
            zones with headroom for new stations, so siting avoids already tight feeders.
          </li>
          <li>
            <strong>What-if simulation</strong> — stress-test higher adoption by scaling demand and coupled grid load to
            see overload risk and status shifts.
          </li>
        </ul>
        <p className="about__text muted about__roadmap">
          Roadmap for a production system: trained time-series models (e.g. XGBoost or LSTM), richer clustering, formal
          optimization for schedules, and multi-lever scenarios (per-zone adoption, new stations, behavior shifts).
        </p>
      </StatusCard>
    </div>
  )
}
