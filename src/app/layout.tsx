import type { Metadata } from 'next'
import { Inter, Fraunces, JetBrains_Mono } from 'next/font/google'
import { Nav } from '@/components/layout/Nav'
import { SiteFooter } from '@/components/layout/Footer'
import { ThemeDebugToggle } from '@/components/dev/ThemeDebugToggle'
import '../styles/globals.css'

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-sans',
  display: 'swap',
})

const fraunces = Fraunces({
  subsets: ['latin'],
  weight: 'variable',
  axes: ['opsz'],
  variable: '--font-serif',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Sistema',
  description: 'Design system knowledge base',
  openGraph: {
    title: 'Sistema',
    description: 'Design system knowledge base',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/og-image.png'],
  },
  icons: {
    apple: '/apple-touch-icon.png',
    other: [
      { rel: 'icon', url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
    ],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${fraunces.variable} ${jetbrainsMono.variable}`}
    >
      <head>
        {/* Runs before paint — sets data-theme="dark" when the OS is in dark mode */}
        <script dangerouslySetInnerHTML={{ __html: `
          (function(){
            var override=sessionStorage.getItem('debug-theme');
            if(override==='dark'){
              document.documentElement.setAttribute('data-theme','dark');
            } else if(!override && window.matchMedia('(prefers-color-scheme:dark)').matches){
              document.documentElement.setAttribute('data-theme','dark');
            }
          })();
        `}} />
      </head>
      <body className="bg-canvas text-on-surface antialiased min-h-screen flex flex-col">
        <Nav />
        <div className="flex-1">{children}</div>
        <SiteFooter />
        {process.env.NODE_ENV === 'development' && <ThemeDebugToggle />}
      </body>
    </html>
  )
}
