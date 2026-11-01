import { Fragment } from 'react'
import { LogoMark } from '@/components/Logo'
import { cn } from '@/lib/utils'

/**
 * A slow band of words separated by the brand mark. Pauses on hover and stands
 * still with reduced motion. Screen readers get the words once.
 */
export function Marquee({ items, speed = '40s', className }) {
  const row = (copy) => (
    <div className="flex shrink-0 items-center" aria-hidden={copy > 0 || undefined}>
      {items.map((item) => (
        <Fragment key={item}>
          <span className="px-8 font-serif text-[clamp(1.4rem,2.6vw,2.1rem)] whitespace-nowrap italic">{item}</span>
          <LogoMark size={18} className="text-gold" />
        </Fragment>
      ))}
    </div>
  )

  return (
    <div className={cn('marquee grain overflow-hidden bg-espresso py-6 text-cream', className)}>
      <p className="sr-only">{items.join(', ')}</p>
      <div className="marquee-track flex w-max" style={{ '--marquee-speed': speed }}>
        {row(0)}
        {row(1)}
      </div>
    </div>
  )
}
