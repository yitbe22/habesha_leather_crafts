import { AnimatePresence, m, useInView, useScroll } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { RevealImage } from '@/components/Reveal'
import { SectionHeading } from '@/components/SectionHeading'
import { SmartImage } from '@/components/SmartImage'
import { images } from '@/config/images'
import { EASE_LUX } from '@/lib/motion'
import { cn } from '@/lib/utils'

const STEPS = [
  {
    title: 'Select the leather',
    text: 'We choose each hide by hand, looking for an even grain, the right thickness and the natural marks that make it honest.',
  },
  {
    title: 'Cut by hand',
    text: 'Every panel is traced from our own patterns and cut with a knife, positioned to use the strongest part of the hide.',
  },
  {
    title: 'Stitch',
    text: 'Seams are saddle-stitched with waxed thread, two needles through each hole, so a single broken stitch never unravels.',
  },
  {
    title: 'Finish',
    text: 'Edges are sanded, dyed and burnished smooth, hardware is fitted, and the piece is checked over one last time.',
  },
]

const pad = (n) => String(n).padStart(2, '0')

function Step({ step, index, reached, onActive }) {
  const ref = useRef(null)
  // a step becomes current while it crosses the middle band of the screen
  const inView = useInView(ref, { margin: '-45% 0px -45% 0px' })
  useEffect(() => {
    if (inView) onActive(index)
  }, [inView, index, onActive])

  return (
    <li ref={ref} className="relative pb-16 last:pb-0 lg:min-h-[50svh]">
      <span
        className={cn(
          'absolute top-0 -left-14 grid size-10 place-items-center rounded-full border font-serif text-lg transition-colors duration-500',
          reached ? 'border-primary bg-primary text-primary-foreground' : 'border-sand bg-parchment text-umber',
        )}
        aria-hidden="true"
      >
        {index + 1}
      </span>
      <p className="eyebrow">Step {pad(index + 1)}</p>
      <h3 className="text-subtitle mt-2">{step.title}</h3>
      <p className="mt-3 max-w-[46ch] text-muted-foreground">{step.text}</p>
      {/* on small screens each step carries its own photo */}
      <RevealImage radius="1rem" className="mt-6 aspect-[16/10] rounded-2xl bg-muted lg:hidden">
        <SmartImage src={images.process[index].src} alt={images.process[index].alt} sizes="100vw" className="h-full w-full" />
      </RevealImage>
    </li>
  )
}

/**
 * The four steps. A gold seam is sewn down the timeline as you scroll; on
 * large screens a sticky photo beside it follows the current step.
 */
export function ProcessSteps() {
  const listRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: listRef, offset: ['start 60%', 'end 55%'] })
  const [active, setActive] = useState(0)

  return (
    <section className="bg-parchment" aria-labelledby="process-heading">
      <div className="container-lux section-y">
        <SectionHeading
          id="process-heading"
          eyebrow="The process"
          title="From hide to heirloom in four steps"
          description="The same four steps, in the same order, for every piece that leaves the workshop."
        />
        <div className="mt-14 grid gap-14 lg:grid-cols-2 lg:gap-20">
          {/* only the photo is sticky, sized to always fit the screen beside the steps */}
          <div className="hidden lg:sticky lg:top-[calc(var(--header-h)+2rem)] lg:block lg:self-start">
            <div className="relative h-[min(34rem,calc(100svh-var(--header-h)-4rem))] overflow-hidden rounded-2xl bg-muted">
              <AnimatePresence initial={false}>
                <m.div
                  key={active}
                  className="absolute inset-0"
                  initial={{ opacity: 0, scale: 1.06 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.9, ease: EASE_LUX }}
                >
                  <SmartImage src={images.process[active].src} alt={images.process[active].alt} sizes="45vw" className="h-full w-full" />
                </m.div>
              </AnimatePresence>
              <span className="absolute bottom-4 left-4 rounded-full bg-cream/85 px-3 py-1 text-sm text-espresso tabular-nums backdrop-blur" aria-hidden="true">
                {pad(active + 1)} / {pad(STEPS.length)}
              </span>
            </div>
          </div>

          <ol ref={listRef} className="relative pl-14">
            {/* the seam: faint stitches, with the gold ones sewn in as you scroll */}
            <span className="seam absolute top-5 bottom-5 left-[19px] w-[2px] text-sand" aria-hidden="true" />
            <m.span
              className="seam absolute top-5 bottom-5 left-[19px] w-[2px] origin-top text-gold"
              style={{ scaleY: scrollYProgress }}
              aria-hidden="true"
            />
            {STEPS.map((step, i) => (
              <Step key={step.title} step={step} index={i} reached={i <= active} onActive={setActive} />
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
