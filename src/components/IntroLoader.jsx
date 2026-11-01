import { AnimatePresence, animate, m, useMotionValue, useReducedMotion, useTransform } from 'framer-motion'
import { useEffect, useState } from 'react'
import logoUrl from '@/assets/logo.svg'
import { LogoImage } from '@/components/Logo'
import { StitchLine } from '@/components/Ornaments'
import { images } from '@/config/images'
import { finishIntro } from '@/lib/intro'
import { EASE_CURTAIN, EASE_LUX } from '@/lib/motion'

const KEY = 'hlc.intro.seen'
// the glint is clipped to the logo's shape
const glintMask = { maskImage: `url(${logoUrl})`, WebkitMaskImage: `url(${logoUrl})`, maskSize: '100% 100%', WebkitMaskSize: '100% 100%' }
const wait = (ms) => new Promise((r) => setTimeout(r, ms))

function seen() {
  try {
    return sessionStorage.getItem(KEY) === '1'
  } catch {
    return false
  }
}

function preload(src) {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = img.onerror = () => resolve()
    img.src = src
  })
}

/**
 * First-visit loader (adapted from the Mercy site). While the fonts and hero
 * photos load, a saddle stitch is sewn across the screen in step with the
 * progress; then the espresso panel lifts like a curtain and hands over to
 * the page. Shown once per browser session, never with reduced motion.
 */
export function IntroLoader() {
  const reduce = useReducedMotion()
  const [show, setShow] = useState(() => !seen() && !reduce)
  const progress = useMotionValue(0)
  const percent = useTransform(progress, (v) => `${Math.round(v * 100)}`)
  const sewn = useTransform(progress, (v) => `${v * 100}%`)

  useEffect(() => {
    if (!show) {
      finishIntro()
      return
    }
    let cancelled = false
    document.documentElement.style.overflow = 'hidden'

    const photos = window.location.pathname === '/' ? images.hero.map((h) => h.src) : []
    const total = photos.length + 1
    let loaded = 0
    const tick = () => {
      loaded += 1
      animate(progress, loaded / total, { duration: 0.6, ease: EASE_LUX })
    }
    const fonts = document.fonts ? document.fonts.ready : Promise.resolve()
    const tasks = [fonts.then(tick), ...photos.map((src) => preload(src).then(tick))]

    // never hold the page for more than a few seconds on a slow connection
    Promise.race([Promise.all([Promise.all(tasks), wait(1600)]), wait(6000)]).then(async () => {
      if (cancelled) return
      await animate(progress, 1, { duration: 0.45, ease: EASE_LUX })
      if (cancelled) return
      try {
        sessionStorage.setItem(KEY, '1')
      } catch {
        /* private mode: the loader simply shows again next time */
      }
      finishIntro()
      setShow(false)
    })
    return () => {
      cancelled = true
    }
  }, [show, progress])

  return (
    <AnimatePresence onExitComplete={() => (document.documentElement.style.overflow = '')}>
      {show && (
        <m.div
          key="loader"
          role="status"
          aria-label="Loading"
          className="grain fixed inset-0 z-[100] grid place-items-center overflow-hidden bg-espresso text-cream"
          exit={{ y: '-100%', borderBottomLeftRadius: '50% 14%', borderBottomRightRadius: '50% 14%' }}
          transition={{ duration: 1, ease: EASE_CURTAIN, delay: 0.3 }}
        >
          <m.div className="flex flex-col items-center" exit={{ y: -32, opacity: 0 }} transition={{ duration: 0.45, ease: [0.55, 0, 1, 0.45] }}>
            {/* the logo wipes in left to right, then a glint keeps crossing it while loading (after Mercy's sign) */}
            <m.div
              className="relative w-[min(17rem,66vw)]"
              initial={{ clipPath: 'inset(0% 100% 0% 0%)', scale: 0.94, opacity: 0 }}
              animate={{ clipPath: 'inset(0% 0% 0% 0%)', scale: 1, opacity: 1 }}
              transition={{ duration: 1.3, ease: EASE_LUX, delay: 0.15 }}
            >
              <LogoImage className="w-full" />
              <span className="pointer-events-none absolute inset-0 overflow-hidden" style={glintMask} aria-hidden="true">
                <m.span
                  className="absolute inset-y-0 -left-1/2 w-1/2 bg-[linear-gradient(105deg,transparent_20%,rgba(236,201,138,0.9)_50%,transparent_80%)]"
                  initial={{ x: '0%' }}
                  animate={{ x: '400%' }}
                  transition={{ duration: 1.4, ease: 'easeInOut', delay: 1.2, repeat: Infinity, repeatDelay: 0.5 }}
                />
              </span>
            </m.div>
            <m.span
              className="mt-5 pl-[0.4em] text-[0.62rem] text-cream/60"
              initial={{ opacity: 0, letterSpacing: '0.1em' }}
              animate={{ opacity: 1, letterSpacing: '0.4em' }}
              transition={{ duration: 1.2, ease: EASE_LUX, delay: 0.6 }}
            >
              HANDCRAFTED IN ADDIS ABABA
            </m.span>

            {/* the stitch is sewn left to right as things load; the gold dot is the needle */}
            <m.div className="relative mt-12 w-56" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
              <StitchLine className="text-cream/15" />
              <m.div className="absolute inset-y-0 left-0 overflow-hidden" style={{ width: sewn }}>
                <StitchLine className="w-56 text-gold" />
              </m.div>
              <m.span
                className="absolute top-1/2 size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold shadow-[0_0_10px_2px_rgba(184,137,59,0.6)]"
                style={{ left: sewn }}
              />
            </m.div>
            <span className="mt-4 text-xs text-cream/55 tabular-nums">
              <m.span>{percent}</m.span>%
            </span>
          </m.div>
        </m.div>
      )}
    </AnimatePresence>
  )
}
