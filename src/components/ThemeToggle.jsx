import { AnimatePresence, m } from 'framer-motion'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from '@/context/ThemeContext'
import { EASE_LUX } from '@/lib/motion'
import { cn } from '@/lib/utils'

/** Sun / moon button. The icon turns as it swaps; the page reveal is handled by ThemeContext. */
export function ThemeToggle({ className }) {
  const { theme, toggleTheme } = useTheme()
  const dark = theme === 'dark'

  return (
    <button
      type="button"
      onClick={(e) => toggleTheme(e.currentTarget)}
      aria-label={dark ? 'Switch to light theme' : 'Switch to dark theme'}
      aria-pressed={dark}
      className={cn('relative grid size-10 place-items-center overflow-hidden rounded-full transition-colors hover:bg-foreground/5', className)}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        <m.span
          key={theme}
          initial={{ rotate: -90, scale: 0.4, opacity: 0 }}
          animate={{ rotate: 0, scale: 1, opacity: 1 }}
          exit={{ rotate: 90, scale: 0.4, opacity: 0 }}
          transition={{ duration: 0.45, ease: EASE_LUX }}
          className="grid place-items-center"
        >
          {dark ? <Sun className="size-[1.15rem]" strokeWidth={1.5} /> : <Moon className="size-[1.1rem]" strokeWidth={1.5} />}
        </m.span>
      </AnimatePresence>
    </button>
  )
}
