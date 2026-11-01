import { ProductCard, ProductCardSkeleton } from '@/components/ProductCard'
import { SectionHeading } from '@/components/SectionHeading'
import { useRelatedProducts } from '@/hooks/useCatalog'

/** Up to four more pieces from the same category. Hidden when there are none. */
export function RelatedProducts({ product }) {
  const { data: products, isPending } = useRelatedProducts(product, 4)
  if (!isPending && !products?.length) return null

  return (
    <section className="container-lux section-y border-t border-hairline" aria-labelledby="related-heading">
      <SectionHeading id="related-heading" eyebrow={`More ${product.category?.name.toLowerCase() ?? 'pieces'}`} title="You may also like" />
      <div className="mt-12 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-4">
        {isPending
          ? Array.from({ length: 4 }, (_, i) => <ProductCardSkeleton key={i} />)
          : products.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
      </div>
    </section>
  )
}
