import { spawnSync } from "child_process"
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import packagejson from "./package.json"

// https://vitejs.dev/config/
export default defineConfig(() => {
  const result = spawnSync(
    "git",
    ["rev-parse", "--short", "HEAD"]
  )
  let hash: string
  if(result.status !== 0) {
    hash = "unknown"
  } else {
    hash = result.stdout.toString()
  }
  return {
    define: {
      __GIT_HASH__: JSON.stringify(hash),
      __VERSION__: JSON.stringify(packagejson.version)
    },
    plugins: [react()],
  }
})
