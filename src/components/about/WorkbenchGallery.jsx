import { AnimatePresence, m } from 'framer-motion'
import { ChevronLeft, ChevronRight, Expand } from 'lucide-react'
import { useState } from 'react'
import { RevealImage } from '@/components/Reveal'
import { SmartImage } from '@/components/SmartImage'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'
import { EASE_LUX } from '@/lib/motion'

// varied heights give the masonry columns their rhythm
const RATIOS = ['aspect-[4/5]', 'aspect-square', 'aspect-[3/4]', 'aspect-[4/5]', 'aspect-[3/4]', 'aspect-square', 'aspect-[4/5]', 'aspect-[3/4]']
const navBtn = 'grid size-11 place-items-center rounded-full bg-cream/10 text-cream transition-colors hover:bg-cream hover:text-espresso'

/** Masonry gallery of close-ups. Each photo opens in a lightbox with arrow-key browsing. */
export function WorkbenchGallery({ photos }) {
  const [open, setOpen] = useState(null)
  const go = (step) => setOpen((i) => (i + step + photos.length) % photos.length)

  return (
    <>
      <ul className="columns-2 gap-3 sm:gap-4 lg:columns-4">
        {photos.map((photo, i) => (
          <li key={photo.src} className="mb-3 break-inside-avoid sm:mb-4">
            <button
              type="button"
              onClick={() => setOpen(i)}
              className="group relative block w-full overflow-hidden rounded-xl"
              aria-label={`Enlarge photo: ${photo.alt}`}
            >
              <RevealImage delay={(i % 4) * 0.1} radius="0.75rem" className={RATIOS[i % RATIOS.length]}>
                <SmartImage
                  src={photo.src}
                  alt={photo.alt}
                  sizes="(min-width: 1024px) 25vw, 50vw"
                  className="h-full w-full"
                  imgClassName="transition-[opacity,transform] duration-[1000ms] group-hover:scale-105"
                />
              </RevealImage>
              <span className="absolute right-3 bottom-3 grid size-9 place-items-center rounded-full bg-cream/85 text-espresso opacity-0 backdrop-blur transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                <Expand className="size-4" strokeWidth={1.6} />
              </span>
            </button>
          </li>
        ))}
      </ul>

      <Dialog open={open !== null} onOpenChange={(isOpen) => !isOpen && setOpen(null)}>
        <DialogContent
          className="grain max-w-[min(56rem,calc(100vw-2rem))] gap-0 overflow-hidden border-0 bg-espresso p-0 text-cream sm:max-w-[min(56rem,calc(100vw-2rem))] [&>button]:text-cream"
          onKeyDown={(e) => {
            if (e.key === 'ArrowRight') go(1)
            if (e.key === 'ArrowLeft') go(-1)
          }}
        >
          <DialogTitle className="sr-only">Details from the workbench</DialogTitle>
          <DialogDescription className="sr-only">Use the arrow keys to move between photos.</DialogDescription>
          {open !== null && (
            <>
              <div className="relative aspect-[4/5] max-h-[78svh] w-full sm:aspect-[4/3]">
                <AnimatePresence initial={false} mode="popLayout">
                  <m.img
                    key={open}
                    src={photos[open].src}
                    alt={photos[open].alt}
                    className="absolute inset-0 h-full w-full object-contain"
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4, ease: EASE_LUX }}
                  />
                </AnimatePresence>
              </div>
              <div className="flex items-center justify-between gap-4 px-5 py-4">
                <button type="button" className={navBtn} onClick={() => go(-1)} aria-label="Previous photo">
                  <ChevronLeft className="size-5" strokeWidth={1.5} />
                </button>
                <p className="text-center text-sm text-cream/75">
                  {photos[open].alt}
                  <span className="ml-2 text-cream/45 tabular-nums">
                    {open + 1} / {photos.length}
                  </span>
                </p>
                <button type="button" className={navBtn} onClick={() => go(1)} aria-label="Next photo">
                  <ChevronRight className="size-5" strokeWidth={1.5} />
                </button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
