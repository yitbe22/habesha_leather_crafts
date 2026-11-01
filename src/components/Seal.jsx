import { useId } from 'react'
import { cn } from '@/lib/utils'

/**
 * Circular text seal that slowly turns (after Mercy's hero badge), with
 * anything you like at its centre. Renders as a link when given `href`.
 */
export function Seal({ text, href, label, className, children }) {
  const id = `seal-${useId().replace(/:/g, '')}`
  const Tag = href ? 'a' : 'div'
  const linkProps = href ? { href, target: '_blank', rel: 'noopener noreferrer', 'aria-label': label } : { 'aria-hidden': true }

  return (
    <Tag {...linkProps} className={cn('group relative grid size-28 place-items-center rounded-full', className)}>
      <svg viewBox="0 0 100 100" className="absolute inset-0 size-full animate-[spin_36s_linear_infinite] motion-reduce:animate-none" aria-hidden="true">
        <defs>
          <path id={id} d="M50,50 m-38,0 a38,38 0 1,1 76,0 a38,38 0 1,1 -76,0" />
        </defs>
        <text className="fill-current text-[8.4px] font-medium tracking-[0.12em]">
          <textPath href={`#${id}`} textLength="236">
            {text}
          </textPath>
        </text>
      </svg>
      {children}
    </Tag>
  )
}
