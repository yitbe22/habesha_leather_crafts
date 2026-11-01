/**
 * Photo flight (a simpler take on Mercy's page transition). Clicking a
 * product card lifts a copy of its photo above the page; it waits there while
 * the old page fades, then flies into the product page's gallery frame and
 * hands over to the real image once that is decoded. If the gallery never
 * shows up, the copy fades away.
 */
let pending = null

const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
const EASE = 'cubic-bezier(0.16, 1, 0.3, 1)'

/** Resolves when the image can be shown, or after `ms` at the latest. */
function ready(img, ms = 900) {
  if (!img || (img.complete && img.naturalWidth)) return Promise.resolve()
  return new Promise((resolve) => {
    const done = () => resolve()
    img.addEventListener('load', done, { once: true })
    img.addEventListener('error', done, { once: true })
    setTimeout(done, ms)
  })
}

/*
 * A hovered card shows its photo zoomed (see .lux-card in index.css). The copy
 * starts with the same zoom, and a clip-path inset trims it back to the card's
 * box: the clip is scaled along with the image, so (1 - 1/zoom) / 2 on each
 * side leaves exactly the frame visible.
 */
const clipFor = (zoom, radius) => `inset(${((1 - 1 / zoom) / 2) * 100}% round ${radius / zoom}px)`

/** Called on click. `frame` is the card's photo box. */
export function startFlight(slug, frame) {
  cancelFlight()
  const img = frame?.querySelector('img')
  if (!img || reduced()) return
  const rect = frame.getBoundingClientRect()
  if (!rect.width || rect.bottom < 0 || rect.top > window.innerHeight) return

  const zoom = frame.closest('.lux-card')?.matches(':hover') ? 1.05 : 1
  const radius = parseFloat(getComputedStyle(frame.parentElement).borderTopLeftRadius) || 0
  const clone = document.createElement('img')
  clone.src = img.currentSrc || img.src
  clone.alt = ''
  clone.setAttribute('aria-hidden', 'true')
  Object.assign(clone.style, {
    position: 'fixed',
    left: `${rect.left}px`,
    top: `${rect.top}px`,
    width: `${rect.width}px`,
    height: `${rect.height}px`,
    objectFit: 'cover',
    transform: `scale(${zoom})`,
    clipPath: clipFor(zoom, radius),
    zIndex: '60',
    pointerEvents: 'none',
  })
  document.body.appendChild(clone)
  pending = { slug, clone, zoom, radius, timer: setTimeout(cancelFlight, 4000) }
}

/** Called by the gallery when it mounts. Returns true if a flight landed on it. */
export function landFlight(slug, target) {
  if (!pending || pending.slug !== slug || !target) return false
  const { clone, zoom, radius, timer } = pending
  clearTimeout(timer)
  pending = null

  target.style.visibility = 'hidden'
  // The new page mounts a moment before the window is scrolled back to the top,
  // so the frame is measured two frames later, once it has reached its real position.
  requestAnimationFrame(() => requestAnimationFrame(() => fly(clone, target, zoom, radius)))
  return true
}

function fly(clone, target, zoom, radius) {
  const to = target.getBoundingClientRect()
  const toRadius = parseFloat(getComputedStyle(target).borderTopLeftRadius) || 0

  const flight = clone.animate(
    [
      { left: clone.style.left, top: clone.style.top, width: clone.style.width, height: clone.style.height, transform: `scale(${zoom})`, clipPath: clipFor(zoom, radius) },
      { left: `${to.left}px`, top: `${to.top}px`, width: `${to.width}px`, height: `${to.height}px`, transform: 'scale(1)', clipPath: clipFor(1, toRadius) },
    ],
    { duration: 850, easing: EASE, fill: 'forwards' },
  )

  // the real photo appears underneath first (skipping its own fade-in), then the copy fades off it
  const photo = target.querySelector('img')
  Promise.all([flight.finished, ready(photo)])
    .then(() => {
      if (photo) Object.assign(photo.style, { transition: 'none', opacity: '1' })
      target.style.visibility = ''
      return clone.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 220, fill: 'forwards' }).finished
    })
    .catch(() => {
      target.style.visibility = ''
    })
    .finally(() => clone.remove())
}

export function cancelFlight() {
  if (!pending) return
  const { clone, timer } = pending
  clearTimeout(timer)
  pending = null
  clone
    .animate([{ opacity: 1 }, { opacity: 0 }], { duration: 250, fill: 'forwards' })
    .finished.catch(() => {})
    .finally(() => clone.remove())
}
