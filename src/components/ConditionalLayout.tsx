'use client'

import { usePathname } from 'next/navigation'
import AppLayout from '@/components/AppLayout'
import AuthGuard from '@/components/AuthGuard'

interface ConditionalLayoutProps {
  children: React.ReactNode
}

export default function ConditionalLayout({
  children,
}: ConditionalLayoutProps) {
  const pathname = usePathname()

  // Routes that don't require authentication (public)
  const publicRoutes = ['/login', '/signup']
  // Also exclude Next.js internal routes
  const isPublicRoute =
    publicRoutes.includes(pathname) || pathname.startsWith('/_')

  if (isPublicRoute) {
    // Render without AppLayout for login/signup (already have AuthGuard in those pages)
    return <>{children}</>
  }

  // All other routes require authentication
  return (
    <AuthGuard requireAuth={true}>
      <AppLayout>{children}</AppLayout>
    </AuthGuard>
  )
}
