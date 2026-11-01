import { Reveal } from '@/components/Reveal'
import { Words } from '@/components/Words'
import { cn } from '@/lib/utils'

/** Eyebrow, word-by-word heading and optional intro text. `children` sits beside it (e.g. a "View all" link). */
export function SectionHeading({ id, eyebrow, title, description, align = 'left', className, children }) {
  const centered = align === 'center'
  return (
    <div className={cn('flex flex-col gap-6 md:flex-row md:items-end md:justify-between', centered && 'items-center text-center md:flex-col md:items-center', className)}>
      <div className={cn('max-w-2xl', centered && 'mx-auto')}>
        {eyebrow && (
          <Reveal as="p" className="eyebrow">
            {eyebrow}
          </Reveal>
        )}
        <h2 id={id} data-reveal="words" className="text-title mt-3">
          <Words text={title} />
        </h2>
        {description && (
          <Reveal as="p" delay={0.2} className="mt-4 max-w-[54ch] text-muted-foreground">
            {description}
          </Reveal>
        )}
      </div>
      {children && <Reveal delay={0.25}>{children}</Reveal>}
    </div>
  )
}
