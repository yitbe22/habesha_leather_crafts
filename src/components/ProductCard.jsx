import { Plus, ShoppingBag } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import { WhatsAppIcon } from '@/components/BrandIcons'
import { ColorDots } from '@/components/ColorDots'
import { SmartImage } from '@/components/SmartImage'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { useCart } from '@/context/CartContext'
import { flyToCart } from '@/lib/flyToCart'
import { formatPrice } from '@/lib/format'
import { productMessage, whatsappLink } from '@/lib/whatsapp'

const NEW_FOR_DAYS = 30
const isNew = (createdAt) => Date.now() - new Date(createdAt).getTime() < NEW_FOR_DAYS * 864e5

/**
 * Product card (hover motion ported from Mercy, see .lux-* in index.css).
 * With a mouse, the photo eases in, the second view fades over it and a
 * frosted action bar rises. On touch screens a round add button stays visible.
 */
export function ProductCard({ product, index = 0, sizes = '(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw', priority, headingLevel: Heading = 'h3' }) {
  const { addItem, setOpen } = useCart()
  // the second view is only fetched once someone actually hovers the card
  const [hovered, setHovered] = useState(false)
  const second = hovered ? product.images[1] : undefined
  const href = `/product/${product.slug}`

  // the photo flies into the bag first; the item lands (and the badge bumps) when it arrives
  const quickAdd = (e) => {
    flyToCart(e.currentTarget.closest('article')?.querySelector('.lux-media')).then(() => {
      addItem(product)
      toast.success(`${product.name} added to your bag`, {
        action: { label: 'View bag', onClick: () => setOpen(true) },
      })
    })
  }

  return (
    <article
      data-reveal=""
      style={{ '--d': `${(index % 4) * 90}ms` }}
      data-flip-scope=""
      className="lux-card group relative flex flex-col"
      onPointerEnter={(e) => e.pointerType === 'mouse' && setHovered(true)}
    >
      <div className="relative overflow-hidden rounded-xl bg-muted">
        {/* the name link below is the accessible one; this photo link is a mouse/touch shortcut */}
        <Link to={href} className="lux-media relative block aspect-[4/5]" tabIndex={-1} aria-hidden="true">
          <SmartImage src={product.images[0]} sizes={sizes} priority={priority} className="h-full w-full" />
          {second && (
            <div className="absolute inset-0 opacity-0 transition-opacity duration-500 ease-[var(--ease-lux)] group-hover:opacity-100">
              <SmartImage src={second} sizes={sizes} className="h-full w-full" />
            </div>
          )}
        </Link>

        <div className="pointer-events-none absolute top-3 left-3 flex gap-1.5">
          {!product.in_stock && <Badge className="bg-espresso text-cream">Made to order</Badge>}
          {product.in_stock && isNew(product.created_at) && <Badge className="bg-terracotta text-cream">New</Badge>}
        </div>

        {/* pointer devices: frosted action bar */}
        <div className="lux-actions absolute inset-x-3 bottom-3 flex h-11 overflow-hidden rounded-full bg-cream/85 text-[0.85rem] text-espresso shadow-[0_6px_20px_-10px_rgba(0,0,0,0.45)] backdrop-blur-md">
          {product.in_stock && (
            <button type="button" onClick={quickAdd} className="flex flex-1 items-center justify-center gap-2 transition-colors hover:bg-cream">
              <ShoppingBag className="size-3.5" strokeWidth={1.6} />
              Quick add
              <span className="sr-only">: {product.name}</span>
            </button>
          )}
          <a
            href={whatsappLink(productMessage(product))}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-1 items-center justify-center gap-2 border-l border-espresso/10 transition-colors first:border-l-0 hover:bg-cream"
          >
            <WhatsAppIcon className="size-3.5" />
            {product.in_stock ? 'Order' : 'Ask on WhatsApp'}
            <span className="sr-only">: {product.name} (opens WhatsApp)</span>
          </a>
        </div>

        {/* touch devices: a single add button */}
        {product.in_stock && (
          <button
            type="button"
            onClick={quickAdd}
            aria-label={`Add ${product.name} to bag`}
            className="absolute right-2.5 bottom-2.5 grid size-10 place-items-center rounded-full bg-cream/90 text-espresso shadow-md backdrop-blur [@media(hover:hover)]:hidden"
          >
            <Plus className="size-4" strokeWidth={1.8} />
          </button>
        )}
      </div>

      <div className="flex items-start justify-between gap-3 pt-4">
        <div className="flex min-w-0 flex-col gap-1">
          <p className="text-[0.7rem] font-medium tracking-[0.18em] text-muted-foreground uppercase">{product.category?.name}</p>
          <Heading className="font-serif text-[1.2rem] leading-snug">
            <Link to={href} className="link-draw">
              {product.name}
            </Link>
          </Heading>
          <p className="text-sm text-cognac tabular-nums">{formatPrice(product.price, product.currency)}</p>
        </div>
        <ColorDots colors={product.colors} className="mt-6 shrink-0" />
      </div>
    </article>
  )
}

export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col gap-3" aria-hidden="true">
      <Skeleton className="aspect-[4/5] rounded-xl bg-sand/60" />
      <Skeleton className="h-3 w-1/4 bg-sand/60" />
      <Skeleton className="h-5 w-3/4 bg-sand/60" />
      <Skeleton className="h-4 w-1/3 bg-sand/60" />
    </div>
  )
}
