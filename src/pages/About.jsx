import { m, useScroll, useTransform } from 'framer-motion'
import { ArrowRight, Hand, Hourglass, Leaf, MapPin } from 'lucide-react'
import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { WorkbenchGallery } from '@/components/about/WorkbenchGallery'
import { WhatsAppIcon } from '@/components/BrandIcons'
import { StitchLine } from '@/components/Ornaments'
import { PageHeader } from '@/components/PageHeader'
import { Reveal, RevealImage } from '@/components/Reveal'
import { SectionHeading } from '@/components/SectionHeading'
import { Seo } from '@/components/Seo'
import { SmartImage } from '@/components/SmartImage'
import { Button } from '@/components/ui/button'
import { Words } from '@/components/Words'
import { images } from '@/config/images'
import { site } from '@/config/site'
import { whatsappLink } from '@/lib/whatsapp'

// TODO: replace this placeholder story with the founders' own words, names and dates.
const STORY = [
  'Habesha Leather Crafts began at a single workbench in Addis Ababa, with a simple idea: the leather this country produces is some of the finest in the world, and it deserves to be made into things that are just as fine.',
  'Today every bag, wallet and belt is still cut, stitched and finished by hand in our workshop. We work in small batches, so we can take the time each piece needs and make to order when you want something that is yours alone.',
]

const VALUES = [
  { Icon: Leaf, title: 'Honest materials', text: 'Ethiopian hides from tanneries we know, solid brass and gunmetal hardware, waxed thread. Nothing hidden under a coating.' },
  { Icon: Hand, title: 'Made by hand', text: 'Patterns drawn, panels cut and seams sewn by people, not a production line. You can see it in every stitch.' },
  { Icon: Hourglass, title: 'Built to last', text: 'Saddle stitching, burnished edges and thick leather that softens and darkens with years of use.' },
  { Icon: MapPin, title: 'Rooted in Ethiopia', text: 'Designed and made in Addis Ababa, with the craft and the name of the place it comes from.' },
]

export default function About() {
  const bannerRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: bannerRef, offset: ['start end', 'end start'] })
  // the banner photo settles from a slight zoom and drifts as it passes
  const scale = useTransform(scrollYProgress, [0, 0.5], [1.18, 1])
  const y = useTransform(scrollYProgress, [0, 1], ['-4%', '4%'])

  return (
    <>
      <Seo
        title="Our Story"
        description="How Habesha Leather Crafts cuts, stitches and finishes every bag, wallet and belt by hand in Addis Ababa, from honest Ethiopian leather."
        path="/about"
      />
      <PageHeader
        eyebrow="Our story"
        title="Rooted in Ethiopian craft, made for every day"
        description="A small workshop in Addis Ababa, turning the country's finest leather into pieces meant to be carried for years."
        className="pb-14"
      />

      {/* banner */}
      <div className="container-lux">
        <div ref={bannerRef} className="relative h-[52svh] overflow-hidden rounded-[2rem] bg-muted sm:h-[68svh]">
          <m.div className="absolute inset-x-0 -top-[6%] h-[112%]" style={{ scale, y }}>
            <SmartImage src={images.about.banner.src} alt={images.about.banner.alt} sizes="100vw" priority className="h-full w-full" />
          </m.div>
          <div className="pointer-events-none absolute inset-4 rounded-[1.5rem] border border-dashed border-cream/45" aria-hidden="true" />
        </div>
      </div>

      {/* story */}
      <section className="container-lux section-y grid gap-12 lg:grid-cols-12" aria-labelledby="story-heading">
        <div className="lg:col-span-5">
          <SectionHeading id="story-heading" eyebrow="How it started" title="One workbench, one idea" />
        </div>
        <div className="flex flex-col gap-6 text-[1.075rem] leading-[1.85] text-muted-foreground lg:col-span-6 lg:col-start-7">
          {STORY.map((paragraph, i) => (
            <Reveal
              as="p"
              key={i}
              delay={i * 0.12}
              className={i === 0 ? 'first-letter:float-left first-letter:mt-1 first-letter:mr-3 first-letter:font-serif first-letter:text-[4.2rem] first-letter:leading-[0.8] first-letter:text-cognac' : undefined}
            >
              {paragraph}
            </Reveal>
          ))}
        </div>
      </section>

      {/* pull quote */}
      <section className="grain bg-espresso text-cream" aria-label="Our belief">
        <div className="container-lux section-y flex flex-col items-center text-center">
          <StitchLine className="max-w-xs text-gold/60" />
          <blockquote data-reveal="words" className="mt-10 max-w-4xl font-serif text-[clamp(1.8rem,4.2vw,3.4rem)] leading-tight italic">
            <Words text="Good leather remembers every day you carry it. We make pieces worth remembering." />
          </blockquote>
          <Reveal as="p" delay={0.3} className="mt-8 text-sm tracking-[0.2em] text-gold uppercase">
            The workshop, Addis Ababa
          </Reveal>
          <StitchLine className="mt-10 max-w-xs text-gold/60" />
        </div>
      </section>

      {/* values */}
      <section className="container-lux section-y" aria-labelledby="values-heading">
        <SectionHeading id="values-heading" eyebrow="What we stand for" title="Four promises in every piece" align="center" />
        <ul className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {VALUES.map(({ Icon, title, text }, i) => (
            <Reveal as="li" key={title} delay={i * 0.1}>
              {/* the lift lives on an inner box: the reveal owns the outer element's transform */}
              <div className="stitched h-full rounded-2xl bg-parchment p-7 transition-transform duration-500 ease-[var(--ease-lux)] hover:-translate-y-1.5">
                <span className="grid size-12 place-items-center rounded-full bg-background text-cognac">
                  <Icon className="size-5" strokeWidth={1.5} />
                </span>
                <h3 className="mt-6 text-[1.5rem]">{title}</h3>
                <p className="mt-2 text-[0.95rem] leading-relaxed text-muted-foreground">{text}</p>
              </div>
            </Reveal>
          ))}
        </ul>
      </section>

      {/* workbench gallery */}
      <section className="bg-parchment" aria-labelledby="workbench-heading">
        <div className="container-lux section-y">
          <SectionHeading
            id="workbench-heading"
            eyebrow="Up close"
            title="Details from the workbench"
            description="The weave, the quilting, the edges and the hardware: the small things that take the longest."
          />
          <div className="mt-12">
            <WorkbenchGallery photos={images.about.workbench} />
          </div>
        </div>
      </section>

      {/* call to action */}
      <section className="container-lux section-y flex flex-col items-center text-center" aria-labelledby="about-cta-heading">
        <RevealImage radius="999px" className="size-28 rounded-full">
          <SmartImage src={images.story.detail.src} alt="" sizes="112px" className="h-full w-full" />
        </RevealImage>
        <h2 id="about-cta-heading" data-reveal="words" className="text-title mt-8 max-w-[20ch]">
          <Words text="Find a piece to carry your story" />
        </h2>
        <Reveal delay={0.25} className="mt-8 flex flex-wrap justify-center gap-3">
          <Button asChild size="lg" className="group h-12 rounded-full px-7">
            <Link to="/shop">
              Shop the collection
              <ArrowRight className="transition-transform group-hover:translate-x-1" strokeWidth={1.6} />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="h-12 rounded-full px-7">
            <a href={whatsappLink(`Hello ${site.name}, I'd like to ask about a custom piece.`)} target="_blank" rel="noopener noreferrer">
              <WhatsAppIcon className="size-[1.1rem]" />
              Ask about a custom piece
            </a>
          </Button>
        </Reveal>
      </section>
    </>
  )
}
