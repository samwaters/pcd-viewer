import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(() => {
  return {
    define: {
      __GIT_HASH__: "'abc123'"
    },
    plugins: [react()],
  }
})
