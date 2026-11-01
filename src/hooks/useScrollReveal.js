import { useEffect } from 'react'

/**
 * Adds `in` to every [data-reveal] element the first time it scrolls into
 * view; the CSS in index.css does the animation. A MutationObserver picks up
 * elements that appear later, such as a lazily loaded page or new products.
 */
export function useScrollReveal() {
  useEffect(() => {
    const reveal = (el) => el.classList.add('in')
    if (!('IntersectionObserver' in window)) {
      document.querySelectorAll('[data-reveal]').forEach(reveal)
      return
    }
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          reveal(entry.target)
          io.unobserve(entry.target)
        }),
      { rootMargin: '0px 0px -10% 0px', threshold: 0.08 },
    )
    const watch = () => document.querySelectorAll('[data-reveal]:not(.in)').forEach((el) => io.observe(el))
    watch()
    const mo = new MutationObserver(watch)
    mo.observe(document.body, { childList: true, subtree: true })
    return () => {
      io.disconnect()
      mo.disconnect()
    }
  }, [])
}
