import { LogoMark } from '@/components/Logo'

/**
 * Shown while a lazily loaded page is on its way. It stays invisible for the
 * first moment, so quick loads (and a photo flying in) never flash a spinner.
 */
export function PageFallback() {
  return (
    <div className="grid min-h-[70svh] place-items-center" role="status" aria-label="Loading">
      <LogoMark size={36} className="animate-in fade-in fill-mode-both text-gold delay-500 duration-500" />
    </div>
  )
}
