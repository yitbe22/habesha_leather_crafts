import { Link } from 'react-router-dom'
import logoUrl from '@/assets/logo.svg'
import markUrl from '@/assets/logo-mark.svg'
import { site } from '@/config/site'
import { cn } from '@/lib/utils'

/*
 * The brand logo, traced from the shop's own artwork (src/assets). It is drawn
 * as a CSS mask filled with `currentColor`, so it takes the text colour of
 * wherever it sits: espresso on cream, cream on the dark bands and in dark mode.
 */
const mask = (url) => ({
  maskImage: `url(${url})`,
  WebkitMaskImage: `url(${url})`,
  maskSize: 'contain',
  WebkitMaskSize: 'contain',
  maskRepeat: 'no-repeat',
  WebkitMaskRepeat: 'no-repeat',
  maskPosition: 'center',
  WebkitMaskPosition: 'center',
})

/** The full lock-up: hide mark plus "HABESHA LEATHER CRAFTS". */
export function LogoImage({ className, style }) {
  return <span aria-hidden="true" className={cn('block aspect-[2400/992] bg-current', className)} style={{ ...mask(logoUrl), ...style }} />
}

/** The hide mark on its own: dividers, separators, empty states and loading. `size` is its height in px. */
export function LogoMark({ size = 24, className }) {
  return (
    <span
      aria-hidden="true"
      className={cn('inline-block shrink-0 bg-current', className)}
      style={{ ...mask(markUrl), height: size, width: (size * 832) / 992 }}
    />
  )
}

/** The logo as a link home. */
export function Logo({ className, onClick, size = 'h-11 sm:h-12' }) {
  return (
    <Link to="/" onClick={onClick} className={cn('inline-flex transition-opacity hover:opacity-80', className)} aria-label={`${site.name}, home`}>
      <LogoImage className={size} />
    </Link>
  )
}
