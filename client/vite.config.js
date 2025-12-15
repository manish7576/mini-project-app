import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
   server: {
    proxy: {
      // 👇 Any request starting with /api goes to backend
      "/api": {
        target: "http://localhost:1000", // proxy API calls backend URL
        changeOrigin: true,
      },
    }, 
    allowedHosts: [
      "steve-copyrights-clinic-hierarchy.trycloudflare.com" // your frontend tunnel URL
    ],
  }, 
})
