import { Minus, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'

const stepBtn = 'grid place-items-center rounded-full transition-colors hover:bg-foreground/5 disabled:opacity-30 disabled:hover:bg-transparent'

/** − n + control. `size="lg"` matches the height of the large buttons. */
export function QuantityStepper({ value, onChange, min = 1, max = 10, label = 'Quantity', size = 'sm', className }) {
  const btn = size === 'lg' ? 'size-11' : 'size-8'
  return (
    <div className={cn('flex items-center rounded-full border border-border', className)} role="group" aria-label={label}>
      <button type="button" className={cn(stepBtn, btn)} onClick={() => onChange(value - 1)} disabled={value <= min} aria-label="Decrease quantity">
        <Minus className="size-3.5" strokeWidth={1.6} />
      </button>
      <span className={cn('text-center tabular-nums', size === 'lg' ? 'w-8' : 'w-7 text-sm')} aria-live="polite">
        {value}
      </span>
      <button type="button" className={cn(stepBtn, btn)} onClick={() => onChange(value + 1)} disabled={value >= max} aria-label="Increase quantity">
        <Plus className="size-3.5" strokeWidth={1.6} />
      </button>
    </div>
  )
}
