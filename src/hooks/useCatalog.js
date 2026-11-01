import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getCategories } from '@/services/categoryService'
import { getTestimonials, sendContactMessage } from '@/services/contentService'
import { createOrder } from '@/services/orderService'
import { getProductBySlug, getProducts, getRelatedProducts } from '@/services/productService'

/*
 * The only place components get data from. Each hook calls a service and
 * unwraps its `{ data, error }`, throwing the error so TanStack Query reports
 * it. Swapping the services for Supabase needs no change here or in the UI.
 */

const unwrap = async (request) => {
  const { data, error } = await request
  if (error) throw Object.assign(new Error(error.message), { code: error.code })
  return data
}

export const queryKeys = {
  products: (filters) => ['products', filters],
  product: (slug) => ['product', slug],
  related: (id) => ['products', 'related', id],
  categories: ['categories'],
  testimonials: ['testimonials'],
}

/** Product list. Keeps the previous results on screen while filters change. */
export function useProducts(filters = {}) {
  return useQuery({
    queryKey: queryKeys.products(filters),
    queryFn: () => unwrap(getProducts(filters)),
    placeholderData: keepPreviousData,
  })
}

/**
 * One product. If any product list already in the cache contains it, that row
 * is shown straight away, so opening a card renders the page with no wait.
 */
export function useProduct(slug) {
  const queryClient = useQueryClient()
  return useQuery({
    queryKey: queryKeys.product(slug),
    queryFn: () => unwrap(getProductBySlug(slug)),
    enabled: Boolean(slug),
    initialData: () => {
      for (const [, list] of queryClient.getQueriesData({ queryKey: ['products'] })) {
        const hit = Array.isArray(list) && list.find((p) => p.slug === slug)
        if (hit) return hit
      }
      return undefined
    },
  })
}

export function useRelatedProducts(product, limit = 4) {
  return useQuery({
    queryKey: queryKeys.related(product?.id),
    queryFn: () => unwrap(getRelatedProducts(product, limit)),
    enabled: Boolean(product),
  })
}

export function useCategories() {
  return useQuery({
    queryKey: queryKeys.categories,
    queryFn: () => unwrap(getCategories()),
  })
}

export function useTestimonials() {
  return useQuery({
    queryKey: queryKeys.testimonials,
    queryFn: () => unwrap(getTestimonials()),
  })
}

export function useCreateOrder() {
  return useMutation({ mutationFn: (payload) => unwrap(createOrder(payload)) })
}

export function useSendContactMessage() {
  return useMutation({ mutationFn: (payload) => unwrap(sendContactMessage(payload)) })
}
