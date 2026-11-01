# Habesha Leather Crafts

A demo storefront for **Habesha Leather Crafts**, an Addis Ababa workshop making handcrafted leather bags, wallets, belts and accessories ([@habeshaleathercrafts](https://www.instagram.com/habeshaleathercrafts/)).

Customers browse the collection, fill a bag and check out over **WhatsApp**: the order, with every item, colour, quantity and the subtotal, arrives in the shop's chat already typed out. There is no backend yet. All data comes from local mock files through a service layer that is shaped like Supabase, so the real database can be dropped in later without touching the UI.

**Stack:** React 19 (JavaScript) · Vite 8 · Tailwind CSS 4 · shadcn/ui (Radix) · React Router 7 · TanStack Query 5 · framer-motion · lucide-react · Sonner

## Setup

Requires Node 20 or newer.

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build in dist/
npm run preview    # serve the production build
npm run lint
npm run images     # regenerate product photos from /photos (see below)
```

## Configuration

| File | What it holds |
| --- | --- |
| `src/config/site.js` | Brand name, WhatsApp number, phone, email, address, hours, social links, currency. **Placeholder contact details are marked `TODO`.** |
| `src/config/images.js` | Every photo that isn't tied to one product: hero slideshow, "Our Craft", process steps, About page, Instagram strip. Swap a path here to change a photo everywhere. |
| `src/data/*.js` | Mock database rows: products, categories, testimonials (the testimonials are placeholders and say so on the page). |

### Product photos

Original photos live in `/photos`. `npm run images` (`scripts/build-images.mjs`) turns them into WebP files at 480 px and 960 px in `public/images/products/`, named `<product-slug>-<n>-<width>.webp`. It also crops off the logo and price printed on some of the source photos. To add a photo, drop the JPG into `/photos`, add its filename to the right product in the script, and run it again. Existing files are skipped; delete one to regenerate it.

`SmartImage` builds the responsive `srcset` from any `-960.webp` path. Any other URL (Unsplash, Supabase Storage…) is used as it is.

### Logo

`src/assets/logo.svg` is traced from the shop's own artwork. It's drawn as a CSS mask filled with the current text colour, so it follows light mode, dark mode and the dark bands automatically. `public/favicon.svg` uses the mark on its own. If you get the original vector file, replace both.

## Project structure

```
photos/                 original product photos (source for npm run images)
scripts/build-images.mjs
public/images/products/ generated WebP photos
src/
  assets/               logo
  components/ui/        shadcn/ui components
  components/           Navbar, Footer, ProductCard, CartDrawer, IntroLoader, ThemeToggle…
    home/ product/ about/ contact/   page sections
  pages/                Home, Shop, ProductDetail, About, Contact, NotFound
    admin/              AdminLayout, AdminDashboard (placeholder)
  services/             productService, categoryService, orderService, contentService
  data/                 mock data
  hooks/                useCatalog (all data fetching), useScrollReveal, useDragScroll…
  context/              CartContext (localStorage), ThemeContext (light / dark)
  config/               site.js, images.js
  lib/                  formatting, WhatsApp messages, motion helpers, photo flight
```

## How data flows

```
component ──► hooks/useCatalog.js ──► services/*.js ──► (today) src/data/*.js
                (TanStack Query)        async, returns       (tomorrow) Supabase
                                        { data, error }
```

- Components **never** import from `src/data`. They call hooks such as `useProducts({ category, sort, search })`, `useProduct(slug)`, `useCategories()` and `useCreateOrder()`.
- Every service function is `async` and resolves to `{ data, error }`, exactly like supabase-js. Each one has a comment showing the matching Supabase query.
- Field names are snake_case to match the future columns: `id, slug, name, description, price, currency, category_id, images[], colors[], leather_type, dimensions, in_stock, featured, created_at`.
- `colors` is an array of `{ name, hex, image_index }` (a `jsonb` column), so choosing a colour on the product page shows the matching photo.

## Migrating to Supabase

1. `npm install @supabase/supabase-js` and create `src/lib/supabase.js` with `createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_ANON_KEY)`.
2. Create tables that mirror the mock files: `categories`, `products` (with `category_id` referencing `categories.id`), `orders` (with `items` as `jsonb`, or a separate `order_items` table), `testimonials` and `contact_messages`. Move product photos to Supabase Storage and store their public URLs in `products.images`.
3. **Replace these service files.** Keep the function names and return shapes; the hooks and UI stay as they are.

| File | Functions to reimplement |
| --- | --- |
| `src/services/productService.js` | `getProducts({ category, sort, search, featured, excludeId, limit })`, `getProductById(id)`, `getProductBySlug(slug)`, `getRelatedProducts(product, limit)` |
| `src/services/categoryService.js` | `getCategories()` (with `product_count`) |
| `src/services/orderService.js` | `createOrder({ items, channel, customer })`. Look prices up on the server (a Postgres function / RPC or an Edge Function), never trust the cart. |
| `src/services/contentService.js` | `getTestimonials()`, `sendContactMessage(payload)` |

4. Delete `src/data/` and `src/lib/mock.js`.
5. Add Row Level Security: public read on `products`, `categories` and `testimonials`; insert-only on `orders` and `contact_messages`.

### Admin

`/admin` is a separate route group with its own layout (`src/pages/admin`) and a dashboard placeholder. When auth arrives, wrap the admin route's element in `App.jsx` with a `<ProtectedRoute>` that checks the Supabase session and redirects signed-out visitors. The child routes don't need to change.

## Features worth knowing

- **Checkout via WhatsApp:** the bag records the order through `orderService`, then opens WhatsApp with a pre-filled message (items, subtotal, order reference, optional name, delivery area and note).
- **Theme:** light by default, dark on request or when the system prefers it. The choice is remembered, and switching reveals the new theme in a circle from the toggle.
- **Motion:** intro loader, word-by-word headings, image wipes, scroll reveals, a photo that flies from a card into the product page, add-to-bag fly-in. Everything respects `prefers-reduced-motion`.
- **Accessibility:** skip link, visible focus rings, labelled controls, keyboard-friendly gallery, lightbox and colour picker. Automated axe checks pass WCAG A/AA on every page in both themes.
- **SEO:** a title, description and canonical URL per page (`<Seo>`), Product structured data on product pages, `robots.txt` keeping `/admin` out of search.

## Deploying

The site is a static single-page app. Rewrite rules for client-side routes are included for **Netlify** (`public/_redirects`) and **Vercel** (`vercel.json`). Before going live, set `site.url` in `src/config/site.js` (used for canonical links and product links in WhatsApp messages) and replace the placeholder contact details.
