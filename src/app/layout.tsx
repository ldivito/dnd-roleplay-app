import type { Metadata } from 'next'
import './globals.css'
import ErrorBoundary from '@/components/ErrorBoundary'
import AppLayout from '@/components/AppLayout'

export const metadata: Metadata = {
  title: 'Sesión de Rol D&D',
  description: 'Interfaz de Dungeon Master para sesiones de rol de D&D',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body>
        <ErrorBoundary>
          <AppLayout>{children}</AppLayout>
        </ErrorBoundary>
      </body>
    </html>
  )
}
