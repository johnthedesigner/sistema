import type { Metadata } from 'next'
import { Nav } from '@/components/layout/Nav'
import '../styles/globals.css'

export const metadata: Metadata = {
  title: 'Sistema',
  description: 'Design system knowledge base',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-white text-gray-900 antialiased">
        <Nav />
        {children}
      </body>
    </html>
  )
}
