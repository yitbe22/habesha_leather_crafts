import { cn } from '@/lib/utils'

const delayStyle = (delay, style, extra) => ({ '--d': `${Math.round(delay * 1000)}ms`, ...extra, ...style })

/**
 * Rises out of a soft blur the first time it scrolls into view
 * (useScrollReveal adds `in`; index.css does the animation).
 */
export function Reveal({ as: Tag = 'div', delay = 0, style, ...props }) {
  return <Tag data-reveal="" style={delayStyle(delay, style)} {...props} />
}

/**
 * Image frame that wipes open from the bottom while the photo settles from a
 * slight zoom. `radius` must match the frame's rounded corners.
 */
export function RevealImage({ delay = 0, radius = '0px', style, className, children, ...props }) {
  return (
    <div data-reveal="image" className={cn('overflow-hidden', className)} style={delayStyle(delay, style, { '--r': radius })} {...props}>
      {/* the clip sits on an inner layer: a fully clipped target would never count as in view */}
      <div className="reveal-clip h-full w-full">
        <div className="reveal-zoom h-full w-full">{children}</div>
      </div>
    </div>
  )
}
