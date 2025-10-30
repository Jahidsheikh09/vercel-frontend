import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  // Load .env variables
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    server: {
      port: 5173,
      host: true
    },
    define: {
      'process.env.VITE_SERVER_URL': JSON.stringify(env.VITE_SERVER_URL),
      'process.env.VITE_API_URL': JSON.stringify(env.VITE_API_URL),
    }
  }
});
