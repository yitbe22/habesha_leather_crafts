import { useEffect, useState } from 'react'

/**
 * useState that is remembered in localStorage, for small per-visitor
 * conveniences. Falls back to plain state when storage is unavailable.
 */
export function useStoredState(key, initial) {
  const [value, setValue] = useState(() => {
    try {
      const saved = localStorage.getItem(key)
      return saved ? JSON.parse(saved) : initial
    } catch {
      return initial
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch {
      /* private mode: remembered for this visit only */
    }
  }, [key, value])

  return [value, setValue]
}
