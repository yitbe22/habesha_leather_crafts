import { site } from '@/config/site'
import { products } from '@/data/products'
import { delay, fail, ok } from '@/lib/mock'

const STORAGE_KEY = 'hlc.orders.v1'

function saveOrder(order) {
  try {
    const orders = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]')
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...orders, order]))
  } catch {
    /* storage unavailable: the order still goes out over WhatsApp */
  }
}

/**
 * Records an order before the customer is handed to WhatsApp.
 * Prices are looked up again here rather than trusted from the cart, which is
 * what a database function or RLS-protected insert would do too.
 *
 * Supabase equivalent: an insert into `orders` plus `order_items`, or one RPC.
 *
 * @param {object} payload
 * @param {{ product_id: string, color?: string, quantity: number }[]} payload.items
 * @param {'whatsapp'|'telegram'} [payload.channel]
 * @param {{ name?: string, area?: string, note?: string }} [payload.customer]
 */
export async function createOrder({ items, channel = 'whatsapp', customer = {} }) {
  await delay(450)
  if (!items?.length) return fail('The order has no items', 'EMPTY_ORDER')

  const lines = []
  for (const item of items) {
    const product = products.find((p) => p.id === item.product_id)
    if (!product) return fail(`Unknown product "${item.product_id}"`, 'UNKNOWN_PRODUCT')
    const quantity = Math.max(1, Math.floor(item.quantity))
    lines.push({
      product_id: product.id,
      name: product.name,
      color: item.color ?? null,
      quantity,
      unit_price: product.price,
      line_total: product.price * quantity,
    })
  }

  const created_at = new Date().toISOString()
  const order = {
    id: crypto.randomUUID(),
    // short, human-friendly reference to quote in the WhatsApp chat
    order_number: `HLC-${Date.now().toString(36).slice(-5).toUpperCase()}`,
    status: 'pending',
    channel,
    customer,
    items: lines,
    subtotal: lines.reduce((sum, l) => sum + l.line_total, 0),
    currency: site.currency,
    created_at,
  }
  saveOrder(order)
  return ok(order)
}
