import type { Metadata } from 'next'
import { Inter, Fraunces, JetBrains_Mono } from 'next/font/google'
import { Nav } from '@/components/layout/Nav'
import { SiteFooter } from '@/components/layout/Footer'
import { ThemeDebugToggle } from '@/components/dev/ThemeDebugToggle'
import { Analytics } from '@vercel/analytics/next'
import { PostHogProvider } from '@/components/providers/PostHogProvider'
import { SITE_URL } from '@/lib/site-url'
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
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Sistema — Design system prompts for Claude Code and Cursor',
    template: '%s — Sistema',
  },
  description:
    'Ready-to-paste prompts grounded in real design system references. Helps Claude Code and Cursor generate tokens, components, and audits without guessing.',
  openGraph: {
    type: 'website',
    siteName: 'Sistema',
    title: 'Sistema — Design system prompts for Claude Code and Cursor',
    description:
      'Ready-to-paste prompts grounded in real design system references. Helps Claude Code and Cursor generate tokens, components, and audits without guessing.',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Sistema' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sistema — Design system prompts for Claude Code and Cursor',
    description:
      'Ready-to-paste prompts grounded in real design system references. Helps Claude Code and Cursor generate tokens, components, and audits without guessing.',
    images: ['/og-image.png'],
  },
  icons: {
    apple: '/apple-touch-icon.png',
    other: [
      { rel: 'icon', url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
    ],
  },
  robots: {
    index: true,
    follow: true,
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
        <PostHogProvider>
          <Nav />
          <div className="flex-1">{children}</div>
          <SiteFooter />
          {process.env.NODE_ENV === 'development' && <ThemeDebugToggle />}
          <Analytics />
        </PostHogProvider>
      </body>
    </html>
  )
}
