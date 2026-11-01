import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { InstagramIcon, TelegramIcon, WhatsAppIcon } from '@/components/BrandIcons'
import { Logo } from '@/components/Logo'
import { NAV_LINKS } from '@/components/Navbar'
import { StitchLine } from '@/components/Ornaments'
import { Reveal } from '@/components/Reveal'
import { Words } from '@/components/Words'
import { site } from '@/config/site'
import { telegramLink, whatsappLink } from '@/lib/whatsapp'

const SHOP_LINKS = [
  { to: '/shop?category=bags', label: 'Bags' },
  { to: '/shop?category=wallets', label: 'Wallets' },
  { to: '/shop?category=belts', label: 'Belts' },
  { to: '/shop?category=accessories', label: 'Accessories' },
]

const SOCIALS = [
  { href: site.social.instagram, label: 'Instagram', Icon: InstagramIcon },
  { href: whatsappLink(), label: 'WhatsApp', Icon: WhatsAppIcon },
  { href: telegramLink(), label: 'Telegram', Icon: TelegramIcon },
]

function Column({ title, children }) {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="font-sans text-xs font-medium tracking-[0.22em] text-gold uppercase">{title}</h2>
      <ul className="flex flex-col gap-2.5 text-[0.95rem] text-cream/75">{children}</ul>
    </div>
  )
}

/** Espresso footer: an order call-to-action, then links, contact and socials. */
export function Footer() {
  return (
    <footer className="grain bg-espresso text-cream">
      {/* call to action */}
      <div className="container-lux flex flex-col items-start justify-between gap-8 py-16 md:flex-row md:items-end md:py-20">
        <div className="max-w-xl">
          <Reveal as="p" className="eyebrow !text-gold">
            Order directly from the workshop
          </Reveal>
          <h2 data-reveal="words" className="text-title mt-4">
            <Words text="Made by hand, made to last." />
          </h2>
        </div>
        <Reveal delay={0.2} className="flex flex-wrap gap-3">
          <a
            href={whatsappLink(`Hello ${site.name}, I'd like to ask about your leather goods.`)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-12 items-center gap-2.5 rounded-full bg-gold px-6 text-sm font-medium text-espresso transition-colors hover:bg-cream"
          >
            <WhatsAppIcon className="size-4" />
            Chat on WhatsApp
          </a>
          <a
            href={site.social.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-12 items-center gap-2 rounded-full border border-cream/30 px-6 text-sm font-medium transition-colors hover:border-cream"
          >
            {site.social.instagramHandle}
            <ArrowUpRight className="size-4" strokeWidth={1.5} />
          </a>
        </Reveal>
      </div>

      <div className="container-lux">
        <StitchLine className="text-gold/40" />
      </div>

      <div className="container-lux grid gap-12 py-14 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1.3fr]">
        <div className="flex flex-col items-start gap-5">
          <Logo className="text-cream" />
          <p className="max-w-xs text-[0.95rem] leading-relaxed text-cream/70">{site.description}</p>
          <div className="flex gap-2">
            {SOCIALS.map(({ href, label, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${label} (opens in a new tab)`}
                className="grid size-10 place-items-center rounded-full border border-cream/20 transition-colors hover:border-gold hover:text-gold"
              >
                <Icon className="size-[1.1rem]" />
              </a>
            ))}
          </div>
        </div>

        <Column title="Shop">
          {SHOP_LINKS.map((l) => (
            <li key={l.to}>
              <Link to={l.to} className="link-draw transition-colors hover:text-cream">
                {l.label}
              </Link>
            </li>
          ))}
        </Column>

        <Column title="Explore">
          {NAV_LINKS.map((l) => (
            <li key={l.to}>
              <Link to={l.to} className="link-draw transition-colors hover:text-cream">
                {l.label}
              </Link>
            </li>
          ))}
        </Column>

        <Column title="Visit the workshop">
          <li>{site.contact.address}</li>
          <li>{site.contact.hours}</li>
          <li>
            <a href={`tel:${site.contact.phone.replace(/\s/g, '')}`} className="link-draw tabular-nums transition-colors hover:text-cream">
              {site.contact.phone}
            </a>
          </li>
          <li>
            <a href={`mailto:${site.contact.email}`} className="link-draw break-all transition-colors hover:text-cream">
              {site.contact.email}
            </a>
          </li>
        </Column>
      </div>

      <div className="border-t border-cream/10">
        <div className="container-lux flex flex-col gap-2 py-6 text-xs text-cream/55 sm:flex-row sm:justify-between">
          <p>
            © {new Date().getFullYear()} {site.name}. Handcrafted in Addis Ababa.
          </p>
          <p>Demo storefront. Prices in Ethiopian Birr ({site.currency}).</p>
        </div>
      </div>
    </footer>
  )
}
