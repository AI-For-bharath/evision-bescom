import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

/** Dev proxy: forward API routes to the Node backend (override with VITE_DEV_API_PROXY). */
const devApiProxyTarget = process.env.VITE_DEV_API_PROXY?.trim() || 'http://127.0.0.1:5000'

const proxyPaths = ['/api', '/health', '/behavior', '/demand', '/grid-status', '/simulate', '/recommendations']

const proxy = Object.fromEntries(
  proxyPaths.map((path) => [path, { target: devApiProxyTarget, changeOrigin: true }]),
)

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: true,
    proxy,
  },
})
