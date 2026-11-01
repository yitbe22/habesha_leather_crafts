import { AnimatePresence, m } from 'framer-motion'
import { Search, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useLocation, useSearchParams } from 'react-router-dom'
import { LogoMark } from '@/components/Logo'
import { PageHeader } from '@/components/PageHeader'
import { ProductCard, ProductCardSkeleton } from '@/components/ProductCard'
import { Seo } from '@/components/Seo'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useCategories, useProducts } from '@/hooks/useCatalog'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'
import { EASE_LUX } from '@/lib/motion'

const SORTS = [
  { value: 'newest', label: 'Newest' },
  { value: 'price-asc', label: 'Lowest price' },
  { value: 'price-desc', label: 'Highest price' },
]
const ALL = 'all'
const GRID = 'grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-3 lg:grid-cols-4'

/**
 * The collection. Category, sort and search live in the URL
 * (?category=bags&sort=price-asc&q=quilted) so any view can be shared or bookmarked.
 */
export default function Shop() {
  const [params, setParams] = useSearchParams()
  const { state } = useLocation()
  const category = params.get('category') ?? ALL
  const sort = params.get('sort') ?? 'newest'
  const q = params.get('q') ?? ''

  // the input updates instantly; the URL (and the query) follow once typing pauses
  const [query, setQuery] = useState(q)
  const search = useDebouncedValue(query.trim(), 300)
  const searchRef = useRef(null)

  const update = (changes) =>
    setParams(
      (prev) => {
        const next = new URLSearchParams(prev)
        for (const [key, value] of Object.entries(changes)) {
          if (!value || (key === 'category' && value === ALL) || (key === 'sort' && value === 'newest')) next.delete(key)
          else next.set(key, value)
        }
        return next
      },
      { replace: true },
    )

  useEffect(() => {
    if (search !== q) update({ q: search })
    // only the debounced text should drive this
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search])

  // arriving from the header's search button
  useEffect(() => {
    if (state?.focusSearch) searchRef.current?.focus()
  }, [state])

  // on narrow screens the tab row scrolls; keep the active category in view
  const tabsRef = useRef(null)
  const { data: categories } = useCategories()
  useEffect(() => {
    tabsRef.current?.querySelector('[data-state=active]')?.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' })
  }, [category, categories])

  const {
    data: products,
    isPending,
    isFetching,
    isError,
    refetch,
  } = useProducts({ category: category === ALL ? undefined : category, sort, search: q || undefined })

  const current = categories?.find((c) => c.slug === category)
  const total = categories?.reduce((sum, c) => sum + c.product_count, 0)
  const filtered = category !== ALL || q

  const clearFilters = () => {
    setQuery('')
    update({ category: ALL, q: '' })
  }

  return (
    <>
      <Seo
        title={current ? `${current.name}` : 'Shop'}
        description={current?.description ?? 'Browse handcrafted Ethiopian leather bags, wallets, belts and accessories, made by hand in Addis Ababa.'}
        path={current ? `/shop?category=${current.slug}` : '/shop'}
      />
      <PageHeader
        eyebrow="The collection"
        title={current ? current.name : 'Shop handcrafted leather'}
        description={current?.description ?? 'Every piece is cut, stitched and finished by hand in our Addis Ababa workshop. Order online or straight from WhatsApp.'}
        className="pb-8"
      />

      <Tabs value={category} onValueChange={(value) => update({ category: value })}>
        {/* toolbar: sticks under the header while browsing */}
        <div className="sticky top-[var(--header-h)] z-30 border-y border-hairline bg-background/90 backdrop-blur-xl">
          <div className="container-lux flex flex-col gap-3 py-3 lg:flex-row lg:items-center lg:justify-between">
            <div ref={tabsRef} className="rail -mx-[var(--gutter)] overflow-x-auto px-[var(--gutter)] lg:mx-0 lg:px-0">
              <TabsList className="h-10 w-max gap-1 rounded-full bg-parchment p-1">
                <TabsTrigger value={ALL} className="rounded-full px-4 data-[state=active]:bg-espresso data-[state=active]:text-cream">
                  All {total != null && <span className="text-xs opacity-60 tabular-nums">{total}</span>}
                </TabsTrigger>
                {categories?.map((c) => (
                  <TabsTrigger key={c.id} value={c.slug} className="rounded-full px-4 data-[state=active]:bg-espresso data-[state=active]:text-cream">
                    {c.name} <span className="text-xs opacity-60 tabular-nums">{c.product_count}</span>
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            <div className="flex gap-2">
              <div className="relative flex-1 lg:w-72 lg:flex-none">
                <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" strokeWidth={1.6} />
                <Input
                  ref={searchRef}
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search"
                  aria-label="Search products"
                  className="h-10 rounded-full bg-card pr-9 pl-10 [&::-webkit-search-cancel-button]:hidden"
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => setQuery('')}
                    className="absolute top-1/2 right-2 grid size-7 -translate-y-1/2 place-items-center rounded-full text-muted-foreground hover:bg-foreground/5"
                    aria-label="Clear search"
                  >
                    <X className="size-3.5" />
                  </button>
                )}
              </div>
              <Select value={sort} onValueChange={(value) => update({ sort: value })}>
                <SelectTrigger className="!h-10 w-auto shrink-0 rounded-full bg-card lg:w-[11.5rem]" aria-label="Sort products">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent align="end">
                  {SORTS.map((s) => (
                    <SelectItem key={s.value} value={s.value}>
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          {/* a thin thread runs along the toolbar while new results load */}
          <AnimatePresence>
            {isFetching && !isPending && (
              <m.span
                className="absolute inset-x-0 -bottom-px h-0.5 origin-left bg-gold"
                initial={{ scaleX: 0, opacity: 1 }}
                animate={{ scaleX: 0.85, transition: { duration: 1.2, ease: EASE_LUX } }}
                exit={{ scaleX: 1, opacity: 0, transition: { duration: 0.3 } }}
              />
            )}
          </AnimatePresence>
        </div>

        <TabsContent value={category} className="container-lux pt-8 pb-[var(--section-y)]">
          <p className="mb-8 text-sm text-muted-foreground" aria-live="polite">
            {isPending ? 'Loading the collection…' : `${products?.length ?? 0} ${products?.length === 1 ? 'piece' : 'pieces'}${q ? ` matching “${q}”` : ''}`}
          </p>

          {isError ? (
            <div className="flex flex-col items-center gap-4 rounded-xl bg-parchment p-12 text-center">
              <p className="text-muted-foreground">The collection could not be loaded.</p>
              <Button variant="outline" className="rounded-full" onClick={() => refetch()}>
                Try again
              </Button>
            </div>
          ) : isPending ? (
            <div className={GRID} aria-hidden="true">
              {Array.from({ length: 8 }, (_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : products.length === 0 ? (
            <m.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center gap-4 py-20 text-center">
              <LogoMark size={44} className="text-gold" />
              <h2 className="text-subtitle">Nothing matches {q ? `“${q}”` : 'this filter'}</h2>
              <p className="max-w-[40ch] text-muted-foreground">
                Try another word or category. Looking for something special? We also make pieces to order.
              </p>
              {filtered && (
                <Button className="mt-2 rounded-full px-6" onClick={clearFilters}>
                  Clear filters
                </Button>
              )}
            </m.div>
          ) : (
            // cards glide to their new places when sorting or filtering
            <m.div layout className={GRID} style={{ opacity: isFetching ? 0.6 : 1, transition: 'opacity 300ms' }}>
              <AnimatePresence mode="popLayout" initial={false}>
                {products.map((p, i) => (
                  <m.div
                    key={p.id}
                    layout="position"
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.2 } }}
                    transition={{ duration: 0.5, ease: EASE_LUX }}
                  >
                    {/* the grid sits right under the page h1, so cards are h2 here */}
                    <ProductCard product={p} index={i} priority={i < 4} headingLevel="h2" />
                  </m.div>
                ))}
              </AnimatePresence>
            </m.div>
          )}
        </TabsContent>
      </Tabs>
    </>
  )
}
