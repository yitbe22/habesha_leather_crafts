import { LogoMark } from '@/components/Logo'
import { cn } from '@/lib/utils'

/** A row of saddle stitches. Stretches to fill its container. */
export function StitchLine({ className }) {
  return (
    <svg aria-hidden="true" className={cn('block h-[2px] w-full', className)} preserveAspectRatio="none">
      <line x1="0" y1="1" x2="100%" y2="1" stroke="currentColor" strokeWidth="1.5" strokeDasharray="7 6" strokeLinecap="round" />
    </svg>
  )
}

/** Stitches, the brand mark, stitches. The section divider. */
export function StitchDivider({ className }) {
  return (
    <div className={cn('flex items-center justify-center gap-4 text-gold', className)} aria-hidden="true">
      <StitchLine className="w-16 sm:w-28" />
      <LogoMark size={22} />
      <StitchLine className="w-16 sm:w-28" />
    </div>
  )
}
