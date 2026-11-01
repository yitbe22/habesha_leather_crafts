import { AnimatePresence, m } from 'framer-motion'
import { lazy, Suspense, useEffect, useState } from 'react'
import { useLocation, useOutlet } from 'react-router-dom'
import { Footer } from '@/components/Footer'
import { IntroLoader } from '@/components/IntroLoader'
import { Navbar } from '@/components/Navbar'
import { PageFallback } from '@/components/PageFallback'
import { useCart } from '@/context/CartContext'
import { useScrollReveal } from '@/hooks/useScrollReveal'
import { EASE_LUX } from '@/lib/motion'
import { startFlight } from '@/lib/photoFlight'

// Loaded the first time the bag is opened, to keep the initial bundle small.
const CartDrawer = lazy(() => import('@/components/CartDrawer').then((mod) => ({ default: mod.CartDrawer })))

/**
 * Storefront shell: header, the current page and the footer. Pages fade out,
 * the window returns to the top, then the next page fades in (opacity only,
 * so a photo flying into the product page lands on a frame that isn't moving).
 */
export function Layout() {
  const location = useLocation()
  const outlet = useOutlet()
  const { open: cartOpen } = useCart()
  const [cartLoaded, setCartLoaded] = useState(false)
  if (cartOpen && !cartLoaded) setCartLoaded(true)
  useScrollReveal()

  // a click on a product card lifts its photo, ready to fly into the product page
  useEffect(() => {
    const onClick = (e) => {
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
      const link = e.target.closest?.('a[href^="/product/"]')
      const scope = link?.closest('[data-flip-scope]')
      if (!scope) return
      startFlight(link.getAttribute('href').split('/').pop(), scope.querySelector('.lux-media'))
    }
    // the moment a card is pointed at, start loading the product page so the photo never waits for it
    const onPointerOver = (e) => {
      if (e.target.closest?.('[data-flip-scope]')) import('@/pages/ProductDetail')
    }
    document.addEventListener('click', onClick, true)
    document.addEventListener('pointerover', onPointerOver, { passive: true })
    return () => {
      document.removeEventListener('click', onClick, true)
      document.removeEventListener('pointerover', onPointerOver)
    }
  }, [])

  // fetch the most visited pages ahead of time, so a click never waits on them
  useEffect(() => {
    const idle = window.requestIdleCallback ?? ((cb) => setTimeout(cb, 1500))
    idle(() => {
      import('@/pages/Shop')
      import('@/pages/ProductDetail')
    })
  }, [])

  return (
    <>
      <a
        href="#main"
        className="sr-only rounded-md bg-espresso px-4 py-2 text-sm text-cream focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50"
      >
        Skip to content
      </a>
      <Navbar />
      <AnimatePresence mode="wait" initial={false} onExitComplete={() => window.scrollTo({ top: 0, behavior: 'instant' })}>
        <m.main
          id="main"
          key={location.pathname}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 0.55, ease: EASE_LUX } }}
          exit={{ opacity: 0, transition: { duration: 0.25, ease: EASE_LUX } }}
          className="min-h-svh"
        >
          <Suspense fallback={<PageFallback />}>{outlet}</Suspense>
        </m.main>
      </AnimatePresence>
      <Footer />
      {cartLoaded && (
        <Suspense fallback={null}>
          <CartDrawer />
        </Suspense>
      )}
      <IntroLoader />
    </>
  )
}
