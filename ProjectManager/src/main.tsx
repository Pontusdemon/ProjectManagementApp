import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { TooltipProvider } from '@/components/ui/tooltip'
import { ThemeProvider } from './components/context/theme-provider.tsx'
import { AppStateProvider } from './components/context/app-state-provider'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="system" storageKey="taskflow-theme">
      <TooltipProvider>
        <AppStateProvider>
          <App />
        </AppStateProvider>
      </TooltipProvider>
    </ThemeProvider>
  </StrictMode>,
)
