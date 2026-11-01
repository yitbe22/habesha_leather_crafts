import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { ProductCard, ProductCardSkeleton } from '@/components/ProductCard'
import { SectionHeading } from '@/components/SectionHeading'
import { Button } from '@/components/ui/button'
import { useProducts } from '@/hooks/useCatalog'

/** The featured pieces, with skeletons while they load and a retry if they fail. */
export function FeaturedProducts() {
  const { data: products, isPending, isError, refetch } = useProducts({ featured: true, limit: 8 })

  return (
    <section className="container-lux section-y" aria-labelledby="featured-heading">
      <SectionHeading id="featured-heading" eyebrow="Featured pieces" title="Favourites from the workshop">
        <Link to="/shop" className="group inline-flex items-center gap-3 text-[0.95rem]">
          <span className="link-draw">Shop the collection</span>
          <span className="grid size-9 place-items-center rounded-full border border-foreground/25 transition group-hover:translate-x-1 group-hover:border-foreground">
            <ArrowRight className="size-3.5" strokeWidth={1.6} />
          </span>
        </Link>
      </SectionHeading>

      {isError ? (
        <div className="mt-12 flex flex-col items-center gap-4 rounded-xl bg-parchment p-10 text-center">
          <p className="text-muted-foreground">The featured pieces could not be loaded.</p>
          <Button variant="outline" className="rounded-full" onClick={() => refetch()}>
            Try again
          </Button>
        </div>
      ) : (
        <div className="mt-12 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-3 lg:grid-cols-4" aria-busy={isPending}>
          {isPending
            ? Array.from({ length: 8 }, (_, i) => <ProductCardSkeleton key={i} />)
            : products.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
        </div>
      )}
    </section>
  )
}
