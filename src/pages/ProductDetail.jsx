import { AnimatePresence, m } from 'framer-motion'
import { ChevronRight, ShoppingBag } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { TelegramIcon, WhatsAppIcon } from '@/components/BrandIcons'
import { StitchLine } from '@/components/Ornaments'
import { ColorPicker } from '@/components/product/ColorPicker'
import { ProductGallery } from '@/components/product/ProductGallery'
import { RelatedProducts } from '@/components/product/RelatedProducts'
import { QuantityStepper } from '@/components/QuantityStepper'
import { Seo } from '@/components/Seo'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { site } from '@/config/site'
import { useCart } from '@/context/CartContext'
import { useProduct } from '@/hooks/useCatalog'
import { flyToCart } from '@/lib/flyToCart'
import { formatPrice } from '@/lib/format'
import { EASE_EXPO, EASE_LUX } from '@/lib/motion'
import { productMessage, telegramLink, whatsappLink } from '@/lib/whatsapp'
import NotFound from '@/pages/NotFound'

// arrival choreography (after Mercy's product page): the title slides out of
// word masks while the details rise in turn, timed against the photo's flight
const titleWord = {
  hidden: { x: '105%' },
  show: (i) => ({ x: 0, transition: { duration: 0.9, ease: EASE_EXPO, delay: 0.35 + i * 0.07 } }),
}
const rise = {
  hidden: { opacity: 0, y: 18 },
  show: (i) => ({ opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE_LUX, delay: 0.5 + i * 0.06 } }),
}

const CARE = [
  'Wipe with a soft, dry cloth. Let rain dry naturally, away from direct heat.',
  'Feed the leather with a neutral conditioner every few months.',
  'Store stuffed with paper, in the dust bag, out of direct sunlight.',
  'Natural marks and colour changes over time are part of the character of real leather.',
]

/** Fires `onChange(true)` once `ref` has scrolled up past the top of the screen. */
function useScrolledPast(ref, onChange) {
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([entry]) => onChange(!entry.isIntersecting && entry.boundingClientRect.top < 0))
    io.observe(el)
    return () => io.disconnect()
  }, [ref, onChange])
}

function ProductView({ product }) {
  const { addItem, setOpen } = useCart()
  const frameRef = useRef(null)
  const buyRef = useRef(null)
  const [color, setColor] = useState(product.colors[0]?.name)
  const [index, setIndex] = useState(product.colors[0]?.image_index ?? 0)
  const [quantity, setQuantity] = useState(1)
  const [adding, setAdding] = useState(false)
  const [showBar, setShowBar] = useState(false)
  useScrolledPast(buyRef, setShowBar)

  const message = productMessage(product, color)
  const words = product.name.split(' ')

  const chooseColor = (name) => {
    setColor(name)
    const shade = product.colors.find((c) => c.name === name)
    if (shade) setIndex(shade.image_index)
  }

  const add = () => {
    setAdding(true)
    flyToCart(frameRef.current).then(() => {
      addItem(product, { color, quantity })
      setAdding(false)
      toast.success(`${quantity} × ${product.name} added to your bag`, {
        description: color && product.colors.length > 1 ? color : undefined,
        action: { label: 'View bag', onClick: () => setOpen(true) },
      })
    })
  }

  // Telegram can't pre-fill a message, so copy it for the customer to paste
  const copyForTelegram = () => {
    navigator.clipboard
      ?.writeText(message)
      .then(() => toast('Order message copied', { description: 'Paste it into the Telegram chat that just opened.' }))
      .catch(() => {})
  }

  const details = [
    ['Leather', product.leather_type],
    ['Dimensions', product.dimensions],
    ['Colours', product.colors.map((c) => c.name).join(', ')],
    ['Made in', 'Addis Ababa, Ethiopia, by hand'],
  ]

  return (
    <>
      <Seo title={product.name} description={product.description.slice(0, 155)} path={`/product/${product.slug}`} />
      <script type="application/ld+json">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: product.name,
          description: product.description,
          image: product.images.map((src) => `${site.url}${src}`),
          brand: { '@type': 'Brand', name: site.name },
          material: product.leather_type,
          offers: {
            '@type': 'Offer',
            price: product.price,
            priceCurrency: product.currency,
            availability: product.in_stock ? 'https://schema.org/InStock' : 'https://schema.org/PreOrder',
          },
        })}
      </script>

      <article className="container-lux pt-[calc(var(--header-h)+1.25rem)] pb-[var(--section-y)]">
        <nav aria-label="Breadcrumb" className="mb-6 text-sm text-muted-foreground">
          <ol className="flex flex-wrap items-center gap-1.5">
            <li>
              <Link to="/shop" className="link-draw hover:text-foreground">
                Shop
              </Link>
            </li>
            {product.category && (
              <li className="flex items-center gap-1.5">
                <ChevronRight className="size-3.5" aria-hidden="true" />
                <Link to={`/shop?category=${product.category.slug}`} className="link-draw hover:text-foreground">
                  {product.category.name}
                </Link>
              </li>
            )}
            <li className="flex items-center gap-1.5">
              <ChevronRight className="size-3.5" aria-hidden="true" />
              <span aria-current="page" className="text-foreground">
                {product.name}
              </span>
            </li>
          </ol>
        </nav>

        <div className="grid gap-10 lg:grid-cols-[1.12fr_1fr] lg:gap-16">
          <ProductGallery product={product} index={index} onIndexChange={setIndex} frameRef={frameRef} />

          <m.div initial="hidden" animate="show" className="flex flex-col lg:sticky lg:top-[calc(var(--header-h)+1.5rem)] lg:self-start">
            <m.p variants={rise} custom={0} className="eyebrow">
              {product.category?.name}
            </m.p>
            <h1 className="text-title mt-3">
              {words.map((w, i) => (
                <span key={i}>
                  <span className="word-mask">
                    <m.span className="inline-block" variants={titleWord} custom={i}>
                      {w}
                    </m.span>
                  </span>{' '}
                </span>
              ))}
            </h1>

            <m.div variants={rise} custom={1} className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
              <span className="font-serif text-3xl text-cognac tabular-nums">{formatPrice(product.price, product.currency)}</span>
              <span className="inline-flex items-center gap-2 rounded-full bg-parchment px-3 py-1 text-xs">
                <span className={product.in_stock ? 'size-1.5 rounded-full bg-emerald-700' : 'size-1.5 rounded-full bg-terracotta'} aria-hidden="true" />
                {product.in_stock ? 'In stock, ready to order' : 'Made to order'}
              </span>
            </m.div>

            <m.p variants={rise} custom={2} className="mt-6 max-w-[56ch] leading-relaxed text-muted-foreground">
              {product.description}
            </m.p>

            <m.div variants={rise} custom={3} className="mt-7">
              <StitchLine className="text-gold/50" />
            </m.div>

            {product.colors.length > 1 && (
              <m.div variants={rise} custom={4} className="mt-7">
                <ColorPicker colors={product.colors} value={color} onChange={chooseColor} />
              </m.div>
            )}

            <m.div variants={rise} custom={5} ref={buyRef} className="mt-7 flex gap-3">
              {product.in_stock ? (
                <>
                  <QuantityStepper value={quantity} onChange={setQuantity} size="lg" />
                  <Button size="lg" className="h-[3.25rem] flex-1 rounded-full text-[0.95rem]" onClick={add} disabled={adding}>
                    <ShoppingBag strokeWidth={1.6} />
                    {adding ? 'Adding…' : `Add to bag · ${formatPrice(product.price * quantity, product.currency)}`}
                  </Button>
                </>
              ) : (
                <p className="rounded-xl bg-parchment p-4 text-sm text-muted-foreground">
                  This piece is made to order. Message us on WhatsApp or Telegram and we will confirm the details and timing.
                </p>
              )}
            </m.div>

            <m.div variants={rise} custom={6} className="mt-3 grid gap-3 sm:grid-cols-2">
              <Button asChild size="lg" variant={product.in_stock ? 'outline' : 'default'} className="h-12 rounded-full">
                <a href={whatsappLink(message)} target="_blank" rel="noopener noreferrer">
                  <WhatsAppIcon className="size-[1.1rem]" />
                  Order via WhatsApp
                </a>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-12 rounded-full">
                <a href={telegramLink()} target="_blank" rel="noopener noreferrer" onClick={copyForTelegram}>
                  <TelegramIcon className="size-[1.1rem]" />
                  Order via Telegram
                </a>
              </Button>
            </m.div>

            <m.div variants={rise} custom={7} className="mt-9">
              <Tabs defaultValue="details">
                <TabsList className="w-full justify-start gap-6 group-data-[orientation=horizontal]/tabs:h-auto rounded-none border-b border-hairline bg-transparent p-0">
                  {['details', 'care', 'delivery'].map((tab) => (
                    <TabsTrigger
                      key={tab}
                      value={tab}
                      className="min-h-11 flex-none rounded-none border-0 border-b-2 border-transparent px-0 pb-3 capitalize shadow-none data-[state=active]:border-cognac data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                    >
                      {tab}
                    </TabsTrigger>
                  ))}
                </TabsList>
                <TabsContent value="details" className="pt-5">
                  <dl className="divide-y divide-hairline text-sm">
                    {details.map(([label, value]) => (
                      <div key={label} className="grid grid-cols-[7.5rem_1fr] gap-4 py-3">
                        <dt className="text-muted-foreground">{label}</dt>
                        <dd>{value}</dd>
                      </div>
                    ))}
                  </dl>
                </TabsContent>
                <TabsContent value="care" className="pt-5">
                  <ul className="flex list-disc flex-col gap-2 pl-5 text-sm text-muted-foreground marker:text-gold">
                    {CARE.map((tip) => (
                      <li key={tip}>{tip}</li>
                    ))}
                  </ul>
                </TabsContent>
                <TabsContent value="delivery" className="pt-5 text-sm leading-relaxed text-muted-foreground">
                  <p>
                    Orders are confirmed with you on WhatsApp or Telegram. We arrange delivery within Addis Ababa directly, and can send
                    pieces to other cities in Ethiopia or abroad on request.
                  </p>
                  <p className="mt-3">Belts and made-to-order pieces are cut to your measurements, so allow a few extra days.</p>
                </TabsContent>
              </Tabs>
            </m.div>
          </m.div>
        </div>
      </article>

      <RelatedProducts product={product} />

      {/* phones: once the main button scrolls away, a slim bar keeps it in reach */}
      <AnimatePresence>
        {showBar && product.in_stock && (
          <m.div
            initial={{ y: '110%' }}
            animate={{ y: 0 }}
            exit={{ y: '110%' }}
            transition={{ duration: 0.45, ease: EASE_LUX }}
            className="fixed inset-x-0 bottom-0 z-30 border-t border-hairline bg-background/95 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-xl lg:hidden"
          >
            <div className="flex items-center gap-3">
              <div className="min-w-0 flex-1">
                <p className="truncate font-serif text-lg leading-tight">{product.name}</p>
                <p className="text-sm text-cognac tabular-nums">{formatPrice(product.price, product.currency)}</p>
              </div>
              <Button className="h-11 rounded-full px-5" onClick={add} disabled={adding}>
                <ShoppingBag strokeWidth={1.6} />
                Add to bag
              </Button>
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </>
  )
}

function ProductSkeleton() {
  return (
    <div className="container-lux grid gap-10 pt-[calc(var(--header-h)+3.5rem)] pb-[var(--section-y)] lg:grid-cols-[1.12fr_1fr] lg:gap-16" aria-busy="true" aria-label="Loading product">
      <Skeleton className="aspect-[4/5] rounded-2xl bg-sand/60" />
      <div className="flex flex-col gap-4">
        <Skeleton className="h-3 w-20 bg-sand/60" />
        <Skeleton className="h-12 w-4/5 bg-sand/60" />
        <Skeleton className="h-8 w-32 bg-sand/60" />
        <Skeleton className="mt-4 h-24 w-full bg-sand/60" />
        <Skeleton className="mt-4 h-12 w-full rounded-full bg-sand/60" />
      </div>
    </div>
  )
}

export default function ProductDetail() {
  const { slug } = useParams()
  const { data: product, isPending, isError, error, refetch } = useProduct(slug)

  if (isPending) return <ProductSkeleton />
  if (isError && error.code === 'PGRST116') return <NotFound />
  if (isError) {
    return (
      <div className="container-lux page-top flex flex-col items-center gap-4 pb-24 text-center">
        <p className="text-muted-foreground">This piece could not be loaded.</p>
        <Button variant="outline" className="rounded-full" onClick={() => refetch()}>
          Try again
        </Button>
      </div>
    )
  }
  // keyed so colour, photo and quantity reset when moving between products
  return <ProductView key={product.id} product={product} />
}
