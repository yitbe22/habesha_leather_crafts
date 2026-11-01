import { ArrowUpRight, LayoutDashboard, Package, Receipt, Users } from 'lucide-react'
import { Suspense } from 'react'
import { Link, NavLink, Outlet } from 'react-router-dom'
import { Logo } from '@/components/Logo'
import { PageFallback } from '@/components/PageFallback'
import { Seo } from '@/components/Seo'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

// Sections the admin will grow into. Only the dashboard exists for now.
const NAV = [
  { to: '/admin', label: 'Dashboard', Icon: LayoutDashboard, ready: true },
  { label: 'Products', Icon: Package },
  { label: 'Orders', Icon: Receipt },
  { label: 'Customers', Icon: Users },
]

/** Admin shell: a sidebar on large screens, a top bar on small ones, and the page. */
export default function AdminLayout() {
  return (
    <div className="min-h-svh bg-parchment/50 lg:grid lg:grid-cols-[260px_1fr]">
      <Seo title="Admin" noindex />
      <aside className="grain flex flex-col gap-8 bg-espresso p-6 text-cream lg:sticky lg:top-0 lg:h-svh">
        <Logo className="text-cream" />
        <nav className="flex gap-1 overflow-x-auto lg:flex-col" aria-label="Admin">
          {NAV.map(({ to, label, Icon, ready }) =>
            ready ? (
              <NavLink
                key={label}
                to={to}
                end
                className={({ isActive }) =>
                  cn('flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors', isActive ? 'bg-cream/10 text-cream' : 'text-cream/70 hover:bg-cream/5')
                }
              >
                <Icon className="size-4" strokeWidth={1.5} />
                {label}
              </NavLink>
            ) : (
              <span key={label} className="flex shrink-0 items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-cream/40" aria-disabled="true">
                <Icon className="size-4" strokeWidth={1.5} />
                {label}
                <Badge variant="outline" className="border-cream/20 text-[0.65rem] text-cream/50">
                  Soon
                </Badge>
              </span>
            ),
          )}
        </nav>
        <Link to="/" className="mt-auto hidden items-center gap-2 text-sm text-cream/70 transition-colors hover:text-cream lg:flex">
          Back to the store
          <ArrowUpRight className="size-4" strokeWidth={1.5} />
        </Link>
      </aside>
      <main className="p-6 lg:p-10">
        <Suspense fallback={<PageFallback />}>
          <Outlet />
        </Suspense>
      </main>
    </div>
  )
}
