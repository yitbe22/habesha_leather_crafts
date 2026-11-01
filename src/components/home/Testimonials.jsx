import { AnimatePresence, m, useReducedMotion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useEffect, useState } from 'react'
import { StitchDivider } from '@/components/Ornaments'
import { Reveal } from '@/components/Reveal'
import { useTestimonials } from '@/hooks/useCatalog'
import { EASE_LUX } from '@/lib/motion'

const ROTATE_MS = 7000
const navBtn =
  'grid size-11 place-items-center rounded-full border border-cream/25 transition-colors hover:border-cream hover:bg-cream hover:text-espresso'

/**
 * One quote at a time on the espresso band. Turns on its own every few
 * seconds, and stops while hovered or focused so it can be read.
 */
export function Testimonials() {
  const { data: quotes = [] } = useTestimonials()
  const reduce = useReducedMotion()
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const count = quotes.length

  useEffect(() => {
    if (paused || reduce || count < 2) return
    const id = setTimeout(() => setIndex((i) => (i + 1) % count), ROTATE_MS)
    return () => clearTimeout(id)
  }, [index, paused, reduce, count])

  const go = (step) => setIndex((i) => (i + step + count) % count)
  const quote = quotes[index]

  return (
    <section className="grain bg-espresso text-cream" aria-labelledby="testimonials-heading">
      <div
        className="container-lux section-y flex flex-col items-center text-center"
        onPointerEnter={() => setPaused(true)}
        onPointerLeave={() => setPaused(false)}
        onFocus={() => setPaused(true)}
        onBlur={() => setPaused(false)}
      >
        <Reveal as="p" className="eyebrow !text-gold">
          Kind words
        </Reveal>
        <h2 id="testimonials-heading" className="sr-only">
          What customers say
        </h2>
        <span className="mt-4 font-serif text-[6rem] leading-[0.6] text-gold/70" aria-hidden="true">
          “
        </span>

        <div className="relative mt-4 grid min-h-[13rem] w-full max-w-4xl place-items-center sm:min-h-[11rem]" aria-live={paused ? 'polite' : 'off'}>
          <AnimatePresence mode="wait" initial={false}>
            {quote && (
              <m.figure
                key={quote.id}
                initial={{ opacity: 0, y: 18, filter: 'blur(6px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -12, filter: 'blur(6px)' }}
                transition={{ duration: 0.6, ease: EASE_LUX }}
              >
                <blockquote className="font-serif text-[clamp(1.5rem,3.2vw,2.5rem)] leading-snug">{quote.quote}</blockquote>
                <figcaption className="mt-6 text-sm text-cream/65">
                  {quote.author}, {quote.location}
                </figcaption>
              </m.figure>
            )}
          </AnimatePresence>
        </div>

        {count > 1 && (
          <div className="mt-10 flex items-center gap-5">
            <button type="button" className={navBtn} onClick={() => go(-1)} aria-label="Previous quote">
              <ChevronLeft className="size-4" strokeWidth={1.6} />
            </button>
            <div className="flex gap-2">
              {quotes.map((q, i) => (
                <button
                  key={q.id}
                  type="button"
                  onClick={() => setIndex(i)}
                  aria-label={`Quote ${i + 1} of ${count}`}
                  aria-current={i === index}
                  className="h-1.5 rounded-full bg-cream/30 transition-all duration-500 aria-[current=true]:w-7 aria-[current=true]:bg-gold [&:not([aria-current=true])]:w-1.5"
                />
              ))}
            </div>
            <button type="button" className={navBtn} onClick={() => go(1)} aria-label="Next quote">
              <ChevronRight className="size-4" strokeWidth={1.6} />
            </button>
          </div>
        )}

        <StitchDivider className="mt-12" />
        {quotes.some((q) => q.placeholder) && <p className="mt-6 text-xs text-cream/45">Sample reviews for this demo. Real customer quotes coming soon.</p>}
      </div>
    </section>
  )
}
