'use client'

/**
 * The footer (owner, 2026-11-28): a large logo above the columns, on a solid
 * logo-blue background. Hovering the logo's red or yellow shape turns the footer
 * that color, with a transition; leaving the logo returns it to blue. Blue and red
 * sit one stop darker than the logo so white text passes; yellow is lighter, with
 * dark text (tokens footer-* and on-footer*, DECISIONS.md).
 */
import { useState } from 'react'
import Link from 'next/link'
import { ThemeSwitch } from './ThemeSwitch'

function JohnTheDesignerMark({ size = 16 }: { size?: number }) {
  const w = Math.round(size * (90 / 41))
  return (
    <svg width={w} height={size} viewBox="0 0 90 41" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M33.748 12.8556C33.6767 12.4504 33.9467 12.0641 34.351 11.9926L53.7972 8.55685C54.2015 8.48541 54.5871 8.75594 54.6584 9.16109L56.2437 18.1702C56.315 18.5753 56.045 18.9617 55.6407 19.0331L51.5113 19.7627C51.3091 19.7985 51.1741 19.9916 51.2098 20.1942L52.8597 29.5701C52.931 29.9752 52.661 30.3616 52.2566 30.433L43.2657 32.0216C42.8614 32.093 42.4758 31.8225 42.4045 31.4173L40.7546 22.0415C40.7189 21.8389 40.5262 21.7036 40.324 21.7393L36.1946 22.4689C35.7902 22.5404 35.4047 22.2698 35.3334 21.8647L33.748 12.8556Z" />
      <path d="M22.1508 11.9354C22.1294 11.5246 22.4443 11.1741 22.8543 11.1525L31.9715 10.6737C32.3815 10.6522 32.7313 10.9678 32.7528 11.3786L33.2695 21.2581C33.5763 27.1252 29.0785 32.1307 23.2232 32.4381C17.6175 32.7325 12.8 28.6142 12.1301 23.1142C12.0804 22.7059 12.398 22.3541 12.808 22.3326L22.2964 21.8343C22.5014 21.8236 22.6588 21.6483 22.6481 21.4429L22.1508 11.9354Z" />
      <path d="M59.3772 9.62064L69.1003 11.3385C74.8745 12.3588 78.7301 17.8762 77.7119 23.6621C76.6938 29.448 71.1875 33.3113 65.4132 32.2911L55.6901 30.5732C55.2858 30.5018 55.0158 30.1154 55.0871 29.7103L58.516 10.2249C58.5873 9.81973 58.9729 9.5492 59.3772 9.62064Z" />
    </svg>
  )
}

const FOOTER_NAV = [
  {
    label: 'Get started',
    links: [
      { label: 'How Sistema works', href: '/how-it-works' },
      { label: 'Start a design system', href: '/start' },
      { label: 'Audit what you have', href: '/audit' },
      { label: 'Update my system', href: '/update' },
      { label: 'Connect the MCP server', href: '/connect' },
      { label: 'All plays', href: '/plays' },
    ],
  },
  {
    label: 'Learn',
    links: [
      { label: 'Guides', href: '/guides' },
      { label: 'Reference', href: '/reference' },
      { label: 'Opinions', href: '/reference/opinions' },
      { label: 'Rules', href: '/reference/rules' },
      { label: 'For agents', href: '/agents' },
    ],
  },
  {
    label: 'Tools',
    links: [
      { label: 'Palette', href: '/tools/palette' },
      { label: 'Contrast', href: '/tools/contrast' },
      { label: 'Type scale', href: '/tools/type-scale' },
      { label: 'Specimen', href: '/tools/specimen' },
      { label: 'Token validator', href: '/tools/validate' },
      { label: 'Dark mode', href: '/tools/dark-mode' },
      { label: 'Sources', href: '/sources' },
      { label: 'Privacy', href: '/privacy' },
    ],
  },
]

type Tone = 'blue' | 'red' | 'yellow'
const TONE: Record<Tone, string> = {
  blue: 'bg-footer-blue text-on-footer',
  red: 'bg-footer-red text-on-footer',
  yellow: 'bg-footer-yellow text-on-footer-yellow',
}

const focusRing = 'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current rounded-radius-sm'

/** The logo symbol, with each of its three main shapes reporting hover. The overlaps belong to two shapes, so they don't. */
function InteractiveSymbol({ onTone, height }: { onTone: (t: Tone) => void; height: number }) {
  const width = Math.round(height * (172 / 192))
  return (
    <svg width={width} height={height} viewBox="0 0 172 192" fill="none" aria-hidden="true" onMouseLeave={() => onTone('blue')} className="shrink-0">
      <path onMouseEnter={() => onTone('red')} fillRule="evenodd" clipRule="evenodd" d="M69.1123 121.945L42.307 142.588C35.605 147.75 36.994 158.229 44.8092 161.466L115.922 190.922C123.738 194.159 132.13 187.732 131.04 179.343L125.626 137.647L93.1029 151.119C87.4902 153.443 81.0555 150.778 78.7307 145.165L69.1123 121.945Z" fill="#E60026" />
      <path onMouseEnter={() => onTone('yellow')} fillRule="evenodd" clipRule="evenodd" d="M99.08 40.4036L54.8345 58.7307C49.2218 61.0555 46.5565 67.4902 48.8814 73.1029L59.6381 99.0719C56.5194 99.6809 53.297 100 50 100C22.3858 100 0 77.6142 0 50C0 22.3858 22.3858 0 50 0C74.332 0 94.6045 17.3804 99.08 40.4036Z" fill="#FFCC33" />
      <path d="M69.1123 121.945L103.478 95.4787C110.2 90.3014 120.005 94.3628 121.098 102.777L125.626 137.647L93.1029 151.119C87.4902 153.443 81.0555 150.778 78.7307 145.165L69.1123 121.945Z" fill="#790083" />
      <path onMouseEnter={() => onTone('blue')} fillRule="evenodd" clipRule="evenodd" d="M69.1123 121.945L59.6381 99.0719C82.6406 94.58 100 74.3173 100 50C100 46.7177 99.6837 43.5093 99.08 40.4036L126.897 28.8814C132.51 26.5565 138.944 29.2218 141.269 34.8345L171.119 106.897C173.443 112.51 170.778 118.944 165.165 121.269L125.626 137.647L121.098 102.777C120.005 94.3628 110.2 90.3014 103.478 95.4787L69.1123 121.945Z" fill="#0070FF" />
      <path d="M54.8345 58.7307L99.08 40.4036C99.6837 43.5093 100 46.7177 100 50C100 74.3173 82.6406 94.58 59.6381 99.0719L48.8814 73.1029C46.5565 67.4902 49.2218 61.0555 54.8345 58.7307Z" fill="#2C7900" />
    </svg>
  )
}

export function SiteFooter() {
  const [tone, setTone] = useState<Tone>('blue')
  return (
    <footer className={`mt-section-gap transition-colors duration-500 motion-reduce:transition-none ${TONE[tone]}`}>
      <div className="max-w-[1180px] mx-auto px-5 md:px-10">
        <div className="pt-14 md:pt-20 pb-10 md:pb-14 flex items-center gap-5 md:gap-8">
          <InteractiveSymbol onTone={setTone} height={112} />
          <span className="font-serif font-semibold text-[56px] md:text-[96px] leading-none tracking-[-0.02em]" aria-label="Sistema">Sistema</span>
        </div>
        <div className="pb-12 grid grid-cols-1 md:grid-cols-[1.2fr_repeat(3,1fr)] gap-10">
          <p className="m-0 text-body max-w-[300px]">
            A method and tools for building a design system with your AI coding agent, in your own repository.
          </p>
          {FOOTER_NAV.map(section => (
            <div key={section.label}>
              <p className="m-0 mb-3 text-label font-semibold">{section.label}</p>
              <ul className="list-none p-0 m-0 flex flex-col gap-2">
                {section.links.map(link => (
                  <li key={link.href}>
                    <Link href={link.href} className={`no-underline hover:underline underline-offset-4 text-body-sm text-current ${focusRing}`}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="pt-5 pb-20 md:pb-24 flex flex-wrap items-center gap-x-5 gap-y-3 border-t border-current/20">
          <a href="https://johnthedesigner.com" target="_blank" rel="noopener noreferrer" className={`flex items-center gap-2 no-underline hover:underline underline-offset-4 text-caption text-current ${focusRing}`}>
            <JohnTheDesignerMark size={14} />
            Built by John the Designer
          </a>
          <span className="text-caption">Public beta</span>
          <div className="ml-auto"><ThemeSwitch onColor /></div>
        </div>
      </div>
    </footer>
  )
}
