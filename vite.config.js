import { defineConfig } from 'vite'
import sageDrift from './vite-plugin-sage-drift.js'

export default defineConfig({
  plugins: [sageDrift()],
})
