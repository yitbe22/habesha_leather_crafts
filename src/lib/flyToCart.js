const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

/**
 * Sends a small round copy of a product photo arcing into the header's bag
 * button. Resolves when it lands (straight away with reduced motion or when
 * either end is missing), so callers can add to the cart at the moment of
 * impact and the badge bump lines up with it.
 */
export function flyToCart(source) {
  const target = document.querySelector('[data-cart-button]')
  const img = source?.tagName === 'IMG' ? source : source?.querySelector('img')
  if (!img || !target || reduced()) return Promise.resolve()

  const from = source.getBoundingClientRect()
  const to = target.getBoundingClientRect()
  const size = Math.min(88, from.width * 0.5)
  const dx = to.left + to.width / 2 - (from.left + from.width / 2)
  const dy = to.top + to.height / 2 - (from.top + from.height / 2)

  const dot = document.createElement('img')
  dot.src = img.currentSrc || img.src
  dot.alt = ''
  dot.setAttribute('aria-hidden', 'true')
  Object.assign(dot.style, {
    position: 'fixed',
    left: `${from.left + from.width / 2 - size / 2}px`,
    top: `${from.top + from.height / 2 - size / 2}px`,
    width: `${size}px`,
    height: `${size}px`,
    objectFit: 'cover',
    borderRadius: '50%',
    boxShadow: '0 12px 30px -10px rgba(42,26,18,0.55)',
    border: '3px solid #faf6ef',
    zIndex: '70',
    pointerEvents: 'none',
  })
  document.body.appendChild(dot)

  // the middle keyframe lifts the path into an arc
  const flight = dot.animate(
    [
      { transform: 'translate(0, 0) scale(0.6)', opacity: 0 },
      { transform: 'translate(0, -12px) scale(1)', opacity: 1, offset: 0.15 },
      { transform: `translate(${dx * 0.55}px, ${dy * 0.55 - 90}px) scale(0.7)`, opacity: 1, offset: 0.6 },
      { transform: `translate(${dx}px, ${dy}px) scale(0.18)`, opacity: 0.5 },
    ],
    { duration: 850, easing: 'cubic-bezier(0.45, 0, 0.25, 1)' },
  )
  return flight.finished.catch(() => {}).finally(() => dot.remove())
}
