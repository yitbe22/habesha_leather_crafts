import { AnimatePresence, m } from 'framer-motion'
import { ChevronDown, Trash2, Undo2 } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import { WhatsAppIcon } from '@/components/BrandIcons'
import { LogoMark } from '@/components/Logo'
import { StitchLine } from '@/components/Ornaments'
import { QuantityStepper } from '@/components/QuantityStepper'
import { SewnCheck } from '@/components/SewnCheck'
import { SmartImage } from '@/components/SmartImage'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Textarea } from '@/components/ui/textarea'
import { useCart } from '@/context/CartContext'
import { useCreateOrder } from '@/hooks/useCatalog'
import { useStoredState } from '@/hooks/useStoredState'
import { formatPrice } from '@/lib/format'
import { EASE_LUX } from '@/lib/motion'
import { orderMessage, whatsappLink } from '@/lib/whatsapp'

const UNDO_MS = 6000
const NO_DETAILS = { name: '', area: '', note: '' }

function CartLine({ item, onRemove, onNavigate }) {
  const { updateQuantity, maxQuantity } = useCart()
  return (
    <m.li
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: 40, transition: { duration: 0.25 } }}
      transition={{ duration: 0.45, ease: EASE_LUX }}
      className="flex gap-4 py-5"
    >
      <Link to={`/product/${item.slug}`} onClick={onNavigate} className="shrink-0" tabIndex={-1} aria-hidden="true">
        <SmartImage src={item.image} sizes="96px" className="h-28 w-[5.5rem] rounded-lg" />
      </Link>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <Link to={`/product/${item.slug}`} onClick={onNavigate} className="link-draw font-serif text-lg leading-tight">
              {item.name}
            </Link>
            {item.color && <p className="mt-0.5 text-sm text-muted-foreground">{item.color}</p>}
          </div>
          <button
            type="button"
            onClick={() => onRemove(item)}
            className="-mt-1 -mr-1 grid size-8 shrink-0 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
            aria-label={`Remove ${item.name} from bag`}
          >
            <Trash2 className="size-4" strokeWidth={1.5} />
          </button>
        </div>
        <div className="mt-auto flex items-center justify-between pt-3">
          <QuantityStepper
            value={item.quantity}
            onChange={(quantity) => updateQuantity(item.key, quantity)}
            max={maxQuantity}
            label={`Quantity of ${item.name}`}
          />
          <span className="text-sm font-medium tabular-nums">{formatPrice(item.price * item.quantity, item.currency)}</span>
        </div>
      </div>
    </m.li>
  )
}

/** Optional details that ride along in the WhatsApp message. Remembered for next time. */
function DeliveryDetails({ details, onChange }) {
  const [open, setOpen] = useState(Boolean(details.name || details.area || details.note))
  const field = (key) => ({ id: `delivery-${key}`, value: details[key], onChange: (e) => onChange({ ...details, [key]: e.target.value }) })

  return (
    <div className="mb-4">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="delivery-details"
        className="flex w-full items-center justify-between py-1 text-sm"
      >
        <span>
          Delivery details <span className="text-muted-foreground">(optional)</span>
        </span>
        <ChevronDown className={`size-4 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} strokeWidth={1.6} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <m.div
            id="delivery-details"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: EASE_LUX }}
            className="overflow-hidden"
          >
            <div className="grid gap-3 px-0.5 pt-3 pb-1">
              <div className="grid grid-cols-2 gap-3">
                <div className="grid gap-1.5">
                  <Label htmlFor="delivery-name" className="text-xs text-muted-foreground">
                    Your name
                  </Label>
                  <Input {...field('name')} autoComplete="name" className="bg-card" />
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="delivery-area" className="text-xs text-muted-foreground">
                    Deliver to
                  </Label>
                  <Input {...field('area')} placeholder="e.g. Bole, Addis Ababa" autoComplete="address-level2" className="bg-card" />
                </div>
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="delivery-note" className="text-xs text-muted-foreground">
                  Note for the workshop
                </Label>
                <Textarea {...field('note')} rows={2} placeholder="Belt size, gift wrapping, a preferred day…" className="min-h-0 resize-none bg-card" />
              </div>
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function OrderConfirmation({ order, url, onClose }) {
  return (
    <m.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: EASE_LUX }}
      className="flex flex-1 flex-col items-center overflow-y-auto px-8 py-10 text-center"
      role="status"
    >
      <SewnCheck />
      <h3 className="text-subtitle mt-6">Your order is ready to send</h3>
      <p className="mt-3 max-w-[34ch] text-sm leading-relaxed text-muted-foreground">
        We have opened WhatsApp with order <strong className="font-medium text-foreground">{order.order_number}</strong> typed out. Press send
        there and we will reply with delivery details.
      </p>
      <ul className="mt-8 w-full divide-y divide-hairline rounded-xl bg-parchment/60 px-5 text-left text-sm">
        {order.items.map((item) => (
          <li key={`${item.product_id}-${item.color}`} className="flex justify-between gap-4 py-3">
            <span>
              {item.quantity} × {item.name}
              {item.color && <span className="text-muted-foreground"> ({item.color})</span>}
            </span>
            <span className="shrink-0 tabular-nums">{formatPrice(item.line_total, order.currency)}</span>
          </li>
        ))}
        <li className="flex justify-between py-3 font-medium">
          <span>Subtotal</span>
          <span className="tabular-nums">{formatPrice(order.subtotal, order.currency)}</span>
        </li>
      </ul>
      <div className="mt-8 grid w-full gap-3">
        <Button asChild size="lg" className="h-12 rounded-full">
          <a href={url} target="_blank" rel="noopener noreferrer">
            <WhatsAppIcon className="size-[1.1rem]" />
            WhatsApp didn't open? Try again
          </a>
        </Button>
        <Button size="lg" variant="ghost" className="h-12 rounded-full" onClick={onClose}>
          Continue browsing
        </Button>
      </div>
    </m.div>
  )
}

/**
 * The bag. Checkout records the order through orderService, hands the customer
 * to WhatsApp with everything typed out, then confirms in place. Removing a
 * line or clearing the bag can be undone for a few seconds.
 */
export function CartDrawer() {
  const { items, open, setOpen, clear, count, subtotal, removeItem, insertItem, restoreItems } = useCart()
  const createOrder = useCreateOrder()
  const [details, setDetails] = useStoredState('hlc.delivery.v1', NO_DETAILS)
  const [confirmed, setConfirmed] = useState(null)
  const [undo, setUndo] = useState(null)
  const undoTimer = useRef(null)

  const offerUndo = (label, restore) => {
    clearTimeout(undoTimer.current)
    setUndo({ label, restore })
    undoTimer.current = setTimeout(() => setUndo(null), UNDO_MS)
  }

  const remove = (item) => {
    const index = items.findIndex((i) => i.key === item.key)
    removeItem(item.key)
    offerUndo(`${item.name} removed`, () => insertItem(item, index))
  }

  const clearBag = () => {
    const snapshot = items
    clear()
    offerUndo('Bag cleared', () => restoreItems(snapshot))
  }

  // once the drawer has slid shut, go back to the normal bag view
  useEffect(() => {
    if (open) return
    const id = setTimeout(() => {
      setConfirmed(null)
      setUndo(null)
    }, 400)
    return () => clearTimeout(id)
  }, [open])

  useEffect(() => () => clearTimeout(undoTimer.current), [])

  async function checkout() {
    // open the tab now, inside the click, so pop-up blockers allow it; it is pointed at WhatsApp once the order exists
    const tab = window.open('', '_blank')
    const customer = Object.fromEntries(
      Object.entries(details)
        .map(([key, value]) => [key, value.trim()])
        .filter(([, value]) => value),
    )
    try {
      const order = await createOrder.mutateAsync({
        items: items.map(({ product_id, color, quantity }) => ({ product_id, color, quantity })),
        customer,
      })
      const url = whatsappLink(orderMessage(order))
      if (tab) {
        tab.opener = null
        tab.location.href = url
      } else {
        window.location.href = url
      }
      clear()
      setUndo(null)
      setConfirmed({ order, url })
    } catch (error) {
      tab?.close()
      toast.error('We could not start checkout', { description: error.message })
    }
  }

  const close = () => setOpen(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent side="right" className="w-full gap-0 bg-background p-0 sm:max-w-md">
        <SheetHeader className="flex-row items-center justify-between border-b border-hairline px-6 py-5 pr-14">
          <SheetTitle className="font-serif text-2xl font-medium">
            {confirmed ? 'Order prepared' : 'Your bag'}{' '}
            {!confirmed && count > 0 && <span className="text-base text-muted-foreground tabular-nums">({count})</span>}
          </SheetTitle>
          <SheetDescription className="sr-only">Review the items in your bag and check out on WhatsApp</SheetDescription>
          {!confirmed && items.length > 1 && (
            <button type="button" onClick={clearBag} className="link-draw text-sm text-muted-foreground hover:text-foreground">
              Clear bag
            </button>
          )}
        </SheetHeader>

        {/* undo strip */}
        <AnimatePresence initial={false}>
          {undo && (
            <m.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: EASE_LUX }}
              className="overflow-hidden bg-espresso text-cream"
              role="status"
            >
              <div className="flex items-center justify-between gap-4 px-6 py-3 text-sm">
                <span className="truncate">{undo.label}</span>
                <button
                  type="button"
                  onClick={() => {
                    undo.restore()
                    setUndo(null)
                  }}
                  className="inline-flex shrink-0 items-center gap-1.5 font-medium text-gold hover:text-cream"
                >
                  <Undo2 className="size-4" strokeWidth={1.6} />
                  Undo
                </button>
              </div>
            </m.div>
          )}
        </AnimatePresence>

        {confirmed ? (
          <OrderConfirmation order={confirmed.order} url={confirmed.url} onClose={close} />
        ) : items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
            <LogoMark size={44} className="text-gold" />
            <p className="font-serif text-2xl">Your bag is empty</p>
            <p className="max-w-[30ch] text-sm text-muted-foreground">Every piece is cut and stitched by hand in Addis Ababa. Find one that is yours.</p>
            <Button asChild size="lg" className="mt-2 rounded-full px-7" onClick={close}>
              <Link to="/shop">Browse the collection</Link>
            </Button>
          </div>
        ) : (
          <>
            <ul className="flex-1 divide-y divide-hairline overflow-y-auto px-6">
              <AnimatePresence initial={false}>
                {items.map((item) => (
                  <CartLine key={item.key} item={item} onRemove={remove} onNavigate={close} />
                ))}
              </AnimatePresence>
            </ul>

            <div className="bg-parchment/60 px-6 pt-5 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
              <StitchLine className="mb-4 text-gold/50" />
              <DeliveryDetails details={details} onChange={setDetails} />
              <div className="flex items-baseline justify-between">
                <span className="text-sm text-muted-foreground">Subtotal</span>
                <span className="font-serif text-2xl tabular-nums">{formatPrice(subtotal)}</span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">Delivery is arranged with you on WhatsApp.</p>
              <Button size="lg" className="mt-5 h-12 w-full rounded-full text-[0.95rem]" onClick={checkout} disabled={createOrder.isPending}>
                <WhatsAppIcon className="size-[1.1rem]" />
                {createOrder.isPending ? 'Preparing your order…' : 'Checkout via WhatsApp'}
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
