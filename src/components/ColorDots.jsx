import { cn } from '@/lib/utils'

/** Small swatches showing which colours a product comes in. */
export function ColorDots({ colors, className }) {
  if (colors.length < 2) return null
  return (
    <div className={cn('flex items-center gap-1.5', className)}>
      <span className="sr-only">Available in {colors.map((c) => c.name).join(', ')}</span>
      {colors.map((c) => (
        <span
          key={c.name}
          title={c.name}
          aria-hidden="true"
          className="size-3 rounded-full ring-1 ring-foreground/15 ring-offset-1 ring-offset-background"
          style={{ backgroundColor: c.hex }}
        />
      ))}
    </div>
  )
}
