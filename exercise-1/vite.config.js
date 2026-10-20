import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import mockApi from './server/mockApi.js'

// mockApi() adds a small in-memory REST API (/api/...) to the Vite dev and preview servers.
export default defineConfig({
  plugins: [react(), mockApi()],
})
