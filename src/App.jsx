import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { LazyMotion, MotionConfig, domAnimation } from 'framer-motion'
import { Suspense } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Layout } from '@/components/Layout'
import { PageFallback } from '@/components/PageFallback'
import { Toaster } from '@/components/ui/sonner'
import { CartProvider } from '@/context/CartContext'
import { ThemeProvider } from '@/context/ThemeContext'
import Home from '@/pages/Home'
import { About, AdminDashboard, AdminLayout, Contact, NotFound, ProductDetail, Shop } from '@/pages/lazy'

// Home ships in the main bundle (it is the usual landing page); everything else loads on demand (see pages/lazy.js).

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'shop', element: <Shop /> },
      { path: 'product/:slug', element: <ProductDetail /> },
      { path: 'about', element: <About /> },
      { path: 'contact', element: <Contact /> },
      { path: '*', element: <NotFound /> },
    ],
  },
  {
    // Admin route group. When auth arrives, wrap this element in a
    // <ProtectedRoute> that redirects signed-out visitors; children stay as they are.
    path: '/admin',
    element: (
      <Suspense fallback={<PageFallback />}>
        <AdminLayout />
      </Suspense>
    ),
    children: [{ index: true, element: <AdminDashboard /> }],
  },
])

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 5 * 60 * 1000, refetchOnWindowFocus: false, retry: 1 },
  },
})

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <CartProvider>
          <LazyMotion features={domAnimation} strict>
            <MotionConfig reducedMotion="user">
              <RouterProvider router={router} />
              <Toaster position="bottom-center" />
            </MotionConfig>
          </LazyMotion>
        </CartProvider>
      </ThemeProvider>
    </QueryClientProvider>
  )
}
