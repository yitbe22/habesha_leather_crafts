import { useEffect, useState } from 'react'

/**
 * Becomes true once `delay` ms have passed and the browser is idle. Used to
 * render below-the-fold sections after a page's entrance (and any photo
 * flight) has played, so they never compete with it for the main thread.
 */
export function useIdleReady(delay = 900) {
  const [ready, setReady] = useState(false)
  useEffect(() => {
    let idleId
    const idle = window.requestIdleCallback ?? ((cb) => setTimeout(cb, 1))
    const cancelIdle = window.cancelIdleCallback ?? clearTimeout
    const timer = setTimeout(() => {
      idleId = idle(() => setReady(true), { timeout: 1000 })
    }, delay)
    return () => {
      clearTimeout(timer)
      if (idleId) cancelIdle(idleId)
    }
  }, [delay])
  return ready
}
