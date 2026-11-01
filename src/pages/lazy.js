import { lazyWithPreload } from '@/lib/lazyWithPreload'

// Pages loaded on demand. Each can be warmed ahead of time with `.preload()`
// (Layout does that for Shop and ProductDetail).
export const Shop = lazyWithPreload(() => import('@/pages/Shop'))
export const ProductDetail = lazyWithPreload(() => import('@/pages/ProductDetail'))
export const About = lazyWithPreload(() => import('@/pages/About'))
export const Contact = lazyWithPreload(() => import('@/pages/Contact'))
export const NotFound = lazyWithPreload(() => import('@/pages/NotFound'))
export const AdminLayout = lazyWithPreload(() => import('@/pages/admin/AdminLayout'))
export const AdminDashboard = lazyWithPreload(() => import('@/pages/admin/AdminDashboard'))
