import { categories } from '@/data/categories'
import { products } from '@/data/products'
import { clone, delay, fail, ok } from '@/lib/mock'

/*
 * Product queries. Each returns `{ data, error }` like supabase-js, and each
 * product carries its category the way
 *   .select('*, category:categories(id, slug, name)')
 * would embed it.
 */

const withCategory = (p) => {
  const c = categories.find((cat) => cat.id === p.category_id)
  return { ...p, category: c ? { id: c.id, slug: c.slug, name: c.name } : null }
}

const SORTS = {
  newest: (a, b) => b.created_at.localeCompare(a.created_at),
  'price-asc': (a, b) => a.price - b.price,
  'price-desc': (a, b) => b.price - a.price,
}

/**
 * List products.
 * @param {object} [options]
 * @param {string} [options.category]  category slug, e.g. "bags"
 * @param {'newest'|'price-asc'|'price-desc'} [options.sort]
 * @param {string} [options.search]    matches name, description, leather, colours and category
 * @param {boolean} [options.featured] only featured products
 * @param {string} [options.excludeId] leave one product out (for "related")
 * @param {number} [options.limit]
 * @returns {Promise<{ data: object[], error: null, count: number }>}
 *   `count` is the total before `limit`, like `{ count: 'exact' }`.
 */
export async function getProducts({ category, sort = 'newest', search, featured, excludeId, limit } = {}) {
  await delay()
  let rows = products.map(withCategory)

  if (category) rows = rows.filter((p) => p.category?.slug === category)
  if (featured) rows = rows.filter((p) => p.featured)
  if (excludeId) rows = rows.filter((p) => p.id !== excludeId)

  const q = search?.trim().toLowerCase()
  if (q) {
    rows = rows.filter((p) =>
      [p.name, p.description, p.leather_type, p.category?.name, ...p.colors.map((c) => c.name)].some((field) =>
        field?.toLowerCase().includes(q),
      ),
    )
  }

  rows.sort(SORTS[sort] ?? SORTS.newest)
  const count = rows.length
  if (limit) rows = rows.slice(0, limit)
  return ok(clone(rows), { count })
}

/** One product by id. Supabase: .from('products').select(...).eq('id', id).single() */
export async function getProductById(id) {
  await delay()
  const row = products.find((p) => p.id === id)
  return row ? ok(clone(withCategory(row))) : fail(`No product with id "${id}"`, 'PGRST116')
}

/** One product by its URL slug. Supabase: .eq('slug', slug).single() */
export async function getProductBySlug(slug) {
  await delay()
  const row = products.find((p) => p.slug === slug)
  return row ? ok(clone(withCategory(row))) : fail(`No product with slug "${slug}"`, 'PGRST116')
}

/** Other products from the same category, newest first. */
export async function getRelatedProducts(product, limit = 4) {
  return getProducts({ category: product.category?.slug, excludeId: product.id, limit })
}
