import { StitchDivider } from '@/components/Ornaments'
import { Reveal } from '@/components/Reveal'
import { Words } from '@/components/Words'
import { cn } from '@/lib/utils'

/** Centred heading block that opens every inner page. */
export function PageHeader({ eyebrow, title, description, className, children }) {
  return (
    <header className={cn('container-lux page-top flex flex-col items-center pb-12 text-center', className)}>
      {eyebrow && (
        <Reveal as="p" className="eyebrow">
          {eyebrow}
        </Reveal>
      )}
      <h1 data-reveal="words" className="text-title mt-4 max-w-[18ch]">
        <Words text={title} />
      </h1>
      {description && (
        <Reveal as="p" delay={0.25} className="mt-5 max-w-[56ch] text-muted-foreground">
          {description}
        </Reveal>
      )}
      <Reveal delay={0.35} className="mt-8">
        <StitchDivider />
      </Reveal>
      {children}
    </header>
  )
}
