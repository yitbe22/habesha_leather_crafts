import { useLayoutEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

/** Local product photos come as "-480.webp" and "-960.webp"; anything else is used as-is. */
export function srcSetFor(src) {
  if (!src?.endsWith('-960.webp')) return undefined
  return `${src.replace(/-960\.webp$/, '-480.webp')} 480w, ${src} 960w`
}

/**
 * Lazy, responsive image that fades in once decoded, over a parchment
 * placeholder. `priority` loads it straight away (for above-the-fold photos).
 * An image the browser already has is shown at once, without the fade, so a
 * photo flying in from a product card never lands on an empty frame.
 */
export function SmartImage({ src, alt = '', sizes = '(min-width: 1024px) 25vw, 50vw', priority, className, imgClassName }) {
  const ref = useRef(null)
  const [state, setState] = useState('loading') // loading → instant (was cached) | loaded (faded in)

  // runs before paint, so a cached image never shows its placeholder
  useLayoutEffect(() => {
    setState(ref.current?.complete && ref.current.naturalWidth ? 'instant' : 'loading')
  }, [src])

  return (
    <div className={cn('relative overflow-hidden bg-muted', className)}>
      <img
        ref={ref}
        src={src}
        srcSet={srcSetFor(src)}
        sizes={sizes}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : undefined}
        decoding="async"
        onLoad={() => setState((s) => (s === 'instant' ? s : 'loaded'))}
        className={cn(
          'h-full w-full object-cover',
          state !== 'instant' && 'transition-opacity duration-700 ease-[var(--ease-lux)]',
          state === 'loading' ? 'opacity-0' : 'opacity-100',
          imgClassName,
        )}
      />
    </div>
  )
}
