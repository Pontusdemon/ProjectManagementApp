import { useEffect, useState, type ReactNode } from "react"
import { ThemeProviderContext, type Theme } from "./theme-context"

interface ThemeProviderProps {
  children: ReactNode
  defaultTheme?: Theme
  storageKey?: string
}

function readStoredTheme(storageKey: string, fallback: Theme): Theme {
  try {
    return (localStorage.getItem(storageKey) as Theme | null) || fallback
  } catch {
    // Storage can throw in private browsing modes. Never break first paint.
    return fallback
  }
}

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "vite-ui-theme",
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(() =>
    readStoredTheme(storageKey, defaultTheme)
  )

  useEffect(() => {
    const root = window.document.documentElement
    root.classList.remove("light", "dark")

    const appliedTheme =
      theme === "system"
        ? window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light"
        : theme

    root.classList.add(appliedTheme)
  }, [theme])

  const value = {
    theme,
    setTheme: (nextTheme: Theme) => {
      try {
        localStorage.setItem(storageKey, nextTheme)
      } catch {
        // Preference still applies for this session even if it cannot persist.
      }
      setTheme(nextTheme)
    },
  }

  return (
    <ThemeProviderContext.Provider value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}