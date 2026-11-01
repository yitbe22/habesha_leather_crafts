import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { RevealImage } from '@/components/Reveal'
import { SectionHeading } from '@/components/SectionHeading'
import { SmartImage } from '@/components/SmartImage'
import { Skeleton } from '@/components/ui/skeleton'
import { useCategories } from '@/hooks/useCatalog'
import { cn } from '@/lib/utils'

// bento placement by position: the first category is the large tile
const LAYOUT = [
  'col-span-2 aspect-[5/4] lg:col-span-2 lg:row-span-2 lg:aspect-auto',
  'aspect-[4/5] lg:col-span-2 lg:aspect-auto',
  'aspect-[4/5] lg:aspect-auto',
  'col-span-2 aspect-[2/1] lg:col-span-1 lg:aspect-auto',
]
const GRID = 'mt-12 grid grid-cols-2 gap-3 sm:gap-4 lg:h-[min(78vh,700px)] lg:grid-cols-4 lg:grid-rows-2'

/** Bento grid of categories; each tile opens the shop filtered to it. */
export function CategoryGrid() {
  const { data: categories, isPending } = useCategories()

  return (
    <section className="bg-parchment" aria-labelledby="categories-heading">
      <div className="container-lux section-y">
        <SectionHeading
          id="categories-heading"
          eyebrow="Shop by category"
          title="Something for every day"
          description="From a weekender built for the road to the card holder you reach for every morning."
        />

        {isPending ? (
          <div className={GRID} aria-hidden="true">
            {LAYOUT.map((cls) => (
              <Skeleton key={cls} className={cn('rounded-2xl bg-sand/70', cls)} />
            ))}
          </div>
        ) : (
          <ul className={GRID}>
            {categories.map((cat, i) => (
              <li key={cat.id} className={cn('relative', LAYOUT[i] ?? 'aspect-square')}>
                <Link to={`/shop?category=${cat.slug}`} className="group absolute inset-0 block overflow-hidden rounded-2xl">
                  <RevealImage delay={i * 0.12} radius="1rem" className="h-full w-full">
                    <SmartImage
                      src={cat.image}
                      sizes={i === 0 ? '(min-width: 1024px) 50vw, 100vw' : '(min-width: 1024px) 25vw, 50vw'}
                      className="h-full w-full"
                      imgClassName="transition-[opacity,transform] duration-[1200ms] group-hover:scale-105"
                    />
                  </RevealImage>
                  <div className="absolute inset-0 bg-gradient-to-t from-espresso/80 via-espresso/15 to-transparent transition-opacity duration-500 group-hover:opacity-90" />
                  <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5 text-cream sm:p-6">
                    <div>
                      <h3 className="font-serif text-[clamp(1.6rem,2.6vw,2.4rem)] leading-none">{cat.name}</h3>
                      <p className="mt-2 text-sm text-cream/75">
                        {cat.product_count} {cat.product_count === 1 ? 'piece' : 'pieces'}
                      </p>
                      {i === 0 && <p className="mt-3 hidden max-w-sm text-sm text-cream/80 lg:block">{cat.description}</p>}
                    </div>
                    <span className="grid size-11 shrink-0 place-items-center rounded-full border border-cream/40 transition duration-500 group-hover:rotate-45 group-hover:border-cream group-hover:bg-cream group-hover:text-espresso">
                      <ArrowUpRight className="size-4" strokeWidth={1.6} />
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}
