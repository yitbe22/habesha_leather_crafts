import { site } from '@/config/site'
import { formatPrice } from '@/lib/format'

/** WhatsApp chat link with an optional pre-filled message. */
export function whatsappLink(message = '') {
  const text = message ? `?text=${encodeURIComponent(message)}` : ''
  return `https://wa.me/${site.contact.whatsapp}${text}`
}

/** Telegram chat link. Telegram can't pre-fill a message to a user, so this just opens the chat. */
export function telegramLink() {
  return `https://t.me/${site.social.telegram}`
}

/** Message for asking about, or ordering, a single product. */
export function productMessage(product, color) {
  const shade = color ? ` in ${color}` : ''
  return `Hello ${site.name}, I'd like to order the ${product.name}${shade} (${formatPrice(product.price)}).\n${site.url}/product/${product.slug}`
}

/**
 * The checkout message: one line per item, the subtotal, the order reference
 * so the shop can match the chat to the recorded order, and any delivery
 * details the customer chose to add.
 */
export function orderMessage(order) {
  const lines = order.items.map((item) => {
    const shade = item.color ? ` (${item.color})` : ''
    return `• ${item.quantity} × ${item.name}${shade}: ${formatPrice(item.line_total, order.currency)}`
  })
  const { name, area, note } = order.customer ?? {}
  const details = [name && `Name: ${name}`, area && `Deliver to: ${area}`, note && `Note: ${note}`].filter(Boolean)
  return [
    `Hello ${site.name}, I'd like to place an order.`,
    `Order ${order.order_number}`,
    '',
    ...lines,
    '',
    `Subtotal: ${formatPrice(order.subtotal, order.currency)}`,
    ...(details.length ? ['', ...details] : []),
    '',
    'Please let me know the delivery options. Thank you!',
  ].join('\n')
}
