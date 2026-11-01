import { categories } from '@/data/categories'
import { products } from '@/data/products'
import { clone, delay, ok } from '@/lib/mock'

/**
 * All categories in display order, each with a `product_count`.
 * Supabase equivalent:
 *   supabase.from('categories').select('*, product_count:products(count)').order('sort_order')
 */
export async function getCategories() {
  await delay()
  const rows = [...categories]
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((c) => ({ ...c, product_count: products.filter((p) => p.category_id === c.id).length }))
  return ok(clone(rows))
}
