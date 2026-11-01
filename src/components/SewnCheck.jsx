import { m } from 'framer-motion'
import { EASE_LUX } from '@/lib/motion'

/** Success mark: a dashed gold circle sews itself closed, then the tick is drawn. */
export function SewnCheck({ className = 'size-20' }) {
  return (
    <svg viewBox="0 0 80 80" className={`${className} text-cognac`} aria-hidden="true">
      <circle cx="40" cy="40" r="37" className="fill-parchment" />
      <m.circle
        cx="40"
        cy="40"
        r="31"
        fill="none"
        stroke="var(--gold)"
        strokeWidth="1.5"
        strokeDasharray="5 4"
        initial={{ pathLength: 0, rotate: -90 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1, ease: EASE_LUX }}
        style={{ originX: '50%', originY: '50%' }}
      />
      <m.path
        d="M27 41l9 9 18-19"
        fill="none"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.5, ease: EASE_LUX, delay: 0.8 }}
      />
    </svg>
  )
}
