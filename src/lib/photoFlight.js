/**
 * Photo flight (a simpler take on Mercy's page transition). Clicking a
 * product card lifts a copy of its photo above the page; it waits there while
 * the old page fades, then flies into the product page's gallery frame and
 * hands over to the real image once that is decoded. If the gallery never
 * shows up, the copy fades away.
 *
 * The flight animates only `transform` (and `opacity` at the end), so the
 * browser runs it on the compositor: it stays smooth even while the main
 * thread is busy building the new page.
 */
let pending = null

const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
const DURATION = 800
const STEPS = 30
// expo-out, matching the site's --ease-expo; applied per keyframe so the WAAPI timing can stay linear
const easeOut = (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t))

/** The large version of a card photo (cards use the 480px file, the gallery the 960px one). */
const largeSrc = (img) => (img.currentSrc || img.src).replace(/-480\.webp$/, '-960.webp')

const preloaded = new Set()

/** Starts downloading a card's large photo so the product page has it ready. */
export function preloadLarge(img) {
  if (!img) return
  const src = largeSrc(img)
  if (preloaded.has(src)) return
  preloaded.add(src)
  new Image().src = src
}

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
 * A hovered card shows its photo zoomed (see .lux-card in index.css). While
 * waiting, the copy keeps that zoom, trimmed back to the card's box by a
 * clip-path inset that is scaled along with it.
 */
const clipFor = (zoom, radius) => `inset(${((1 - 1 / zoom) / 2) * 100}% round ${radius / zoom}px)`

/** Called on click. `frame` is the card's photo box. */
export function startFlight(slug, frame) {
  cancelFlight()
  const img = frame?.querySelector('img')
  if (!img || reduced()) return
  const rect = frame.getBoundingClientRect()
  if (!rect.width || rect.bottom < 0 || rect.top > window.innerHeight) return
  preloadLarge(img)

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
  pending = { slug, clone, zoom, rect, timer: setTimeout(cancelFlight, 4000) }
}

/** Called by the gallery when it mounts. Returns true if a flight landed on it. */
export function landFlight(slug, target) {
  if (!pending || pending.slug !== slug || !target) return false
  const flight = pending
  clearTimeout(flight.timer)
  pending = null

  target.style.visibility = 'hidden'
  // The new page mounts a moment before the window is scrolled back to the top
  // (Layout does that as the old page finishes leaving). Rather than wait a few
  // frames for it, which a busy phone can stretch to seconds, the frame's
  // position once at the top is worked out now: where it is plus how far the
  // page is still scrolled. The flight then starts with the very first paint.
  const r = target.getBoundingClientRect()
  fly(flight, target, { left: r.left, top: r.top + window.scrollY, width: r.width, height: r.height })
  return true
}

/*
 * The flying photo is two layers sized to the destination frame:
 *   box  – clips with the frame's rounded corners; moved and scaled (unevenly,
 *          when the card and the frame have different shapes) onto the path
 *   img  – counter-scaled inside the box so the photo itself only ever scales
 *          evenly, never stretches
 * Every keyframe is precomputed, because the counter-scale has to be exact at
 * each step for the photo to stay undistorted.
 */
function fly({ clone, zoom, rect: from }, target, to) {
  const radius = getComputedStyle(target).borderTopLeftRadius

  const box = document.createElement('div')
  Object.assign(box.style, {
    position: 'fixed',
    left: `${to.left}px`,
    top: `${to.top}px`,
    width: `${to.width}px`,
    height: `${to.height}px`,
    overflow: 'hidden',
    borderRadius: radius,
    zIndex: '60',
    pointerEvents: 'none',
    willChange: 'transform',
    transformOrigin: '50% 50%',
  })
  const img = document.createElement('img')
  img.src = clone.src
  img.alt = ''
  img.setAttribute('aria-hidden', 'true')
  Object.assign(img.style, { width: '100%', height: '100%', objectFit: 'cover', display: 'block', willChange: 'transform', transformOrigin: '50% 50%' })
  box.appendChild(img)
  document.body.appendChild(box)
  clone.remove()

  // the large photo replaces the small one inside the copy as soon as it has loaded
  const large = new Image()
  large.onload = () => (img.src = large.src)
  large.src = clone.src.replace(/-480\.webp$/, '-960.webp')

  const fromCx = from.left + from.width / 2
  const fromCy = from.top + from.height / 2
  const toCx = to.left + to.width / 2
  const toCy = to.top + to.height / 2
  const boxFrames = []
  const imgFrames = []
  for (let i = 0; i <= STEPS; i++) {
    const p = easeOut(i / STEPS)
    const w = from.width + (to.width - from.width) * p
    const h = from.height + (to.height - from.height) * p
    const sx = w / to.width
    const sy = h / to.height
    // the photo covers the current box at an even scale, easing out of the card's hover zoom
    const k = Math.max(sx, sy) * (zoom + (1 - zoom) * p)
    const dx = fromCx + (toCx - fromCx) * p - toCx
    const dy = fromCy + (toCy - fromCy) * p - toCy
    const offset = i / STEPS
    boxFrames.push({ offset, transform: `translate(${dx}px, ${dy}px) scale(${sx}, ${sy})` })
    imgFrames.push({ offset, transform: `scale(${k / sx}, ${k / sy})` })
  }
  const timing = { duration: DURATION, easing: 'linear', fill: 'forwards' }
  const boxAnim = box.animate(boxFrames, timing)
  img.animate(imgFrames, timing)

  // the real photo appears underneath first (skipping its own fade-in), then the copy fades off it
  const photo = target.querySelector('img')
  Promise.all([boxAnim.finished, ready(photo)])
    .then(() => {
      if (photo) Object.assign(photo.style, { transition: 'none', opacity: '1' })
      target.style.visibility = ''
      return box.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 200, fill: 'forwards' }).finished
    })
    .catch(() => {
      target.style.visibility = ''
    })
    .finally(() => box.remove())
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
