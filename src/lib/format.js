import { site } from '@/config/site'

const formatters = new Map()

/** "ETB 1,850". Whole Birr only; the shop never prices in santim. */
export function formatPrice(amount, currency = site.currency) {
  if (!formatters.has(currency)) {
    formatters.set(currency, new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 0 }))
  }
  return formatters.get(currency).format(amount)
}
