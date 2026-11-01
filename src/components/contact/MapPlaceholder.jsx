import { ArrowUpRight, MapPin } from 'lucide-react'
import { site } from '@/config/site'

const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(site.contact.address)}`

/**
 * A drawn stand-in for a map: faint streets, a river and a pulsing pin, with
 * a link to the real location. Swap for an embedded map once the exact
 * workshop address is confirmed.
 */
export function MapPlaceholder() {
  return (
    <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-parchment ring-1 ring-hairline">
      <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full" aria-hidden="true">
        <g className="stroke-sand" fill="none" strokeLinecap="round">
          <path d="M-10 70 L410 40" strokeWidth="9" />
          <path d="M-10 210 L410 250" strokeWidth="12" />
          <path d="M90 -10 L130 310" strokeWidth="8" />
          <path d="M290 -10 L250 310" strokeWidth="10" />
          <path d="M-10 140 Q200 120 410 160" strokeWidth="5" />
          <path d="M180 -10 L200 310" strokeWidth="4" />
          <path d="M40 -10 L20 310" strokeWidth="3" />
          <path d="M350 -10 L370 310" strokeWidth="3" />
        </g>
        <path d="M-10 280 C80 250 120 300 200 270 S330 230 410 260" fill="none" stroke="#c9d6d3" strokeWidth="10" opacity="0.7" />
        <g className="fill-sand/50">
          <rect x="140" y="80" width="40" height="30" rx="3" />
          <rect x="210" y="165" width="34" height="34" rx="3" />
          <rect x="300" y="70" width="46" height="26" rx="3" />
          <rect x="30" y="160" width="44" height="34" rx="3" />
        </g>
      </svg>

      {/* the pin */}
      <div className="absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-full flex-col items-center">
        <span className="absolute top-[62%] size-14 -translate-y-1/2 animate-ping rounded-full bg-cognac/25 motion-reduce:animate-none" aria-hidden="true" />
        <MapPin className="relative size-11 fill-cognac text-cream drop-shadow-md" strokeWidth={1.4} aria-hidden="true" />
      </div>
      <div className="absolute top-[calc(50%+0.75rem)] left-1/2 -translate-x-1/2 rounded-full bg-card px-4 py-1.5 text-sm whitespace-nowrap shadow-md">
        {site.contact.address}
      </div>

      <a
        href={mapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="absolute bottom-4 left-4 inline-flex items-center gap-2 rounded-full bg-espresso px-4 py-2.5 text-sm text-cream transition-colors hover:bg-primary"
      >
        Open in Google Maps
        <ArrowUpRight className="size-4" strokeWidth={1.6} />
      </a>
    </div>
  )
}
