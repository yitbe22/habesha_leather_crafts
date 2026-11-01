import { cn } from '@/lib/utils'

/**
 * Colour choice as a real radio group: arrow keys move between colours,
 * and the chosen name is announced through the legend.
 */
export function ColorPicker({ colors, value, onChange, name = 'color' }) {
  return (
    <fieldset>
      <legend className="text-sm">
        Colour: <span className="text-muted-foreground">{value}</span>
      </legend>
      <div className="mt-3 flex flex-wrap gap-3">
        {colors.map((c) => (
          <label key={c.name} className="relative cursor-pointer" title={c.name}>
            <input type="radio" name={name} value={c.name} checked={value === c.name} onChange={() => onChange(c.name)} className="peer sr-only" />
            <span className="sr-only">{c.name}</span>
            <span
              aria-hidden="true"
              className={cn(
                'block size-10 rounded-full ring-1 ring-foreground/15 ring-offset-[3px] ring-offset-background transition',
                'peer-checked:ring-2 peer-checked:ring-cognac peer-focus-visible:outline-2 peer-focus-visible:outline-offset-4 peer-focus-visible:outline-gold',
              )}
              style={{ backgroundColor: c.hex }}
            />
          </label>
        ))}
      </div>
    </fieldset>
  )
}
