import { AnimatePresence, m, useReducedMotion } from 'framer-motion'
import { ArrowRight, ArrowUpRight, Gem, Scissors, Spool } from 'lucide-react'
import { Fragment, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { WhatsAppIcon } from '@/components/BrandIcons'
import { LogoMark } from '@/components/Logo'
import { srcSetFor } from '@/components/SmartImage'
import { Button } from '@/components/ui/button'
import { images } from '@/config/images'
import { site } from '@/config/site'
import { useIntroDone } from '@/lib/intro'
import { EASE_EXPO, EASE_LUX } from '@/lib/motion'
import { whatsappLink } from '@/lib/whatsapp'

const SLIDE_MS = 6500
const TITLE = 'Leather that carries your story'
const SIZES = '(min-width: 1024px) 45vw, 100vw'

const PROMISES = [
  { Icon: Gem, label: 'Genuine Ethiopian leather' },
  { Icon: Scissors, label: 'Cut by hand' },
  { Icon: Spool, label: 'Saddle-stitched' },
]

// entrance choreography, played once the intro curtain lifts
const word = {
  hidden: { y: '110%' },
  show: (i) => ({ y: 0, transition: { duration: 1.1, ease: EASE_EXPO, delay: 0.15 + i * 0.07 } }),
}
const rise = {
  hidden: { y: 18, opacity: 0 },
  show: (delay) => ({ y: 0, opacity: 1, transition: { duration: 0.8, ease: EASE_LUX, delay } }),
}
// the arch frame wipes open from the bottom; clip-path is dropped afterwards so the shadow shows
const frameOpen = {
  hidden: { clipPath: 'inset(100% 0% 0% 0%)' },
  show: {
    clipPath: 'inset(0% 0% 0% 0%)',
    transition: { duration: 1.5, ease: EASE_EXPO, delay: 0.25 },
    transitionEnd: { clipPath: 'none' },
  },
}

/**
 * Home hero: the headline on the left, an arch-topped photo frame on the
 * right that crossfades between lifestyle shots with a slow zoom. Hovering the
 * frame pauses it; the bars underneath show progress and jump between photos.
 */
export function Hero() {
  const ready = useIntroDone()
  const reduce = useReducedMotion()
  const slides = images.hero
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const running = ready && !paused && !reduce

  useEffect(() => {
    if (!running) return
    const id = setTimeout(() => setIndex((i) => (i + 1) % slides.length), SLIDE_MS)
    return () => clearTimeout(id)
  }, [running, index, slides.length])

  const slide = slides[index]

  return (
    <section className="relative overflow-hidden" aria-label="Introduction">
      {/* parchment panel behind the frame */}
      <div className="absolute inset-y-0 right-0 hidden w-[36%] bg-parchment lg:block" aria-hidden="true" />

      <m.div
        initial={false}
        animate={ready ? 'show' : 'hidden'}
        className="container-lux relative grid items-center gap-14 pt-[calc(var(--header-h)+2.5rem)] pb-16 lg:min-h-svh lg:grid-cols-[1.1fr_1fr] lg:gap-16 lg:pb-12"
      >
        {/* headline */}
        <div className="flex flex-col items-start">
          <m.p variants={rise} custom={0.05} className="eyebrow flex items-center gap-3">
            <LogoMark size={16} className="text-gold" />
            Handcrafted in Addis Ababa
          </m.p>
          <h1 className="text-display mt-6 max-w-[11ch] leading-[0.94]">
            {TITLE.split(' ').map((w, i) => (
              <Fragment key={i}>
                <span className="word-mask">
                  <m.span className="inline-block" variants={word} custom={i}>
                    {w === 'story' ? <em className="text-cognac">{w}</em> : w}
                  </m.span>
                </span>{' '}
              </Fragment>
            ))}
          </h1>
          <m.p variants={rise} custom={0.6} className="mt-6 max-w-[44ch] text-lg leading-relaxed text-muted-foreground">
            Bags, wallets and belts cut from Ethiopian hides and stitched by hand, one piece at a time, in our Addis Ababa workshop.
          </m.p>
          <m.div variants={rise} custom={0.72} className="mt-9 flex flex-wrap gap-3">
            <Button asChild size="lg" className="group h-13 rounded-full px-8 text-[0.95rem]">
              <Link to="/shop">
                Shop the collection
                <ArrowRight className="transition-transform group-hover:translate-x-1" strokeWidth={1.6} />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-13 rounded-full bg-transparent px-7 text-[0.95rem]">
              <a href={whatsappLink(`Hello ${site.name}, I'd like to place an order.`)} target="_blank" rel="noopener noreferrer">
                <WhatsAppIcon className="size-[1.1rem]" />
                Order on WhatsApp
              </a>
            </Button>
          </m.div>
          <m.ul variants={rise} custom={0.86} className="mt-12 grid w-full max-w-lg grid-cols-3 gap-4 border-t border-hairline pt-6">
            {PROMISES.map(({ Icon, label }) => (
              <li key={label} className="flex flex-col gap-2 text-[0.82rem] leading-snug text-muted-foreground sm:flex-row sm:items-center">
                <Icon className="size-[1.1rem] shrink-0 text-cognac" strokeWidth={1.5} />
                {label}
              </li>
            ))}
          </m.ul>
        </div>

        {/* photo frame */}
        <div className="relative mx-auto w-full max-w-[480px] lg:max-w-[540px]">
          <div className="rounded-t-[999px] rounded-b-[2rem] shadow-[0_50px_80px_-50px_rgba(42,26,18,0.6)]">
            <m.div
              variants={frameOpen}
              className="relative aspect-[4/5] overflow-hidden rounded-t-[999px] rounded-b-[2rem] bg-muted"
              onPointerEnter={(e) => e.pointerType === 'mouse' && setPaused(true)}
              onPointerLeave={() => setPaused(false)}
            >
              <AnimatePresence initial={false}>
                <m.div
                  key={index}
                  className="absolute inset-0"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.3, ease: EASE_LUX }}
                >
                  <m.img
                    src={slide.src}
                    srcSet={srcSetFor(slide.src)}
                    sizes={SIZES}
                    alt={slide.alt}
                    fetchPriority={index === 0 ? 'high' : undefined}
                    className="h-full w-full object-cover"
                    initial={{ scale: 1.14 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: SLIDE_MS / 1000 + 1.5, ease: 'linear' }}
                  />
                </m.div>
              </AnimatePresence>
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-espresso/45 via-transparent to-transparent" />
              {/* a stitched inner edge echoing the frame */}
              <div className="pointer-events-none absolute inset-3 rounded-t-[999px] rounded-b-[1.4rem] border border-dashed border-cream/45" />

              <div className="absolute right-7 bottom-7 flex gap-2">
                {slides.map((s, i) => (
                  <button
                    key={s.src}
                    type="button"
                    onClick={() => setIndex(i)}
                    aria-label={`Show photo ${i + 1} of ${slides.length}: ${s.label}`}
                    aria-current={i === index}
                    className="relative h-1 w-9 overflow-hidden rounded-full bg-cream/35 before:absolute before:-inset-3 before:content-['']"
                  >
                    {i === index && (
                      <m.span
                        key={`${index}-${running}`}
                        className="absolute inset-0 origin-left bg-cream"
                        initial={{ scaleX: running ? 0 : 1 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: running ? SLIDE_MS / 1000 : 0, ease: 'linear' }}
                      />
                    )}
                  </button>
                ))}
              </div>
            </m.div>
          </div>

          {/* which piece is in the photo */}
          <m.div variants={rise} custom={1.05} className="absolute -bottom-6 left-3 sm:-left-8">
            <AnimatePresence mode="wait" initial={false}>
              <m.div key={index} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.45, ease: EASE_LUX }}>
                <Link
                  to={`/product/${slide.slug}`}
                  className="group flex items-center gap-3 rounded-2xl bg-card/95 p-2.5 pr-5 shadow-[0_20px_40px_-24px_rgba(42,26,18,0.5)] ring-1 ring-hairline backdrop-blur"
                >
                  <span className="grid size-11 place-items-center rounded-xl bg-parchment text-cognac transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <ArrowUpRight className="size-4" strokeWidth={1.6} />
                  </span>
                  <span className="leading-tight">
                    <span className="block text-xs text-muted-foreground">In the photo</span>
                    <span className="font-serif text-lg">{slide.label}</span>
                  </span>
                </Link>
              </m.div>
            </AnimatePresence>
          </m.div>
        </div>
      </m.div>
    </section>
  )
}
