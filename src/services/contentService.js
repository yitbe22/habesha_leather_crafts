import { testimonials } from '@/data/testimonials'
import { clone, delay, fail, ok } from '@/lib/mock'

/** Customer quotes for the home page. Supabase: supabase.from('testimonials').select('*') */
export async function getTestimonials() {
  await delay()
  return ok(clone(testimonials))
}

/**
 * Contact form submission. Demo only: nothing is sent anywhere yet.
 * Supabase: supabase.from('contact_messages').insert(payload).select().single()
 * (or an Edge Function that also emails the shop).
 */
export async function sendContactMessage({ name, contact, topic, message }) {
  await delay(800)
  if (!name?.trim() || !contact?.trim() || !message?.trim()) return fail('Please fill in the required fields', 'VALIDATION')
  return ok({ id: crypto.randomUUID(), name, contact, topic, message, created_at: new Date().toISOString() })
}
