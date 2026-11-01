import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/** Merges Tailwind class names, letting later classes win over earlier ones. */
export function cn(...inputs) {
  return twMerge(clsx(inputs))
}
