import { m, useScroll, useTransform } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { CountUp } from '@/components/CountUp'
import { LogoMark } from '@/components/Logo'
import { Reveal, RevealImage } from '@/components/Reveal'
import { Seal } from '@/components/Seal'
import { SectionHeading } from '@/components/SectionHeading'
import { SmartImage } from '@/components/SmartImage'
import { images } from '@/config/images'
import { useCategories } from '@/hooks/useCatalog'

/**
 * "Our Craft": two photos drifting at different speeds beside the story,
 * a slowly turning seal between them, and counters that run once in view.
 */
export function CraftStory() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const bigY = useTransform(scrollYProgress, [0, 1], ['-6%', '6%'])
  const smallY = useTransform(scrollYProgress, [0, 1], ['28%', '-28%'])
  const { data: categories } = useCategories()
  const designs = categories?.reduce((sum, c) => sum + c.product_count, 0)

  const stats = [
    { value: designs ? <CountUp to={designs} /> : '…', label: 'designs in the collection' },
    { value: <CountUp to={4} />, label: 'steps, every one by hand' },
    { value: <CountUp to={100} suffix="%" />, label: 'genuine leather' },
  ]

  return (
    <section ref={ref} className="container-lux section-y grid items-center gap-16 lg:grid-cols-12 lg:gap-8" aria-labelledby="craft-heading">
      <div className="relative pb-14 sm:pr-16 lg:col-span-6 lg:pb-20">
        <RevealImage radius="2rem" className="relative aspect-[4/5] rounded-[2rem] bg-muted">
          {/* taller than the frame by 8% at each end, so the parallax never shows an edge */}
          <m.div className="absolute inset-x-0 -top-[8%] h-[116%]" style={{ y: bigY }}>
            <SmartImage src={images.story.main.src} alt={images.story.main.alt} sizes="(min-width: 1024px) 45vw, 100vw" className="h-full w-full" />
          </m.div>
        </RevealImage>
        <m.div className="absolute right-0 bottom-0 hidden w-[42%] rounded-[1.5rem] ring-8 ring-background sm:block" style={{ y: smallY }}>
          <RevealImage delay={0.25} radius="1.5rem" className="aspect-[3/4] rounded-[1.5rem] bg-muted">
            <SmartImage src={images.story.detail.src} alt={images.story.detail.alt} sizes="20vw" className="h-full w-full" />
          </RevealImage>
        </m.div>
        <div className="absolute top-8 -right-1 hidden sm:block lg:-right-6">
          <Seal text="CUT · STITCHED · FINISHED BY HAND · " className="size-24 bg-background text-cognac ring-1 ring-hairline">
            <LogoMark size={30} className="text-gold" />
          </Seal>
        </div>
      </div>

      <div className="flex flex-col items-start gap-6 lg:col-span-5 lg:col-start-8">
        <SectionHeading id="craft-heading" eyebrow="Our craft" title="Every piece passes through the same pair of hands" />
        <Reveal as="p" delay={0.15} className="max-w-[52ch] text-[1.05rem] leading-[1.8] text-muted-foreground">
          Ethiopian highland leather is prized around the world for its strength and its soft, close grain. We buy it from
          tanneries we know, then cut, stitch and finish every bag, wallet and belt ourselves in our Addis Ababa workshop.
          No production line, no shortcuts: just good leather, waxed thread and time.
        </Reveal>
        <Reveal delay={0.25}>
          <Link to="/about" className="group inline-flex items-center gap-3 text-[0.95rem]">
            <span className="link-draw">Read our story</span>
            <span className="grid size-9 place-items-center rounded-full border border-foreground/25 transition group-hover:translate-x-1 group-hover:border-foreground">
              <ArrowRight className="size-3.5" strokeWidth={1.6} />
            </span>
          </Link>
        </Reveal>
        <dl className="mt-4 grid w-full grid-cols-3 gap-4 border-t border-hairline pt-8">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={0.3 + i * 0.1} className="flex flex-col gap-1.5">
              <dt className="order-2 text-[0.82rem] leading-snug text-muted-foreground">{s.label}</dt>
              <dd className="order-1 font-serif text-[clamp(2rem,3.4vw,2.9rem)] leading-none text-cognac">{s.value}</dd>
            </Reveal>
          ))}
        </dl>
      </div>
    </section>
  )
}
