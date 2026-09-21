import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { TooltipProvider } from '@/components/ui/tooltip'
import { ThemeProvider } from './components/context/theme-provider.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="system" storageKey="taskflow-theme">
    <TooltipProvider>
      <App />
    </TooltipProvider>
  </ThemeProvider>
  </StrictMode>,
)
