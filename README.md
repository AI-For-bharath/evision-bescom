# EVision AI — BESCOM (prototype)

Decision-support prototype for **behavior-aware** EV charging demand, **real-time grid** zone status, **what-if** adoption stress, and **infrastructure** siting hints — aligned with the EVision AI solution narrative. **Express** serves the **REST API** and the **built React app** in one process; the listen port is set with the **`PORT`** environment variable (default in code if unset).

## Solution alignment (this repo vs brief)

| Solution pillar | What the prototype implements | Not in scope yet (per tech brief) |
| --- | --- | --- |
| **Behavior-aware demand** | Rule-based segmentation from mock sessions: **Urgent**, **Flexible**, **Habitual** (habit-based routines); demand aggregated **per zone**. | XGBoost/LSTM time-series, learned clustering |
| **Real-time grid response** | Zones **Normal / Warning / Critical** from load thresholds; recommendations for **deferrals**, **load redistribution**, **off-peak incentives**. | Live SCADA / feeder telemetry |
| **What-if simulation** | **EV adoption growth %** scales demand and coupled grid load, reclamp & reclassify (overload **risk** view). | Per-zone adoption, new-station placement, behavior sliders as separate inputs |
| **Infrastructure planning** | **Best zones** ranked by lowest load (headroom for new stations); avoids siting on already **Critical**/**Warning** feeders in guidance. | Multi-scenario robust optimization across futures |
| **UI** | Sidebar: **Overview**, **Demand intelligence**, **Grid status**, **Planning**, **What-if simulation**, **About**; React charts, zone schematic. | Full “optimization engine” for schedules |

## Deployment (single server)

After `npm start`, the **web UI and REST API** are served from the **same application origin** (one Express process). Use your environment’s **application URL** or load balancer endpoint in front of that process.

Run `npm start` from `backend/` (or `npm start` from repo root). The first run builds `frontend/dist`, then starts Express. The SPA calls the API on the **same origin**.

## Optional: Vite dev + API (HMR)

```bash
npm run dev:split
```

Run the Vite dev server for the UI and point its proxy at your **application backend service** (see `VITE_DEV_API_PROXY` in `frontend/vite.config.js`).

## Prerequisites

- [Node.js](https://nodejs.org/) 20+ (LTS recommended)
- npm (comes with Node)

## Setup

```bash
npm install
npm run install:all
```

## Run locally

**From repo root:**

```bash
npm start
```

**Or from `backend/`:**

```bash
cd backend
npm install
npm start
```

**Skip frontend rebuild** (if `frontend/dist` exists):

```bash
cd backend
npm run serve
```

## Project layout

```
backend/
  app.js
  routes/
  services/
  data/
frontend/
  src/
    components/
    pages/
    services/
```

## Production-style hosting

Build the frontend; serve `frontend/dist` from Express (already wired) or a CDN, forwarding API paths (`/api`, `/health`, `/behavior`, `/demand`, `/grid-status`, `/simulate`, `/recommendations`) to the same backend.