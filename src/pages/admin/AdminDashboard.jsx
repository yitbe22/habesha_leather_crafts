import { LogoMark } from '@/components/Logo'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

const PLANNED = [
  'Sign-in for the workshop team',
  'Add, edit and hide products and photos',
  'See WhatsApp orders as they come in',
  'Update prices and stock in one place',
]

/** Placeholder dashboard until the Supabase-backed admin is built. */
export default function AdminDashboard() {
  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-title">Dashboard</h1>
      <Card className="mt-8">
        <CardHeader>
          <LogoMark size={40} className="mb-2 text-gold" />
          <CardTitle className="font-serif text-2xl font-medium">Admin coming soon</CardTitle>
          <CardDescription>This area will manage the shop once it moves to Supabase.</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="grid gap-3 sm:grid-cols-2">
            {PLANNED.map((item) => (
              <li key={item} className="stitched rounded-lg bg-parchment/60 p-4 text-sm">
                {item}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
