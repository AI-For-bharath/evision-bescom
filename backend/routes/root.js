import { Router } from 'express'

const router = Router()

router.get('/', (_req, res) => {
  res.type('html').send(`<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><title>EVISION BESCOM API</title></head>
<body style="font-family:system-ui;margin:2rem;line-height:1.6">
  <h1>EVISION BESCOM API</h1>
  <p>JSON <strong>REST API</strong> for this service. For split development, run the UI dev server and proxy requests to this <strong>application backend</strong>.</p>
  <ul>
    <li><a href="/health"><code>GET /health</code></a></li>
    <li><a href="/api/metrics"><code>GET /api/metrics</code></a></li>
  </ul>
</body>
</html>`)
})

export default router
