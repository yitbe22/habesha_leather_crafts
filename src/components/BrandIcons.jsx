// Outline brand icons drawn in lucide's style (lucide no longer ships brand marks).
const base = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
}

export function InstagramIcon({ className = 'size-5' }) {
  return (
    <svg {...base} className={className}>
      <rect x="4" y="4" width="16" height="16" rx="4.5" />
      <circle cx="12" cy="12" r="3.5" />
      <path d="M16.5 7.5v.01" />
    </svg>
  )
}

export function WhatsAppIcon({ className = 'size-5' }) {
  return (
    <svg {...base} className={className}>
      <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" />
      <path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1" />
    </svg>
  )
}

export function TelegramIcon({ className = 'size-5' }) {
  return (
    <svg {...base} className={className}>
      <path d="M15 10l-4 4 6 6 4-16-18 7 4 2 2 6 3-4" />
    </svg>
  )
}
