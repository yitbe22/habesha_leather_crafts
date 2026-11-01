import { AnimatePresence, m } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useLayoutEffect, useState } from 'react'
import { SmartImage } from '@/components/SmartImage'
import { EASE_LUX } from '@/lib/motion'
import { landFlight } from '@/lib/photoFlight'
import { cn } from '@/lib/utils'

const arrowBtn =
  'absolute top-1/2 z-10 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-cream/85 text-espresso shadow-md backdrop-blur transition hover:bg-cream sm:opacity-0 sm:group-hover:opacity-100 sm:focus-visible:opacity-100'

/**
 * Product photos: a large frame with thumbnails underneath.
 * - arrow keys, the arrow buttons or a thumbnail change the photo
 * - swipe on touch screens
 * - with a mouse, hovering zooms in under the pointer
 * The frame is also where a photo flying in from a product card lands.
 */
export function ProductGallery({ product, index, onIndexChange, frameRef }) {
  const { images, name } = product
  const count = images.length
  const [zoom, setZoom] = useState(null)
  // remember the last index to know which way to slide
  const [shown, setShown] = useState({ index, dir: 0 })
  if (shown.index !== index) setShown({ index, dir: index > shown.index ? 1 : -1 })

  useLayoutEffect(() => {
    landFlight(product.slug, frameRef.current)
  }, [product.slug, frameRef])

  const go = (step) => onIndexChange((index + step + count) % count)

  const onKeyDown = (e) => {
    if (e.key === 'ArrowRight') go(1)
    else if (e.key === 'ArrowLeft') go(-1)
    else return
    e.preventDefault()
  }

  const onPointerMove = (e) => {
    if (e.pointerType !== 'mouse') return
    const r = e.currentTarget.getBoundingClientRect()
    setZoom({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 })
  }

  return (
    <div className="flex flex-col gap-2.5 sm:gap-3">
      <div
        ref={frameRef}
        tabIndex={0}
        role="group"
        aria-roledescription="carousel"
        aria-label={`${name}, photo ${index + 1} of ${count}. Use the arrow keys to browse.`}
        onKeyDown={onKeyDown}
        onPointerMove={onPointerMove}
        onPointerLeave={() => setZoom(null)}
        className="group relative aspect-square max-h-[52svh] w-full overflow-hidden rounded-2xl bg-muted sm:aspect-[4/5] sm:max-h-none"
      >
        <AnimatePresence initial={false} custom={shown.dir}>
          <m.div
            key={index}
            custom={shown.dir}
            className="absolute inset-0 touch-pan-y"
            initial={{ opacity: 0, x: shown.dir * 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: shown.dir * -40 }}
            transition={{ duration: 0.5, ease: EASE_LUX }}
            drag={count > 1 && !zoom ? 'x' : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.25}
            onDragEnd={(_, info) => {
              if (info.offset.x < -60) go(1)
              else if (info.offset.x > 60) go(-1)
            }}
          >
            <div
              className="h-full w-full transition-transform duration-300 ease-out"
              style={zoom ? { transform: 'scale(1.9)', transformOrigin: `${zoom.x}% ${zoom.y}%` } : undefined}
            >
              <SmartImage
                src={images[index]}
                alt={index === 0 ? name : `${name}, view ${index + 1}`}
                sizes="(min-width: 1024px) 52vw, 100vw"
                priority={index === 0}
                className="h-full w-full"
              />
            </div>
          </m.div>
        </AnimatePresence>

        {count > 1 && (
          <>
            <button type="button" className={cn(arrowBtn, 'left-3')} onClick={() => go(-1)} aria-label="Previous photo" tabIndex={-1}>
              <ChevronLeft className="size-5" strokeWidth={1.5} />
            </button>
            <button type="button" className={cn(arrowBtn, 'right-3')} onClick={() => go(1)} aria-label="Next photo" tabIndex={-1}>
              <ChevronRight className="size-5" strokeWidth={1.5} />
            </button>
            <span className="pointer-events-none absolute bottom-4 left-4 rounded-full bg-cream/85 px-3 py-1 text-sm text-espresso tabular-nums backdrop-blur" aria-hidden="true">
              {index + 1} / {count}
            </span>
          </>
        )}
      </div>

      {count > 1 && (
        <ul className="rail flex gap-3 overflow-x-auto pb-1" aria-label="Choose a photo">
          {images.map((src, i) => (
            <li key={src} className="shrink-0">
              <button
                type="button"
                onClick={() => onIndexChange(i)}
                aria-label={`Show photo ${i + 1}`}
                aria-current={i === index}
                className={cn(
                  'block w-14 overflow-hidden rounded-lg ring-offset-2 ring-offset-background transition sm:w-20',
                  i === index ? 'ring-2 ring-cognac' : 'opacity-70 hover:opacity-100',
                )}
              >
                <SmartImage src={src} sizes="80px" className="aspect-[4/5] w-full" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
