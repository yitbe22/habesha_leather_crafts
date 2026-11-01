import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { flushSync } from 'react-dom'

const STORAGE_KEY = 'hlc.theme'
const THEME_COLORS = { light: '#faf6ef', dark: '#17110c' }

const ThemeContext = createContext(null)

// index.html sets the class before first paint, so React starts in agreement with it
const current = () => (document.documentElement.classList.contains('dark') ? 'dark' : 'light')

function apply(theme) {
  const root = document.documentElement
  root.classList.toggle('dark', theme === 'dark')
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', THEME_COLORS[theme])
  try {
    localStorage.setItem(STORAGE_KEY, theme)
  } catch {
    /* private mode: the choice lasts for this visit only */
  }
}

/**
 * Light / dark theme. The visitor's own choice is remembered; until they make
 * one, the system setting decides (see the script in index.html).
 */
export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(current)

  /**
   * Switches theme. Given the toggle button, the new theme is revealed in a
   * circle growing out of it; without view transitions the colours fade, and
   * with reduced motion they change at once.
   */
  const toggleTheme = useCallback((origin) => {
    const next = current() === 'dark' ? 'light' : 'dark'
    const commit = () => {
      apply(next)
      setTheme(next)
    }
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (reduce) return commit()

    if (!document.startViewTransition) {
      const root = document.documentElement
      root.classList.add('theme-fade')
      commit()
      setTimeout(() => root.classList.remove('theme-fade'), 500)
      return
    }

    const rect = origin?.getBoundingClientRect()
    const x = rect ? rect.left + rect.width / 2 : window.innerWidth / 2
    const y = rect ? rect.top + rect.height / 2 : 0
    const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y))

    const transition = document.startViewTransition(() => flushSync(commit))
    transition.ready.then(() => {
      document.documentElement.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
        { duration: 700, easing: 'cubic-bezier(0.65, 0, 0.35, 1)', pseudoElement: '::view-transition-new(root)' },
      )
    })
  }, [])

  const value = useMemo(() => ({ theme, toggleTheme }), [theme, toggleTheme])
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used inside <ThemeProvider>')
  return ctx
}
