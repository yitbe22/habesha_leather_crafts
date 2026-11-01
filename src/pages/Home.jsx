import { CategoryGrid } from '@/components/home/CategoryGrid'
import { CraftStory } from '@/components/home/CraftStory'
import { FeaturedProducts } from '@/components/home/FeaturedProducts'
import { Hero } from '@/components/home/Hero'
import { InstagramStrip } from '@/components/home/InstagramStrip'
import { ProcessSteps } from '@/components/home/ProcessSteps'
import { Testimonials } from '@/components/home/Testimonials'
import { Marquee } from '@/components/Marquee'
import { Seo } from '@/components/Seo'

const PROMISES = ['Genuine Ethiopian leather', 'Cut and stitched by hand', 'Made in Addis Ababa', 'Order on WhatsApp', 'Built to last for years']

export default function Home() {
  return (
    <>
      <Seo path="/" />
      <Hero />
      <Marquee items={PROMISES} />
      <FeaturedProducts />
      <CategoryGrid />
      <CraftStory />
      <ProcessSteps />
      <Testimonials />
      <InstagramStrip />
    </>
  )
}
