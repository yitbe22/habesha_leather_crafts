import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import { StitchDivider } from '@/components/Ornaments'
import { Reveal } from '@/components/Reveal'
import { Seo } from '@/components/Seo'
import { Words } from '@/components/Words'
import { Button } from '@/components/ui/button'

const CATEGORIES = ['Bags', 'Wallets', 'Belts', 'Accessories']

export default function NotFound() {
  return (
    <section className="container-lux page-top flex min-h-[80svh] flex-col items-center justify-center pb-24 text-center">
      <Seo title="Page not found" noindex />
      <Reveal as="p" className="font-serif text-[clamp(6rem,22vw,13rem)] leading-none text-cognac/75 italic" aria-hidden="true">
        404
      </Reveal>
      <h1 data-reveal="words" className="text-title mt-2">
        <Words text="This piece has wandered off the workbench" />
      </h1>
      <Reveal as="p" delay={0.2} className="mt-5 max-w-[46ch] text-muted-foreground">
        The page you are looking for has moved or never existed. The collection is still right where we left it.
      </Reveal>
      <Reveal delay={0.3} className="mt-8">
        <StitchDivider />
      </Reveal>
      <Reveal delay={0.4} className="mt-8 flex flex-wrap justify-center gap-3">
        <Button asChild size="lg" className="rounded-full px-7">
          <Link to="/shop">Browse the shop</Link>
        </Button>
        <Button asChild size="lg" variant="outline" className="rounded-full px-7">
          <Link to="/">
            <ArrowLeft strokeWidth={1.5} />
            Back home
          </Link>
        </Button>
      </Reveal>
      <Reveal as="nav" delay={0.5} aria-label="Shop categories" className="mt-10 flex flex-wrap items-center justify-center gap-2 text-sm">
        <span className="mr-1 text-muted-foreground">Or go straight to</span>
        {CATEGORIES.map((c) => (
          <Link
            key={c}
            to={`/shop?category=${c.toLowerCase()}`}
            className="rounded-full border border-border px-4 py-2.5 transition-colors hover:border-cognac hover:text-cognac"
          >
            {c}
          </Link>
        ))}
      </Reveal>
    </section>
  )
}
