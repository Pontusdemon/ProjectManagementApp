import { fileURLToPath } from 'node:url'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

const srcDir = fileURLToPath(new URL('./src', import.meta.url))

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': srcDir,
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react-router')) {
              return 'router-vendor'
            }

            if (id.includes('react-dom')) {
              return 'react-dom-vendor'
            }

            if (id.includes('react')) {
              return 'react-vendor'
            }

            if (
              id.includes('@base-ui') ||
              id.includes('@radix-ui') ||
              id.includes('lucide-react')
            ) {
              return 'ui-vendor'
            }

            if (
              id.includes('class-variance-authority') ||
              id.includes('clsx') ||
              id.includes('tailwind-merge')
            ) {
              return 'utility-vendor'
            }
          }
        },
      },
    },
  },
})
