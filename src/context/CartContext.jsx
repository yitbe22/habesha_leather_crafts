import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useState } from 'react'

const STORAGE_KEY = 'hlc.cart.v1'
const MAX_QUANTITY = 10

const CartContext = createContext(null)

/** One line per product and colour, e.g. "p-03:Espresso". */
const lineKey = (productId, color) => `${productId}:${color ?? ''}`

function load() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY))
    return Array.isArray(saved) ? saved : []
  } catch {
    return []
  }
}

const clamp = (n) => Math.min(MAX_QUANTITY, Math.max(1, n))

function reducer(items, action) {
  switch (action.type) {
    case 'add': {
      const existing = items.find((i) => i.key === action.item.key)
      if (existing) {
        return items.map((i) => (i.key === existing.key ? { ...i, quantity: clamp(i.quantity + action.item.quantity) } : i))
      }
      return [...items, { ...action.item, quantity: clamp(action.item.quantity) }]
    }
    case 'update':
      return items.map((i) => (i.key === action.key ? { ...i, quantity: clamp(action.quantity) } : i))
    case 'remove':
      return items.filter((i) => i.key !== action.key)
    case 'insert':
      // undo for a single removal: put the line back where it was
      if (items.some((i) => i.key === action.item.key)) return items
      return [...items.slice(0, action.index), action.item, ...items.slice(action.index)]
    case 'restore':
      // undo for "clear bag"
      return action.items
    case 'clear':
      return []
    default:
      return items
  }
}

/**
 * Cart state, kept in localStorage so it survives a reload. Each line stores a
 * snapshot of the product (name, price, image) so the drawer renders without a
 * fetch; checkout re-prices everything through orderService.
 */
export function CartProvider({ children }) {
  const [items, dispatch] = useReducer(reducer, undefined, load)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    } catch {
      /* private mode: the cart lasts for this visit only */
    }
  }, [items])

  const addItem = useCallback((product, { color, quantity = 1 } = {}) => {
    const shade = product.colors.find((c) => c.name === color) ?? product.colors[0]
    dispatch({
      type: 'add',
      item: {
        key: lineKey(product.id, shade?.name),
        product_id: product.id,
        slug: product.slug,
        name: product.name,
        price: product.price,
        currency: product.currency,
        image: product.images[shade?.image_index ?? 0] ?? product.images[0],
        color: shade?.name ?? null,
        quantity,
      },
    })
  }, [])

  const value = useMemo(
    () => ({
      items,
      open,
      setOpen,
      addItem,
      updateQuantity: (key, quantity) => dispatch({ type: 'update', key, quantity }),
      removeItem: (key) => dispatch({ type: 'remove', key }),
      insertItem: (item, index) => dispatch({ type: 'insert', item, index }),
      restoreItems: (snapshot) => dispatch({ type: 'restore', items: snapshot }),
      clear: () => dispatch({ type: 'clear' }),
      count: items.reduce((sum, i) => sum + i.quantity, 0),
      subtotal: items.reduce((sum, i) => sum + i.price * i.quantity, 0),
      maxQuantity: MAX_QUANTITY,
    }),
    [items, open, addItem],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>')
  return ctx
}
