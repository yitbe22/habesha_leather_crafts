import { m } from 'framer-motion'
import { Menu, Search, ShoppingBag } from 'lucide-react'
import { useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { InstagramIcon, TelegramIcon, WhatsAppIcon } from '@/components/BrandIcons'
import { Logo } from '@/components/Logo'
import { StitchDivider } from '@/components/Ornaments'
import { ThemeToggle } from '@/components/ThemeToggle'
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { site } from '@/config/site'
import { useCart } from '@/context/CartContext'
import { useScrolled } from '@/hooks/useScrolled'
import { useIntroDone } from '@/lib/intro'
import { EASE_LUX } from '@/lib/motion'
import { cn } from '@/lib/utils'
import { telegramLink, whatsappLink } from '@/lib/whatsapp'

export const NAV_LINKS = [
  { to: '/', label: 'Home', end: true },
  { to: '/shop', label: 'Shop' },
  { to: '/about', label: 'Our Story' },
  { to: '/contact', label: 'Contact' },
]

const iconBtn =
  'relative grid size-10 place-items-center rounded-full transition-colors hover:bg-foreground/5 focus-visible:outline-2'

/**
 * Fixed site header. Transparent over the top of the home page, frosted
 * cream once the page scrolls. Slides in after the intro loader lifts.
 */
export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { count, setOpen: setCartOpen } = useCart()
  const scrolled = useScrolled()
  const introDone = useIntroDone()
  const { pathname } = useLocation()
  const clear = pathname === '/' && !scrolled

  return (
    <m.header
      initial={false}
      animate={introDone ? { y: 0, opacity: 1 } : { y: -24, opacity: 0 }}
      transition={{ duration: 0.8, ease: EASE_LUX }}
      className={cn(
        'fixed inset-x-0 top-0 z-40 border-b transition-[background-color,border-color,backdrop-filter] duration-500',
        clear ? 'border-transparent' : 'border-hairline bg-background/85 backdrop-blur-xl backdrop-saturate-150',
      )}
    >
      <div className="container-lux flex h-[var(--header-h)] items-center justify-between gap-4">
        <Logo />

        <nav className="hidden items-center gap-9 lg:flex" aria-label="Primary">
          {NAV_LINKS.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.end} className="link-draw py-1 text-[0.92rem]">
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <Link to="/shop" state={{ focusSearch: true }} className={cn(iconBtn, 'hidden sm:grid')} aria-label="Search the shop">
            <Search className="size-[1.15rem]" strokeWidth={1.5} />
          </Link>
          <a
            href={site.social.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(iconBtn, 'hidden lg:grid')}
            aria-label="Instagram (opens in a new tab)"
          >
            <InstagramIcon className="size-[1.15rem]" />
          </a>
          <ThemeToggle />
          <button type="button" data-cart-button="" onClick={() => setCartOpen(true)} className={iconBtn} aria-label={`Open bag, ${count} ${count === 1 ? 'item' : 'items'}`}>
            <ShoppingBag className="size-[1.15rem]" strokeWidth={1.5} />
            {count > 0 && (
              // keyed on the count so the badge bumps each time something is added
              <m.span
                key={count}
                initial={{ scale: 1.6 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 500, damping: 15 }}
                className="absolute top-0.5 right-0 grid size-[1.1rem] place-items-center rounded-full bg-primary text-[0.62rem] font-semibold text-primary-foreground tabular-nums"
                aria-hidden="true"
              >
                {count}
              </m.span>
            )}
          </button>

          <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
            <SheetTrigger className={cn(iconBtn, '-mr-2 lg:hidden')} aria-label="Open menu">
              <Menu className="size-5" strokeWidth={1.5} />
            </SheetTrigger>
            <SheetContent side="right" className="w-[86vw] max-w-sm gap-0 bg-background p-0">
              <SheetTitle className="sr-only">Menu</SheetTitle>
              <SheetDescription className="sr-only">Site navigation and contact links</SheetDescription>
              <div className="border-b border-hairline px-8 py-6">
                <Logo onClick={() => setMenuOpen(false)} />
              </div>
              <nav className="flex flex-col px-8 py-6" aria-label="Mobile">
                {NAV_LINKS.map((l, i) => (
                  <m.div
                    key={l.to}
                    initial={{ opacity: 0, x: 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, ease: EASE_LUX, delay: 0.1 + i * 0.06 }}
                  >
                    <NavLink
                      to={l.to}
                      end={l.end}
                      onClick={() => setMenuOpen(false)}
                      className={({ isActive }) =>
                        cn(
                          'block border-b border-border py-4 font-serif text-[2rem] leading-none transition-colors',
                          isActive ? 'text-cognac' : 'hover:text-cognac',
                        )
                      }
                    >
                      {l.label}
                    </NavLink>
                  </m.div>
                ))}
              </nav>
              <div className="mt-auto flex flex-col items-center gap-6 px-8 pb-10">
                <StitchDivider />
                <div className="flex items-center gap-3">
                  {[
                    { href: whatsappLink(), label: 'WhatsApp', Icon: WhatsAppIcon },
                    { href: site.social.instagram, label: 'Instagram', Icon: InstagramIcon },
                    { href: telegramLink(), label: 'Telegram', Icon: TelegramIcon },
                  ].map(({ href, label, Icon }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${label} (opens in a new tab)`}
                      className="grid size-11 place-items-center rounded-full border border-border transition-colors hover:border-cognac hover:text-cognac"
                    >
                      <Icon />
                    </a>
                  ))}
                </div>
                <a href={`tel:${site.contact.phone.replace(/\s/g, '')}`} className="text-sm text-muted-foreground tabular-nums">
                  {site.contact.phone}
                </a>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </m.header>
  )
}
