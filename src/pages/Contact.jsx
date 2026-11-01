import { ArrowUpRight, Clock, Mail, Phone } from 'lucide-react'
import { InstagramIcon, TelegramIcon, WhatsAppIcon } from '@/components/BrandIcons'
import { ContactForm } from '@/components/contact/ContactForm'
import { MapPlaceholder } from '@/components/contact/MapPlaceholder'
import { PageHeader } from '@/components/PageHeader'
import { Reveal } from '@/components/Reveal'
import { Seo } from '@/components/Seo'
import { site } from '@/config/site'
import { telegramLink, whatsappLink } from '@/lib/whatsapp'

const CHANNELS = [
  {
    label: 'WhatsApp',
    value: 'The quickest way to reach us',
    href: whatsappLink(`Hello ${site.name}, I have a question.`),
    Icon: WhatsAppIcon,
    external: true,
    primary: true,
  },
  { label: 'Call the workshop', value: site.contact.phone, href: `tel:${site.contact.phone.replace(/\s/g, '')}`, Icon: Phone },
  { label: 'Telegram', value: `@${site.social.telegram}`, href: telegramLink(), Icon: TelegramIcon, external: true },
  { label: 'Instagram', value: site.social.instagramHandle, href: site.social.instagram, Icon: InstagramIcon, external: true },
  { label: 'Email', value: site.contact.email, href: `mailto:${site.contact.email}`, Icon: Mail },
]

export default function Contact() {
  return (
    <>
      <Seo
        title="Contact"
        description="Reach Habesha Leather Crafts on WhatsApp, Telegram, Instagram or by phone, or visit the workshop in Addis Ababa."
        path="/contact"
      />
      <PageHeader
        eyebrow="Get in touch"
        title="We would love to hear from you"
        description="Questions about a piece, a custom order or wholesale? Send a message, or reach the workshop directly on the channel you prefer."
      />

      {/* phones: quick channels first (most visitors arrive from Instagram), then the form, then hours and map */}
      <div className="container-lux grid grid-cols-[minmax(0,1fr)] items-start gap-10 pb-[var(--section-y)] lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] lg:gap-x-14">
        <Reveal className="rounded-[1.75rem] bg-card p-6 shadow-[0_30px_60px_-45px_rgba(42,26,18,0.45)] ring-1 ring-hairline sm:p-10 lg:sticky lg:top-[calc(var(--header-h)+2rem)] lg:row-span-2">
          <h2 className="text-subtitle">Send us a message</h2>
          <p className="mt-2 mb-8 text-sm text-muted-foreground">All fields are required except the topic, so we can reply to the right person.</p>
          <ContactForm />
        </Reveal>

        <div className="order-first lg:order-none lg:col-start-2 lg:row-start-1">
          <ul className="flex flex-col gap-3">
            {CHANNELS.map(({ label, value, href, Icon, external, primary }, i) => (
              <Reveal as="li" key={label} delay={0.1 + i * 0.06}>
                <a
                  href={href}
                  {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  className={
                    primary
                      ? 'group flex items-center gap-4 rounded-2xl bg-espresso p-4 text-cream transition-colors hover:bg-primary'
                      : 'group flex items-center gap-4 rounded-2xl bg-parchment p-4 transition-colors hover:bg-sand'
                  }
                >
                  <span className={primary ? 'grid size-12 place-items-center rounded-full bg-gold text-espresso' : 'grid size-12 place-items-center rounded-full bg-background text-cognac'}>
                    <Icon className="size-5" strokeWidth={1.5} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-medium">{label}</span>
                    <span className={primary ? 'block truncate text-sm text-cream/70' : 'block truncate text-sm text-muted-foreground'}>{value}</span>
                  </span>
                  <ArrowUpRight className="size-5 shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" strokeWidth={1.5} />
                  {external && <span className="sr-only">(opens in a new tab)</span>}
                </a>
              </Reveal>
            ))}
          </ul>
        </div>

        <div className="flex flex-col gap-8 lg:col-start-2">
          <Reveal delay={0.3} className="flex items-start gap-4 rounded-2xl border border-hairline p-5">
            <Clock className="mt-0.5 size-5 shrink-0 text-cognac" strokeWidth={1.5} />
            <div className="text-sm">
              <p className="font-medium">Workshop hours</p>
              <p className="mt-1 text-muted-foreground">{site.contact.hours}. Messages sent outside these hours are answered the next working day.</p>
            </div>
          </Reveal>

          <Reveal delay={0.35}>
            <MapPlaceholder />
          </Reveal>
        </div>
      </div>
    </>
  )
}
