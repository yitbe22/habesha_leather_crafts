import { useSyncExternalStore } from 'react'

/**
 * A tiny store that flips once, when the intro loader lifts. The hero and
 * header wait for it so their entrances play after the curtain, not behind it.
 * It also adds `.loaded` to <html>, which lets the CSS scroll reveals run.
 */
let done = false
const listeners = new Set()

export function finishIntro() {
  if (done) return
  done = true
  document.documentElement.classList.add('loaded')
  listeners.forEach((fn) => fn())
}

const subscribe = (fn) => {
  listeners.add(fn)
  return () => listeners.delete(fn)
}

export function useIntroDone() {
  return useSyncExternalStore(subscribe, () => done)
}
