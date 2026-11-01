import { ArrowUpRight } from 'lucide-react'
import { useRef } from 'react'
import { InstagramIcon } from '@/components/BrandIcons'
import { Reveal } from '@/components/Reveal'
import { SectionHeading } from '@/components/SectionHeading'
import { SmartImage } from '@/components/SmartImage'
import { images } from '@/config/images'
import { site } from '@/config/site'
import { useDragScroll } from '@/hooks/useDragScroll'

/** A swipeable (or mouse-draggable) strip of square photos, each linking to the Instagram profile. */
export function InstagramStrip() {
  const railRef = useRef(null)
  useDragScroll(railRef)

  return (
    <section className="section-y overflow-hidden" aria-labelledby="instagram-heading">
      <div className="container-lux">
        <SectionHeading id="instagram-heading" eyebrow={site.social.instagramHandle} title="Follow the workshop">
          <a
            href={site.social.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-12 items-center gap-2.5 rounded-full border border-foreground/20 px-6 text-sm font-medium transition-colors hover:border-foreground hover:bg-foreground hover:text-background"
          >
            <InstagramIcon className="size-[1.1rem]" />
            Follow on Instagram
            <ArrowUpRight className="size-4" strokeWidth={1.5} />
          </a>
        </SectionHeading>
      </div>

      {/* the reveal sits outside the scroller: a scroll container clips anything that rises or blurs past its edges */}
      <Reveal delay={0.15} className="mt-12">
        <ul
          ref={railRef}
          className="rail flex snap-x snap-mandatory scroll-pl-[max(var(--gutter),calc((100vw-1320px)/2+var(--gutter)))] gap-3 overflow-x-auto pr-[var(--gutter)] pl-[max(var(--gutter),calc((100vw-1320px)/2+var(--gutter)))] sm:gap-4"
        >
          {images.gallery.map((img) => (
            <li key={img.src} className="w-[62vw] max-w-[300px] shrink-0 snap-start sm:w-[34vw] lg:w-[22vw]">
              <a href={site.social.instagram} target="_blank" rel="noopener noreferrer" className="group relative block aspect-square overflow-hidden rounded-xl">
                <SmartImage
                  src={img.src}
                  alt={img.alt}
                  sizes="(min-width: 1024px) 22vw, 62vw"
                  className="h-full w-full"
                  imgClassName="transition-[opacity,transform] duration-[1000ms] group-hover:scale-105"
                />
                <span className="absolute inset-0 grid place-items-center bg-espresso/45 text-cream opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
                  <InstagramIcon className="size-8" />
                </span>
                <span className="sr-only">(view on Instagram, opens in a new tab)</span>
              </a>
            </li>
          ))}
        </ul>
      </Reveal>
    </section>
  )
}
