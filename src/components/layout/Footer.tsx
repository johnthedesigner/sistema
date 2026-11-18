import Link from 'next/link'
import { SistemaLogo } from '@/components/logos/SistemaLogo'

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
      { label: 'Start a design system', href: '/workflows/start' },
      { label: 'Work on my system', href: '/workflows/session' },
      { label: 'All plays', href: '/plays' },
    ],
  },
  {
    label: 'Learn',
    links: [
      { label: 'Guides', href: '/guides' },
      { label: 'Opinions', href: '/reference/opinions' },
      { label: 'Rules', href: '/reference/rules' },
      { label: 'For agents', href: '/agents' },
    ],
  },
  {
    label: 'Resources',
    links: [
      { label: 'Palette tool', href: '/tools/palette' },
      { label: 'Contrast checker', href: '/tools/contrast' },
      { label: 'Type scale calculator', href: '/tools/type-scale' },
      { label: 'Sources', href: '/sources' },
      { label: 'Privacy', href: '/privacy' },
    ],
  },
]

export function SiteFooter() {
  return (
    <footer style={{ background: '#0E1116' }}>
      <div className="max-w-[1180px] mx-auto px-5 md:px-10">

        {/* Brand */}
        <div className="pt-14 md:pt-20 pb-10 md:pb-14 border-b border-white/[0.08]">
          <SistemaLogo height={64} />
          <p className="mt-5 font-serif font-normal m-0 text-white/40 text-[16px] leading-[1.6] max-w-[420px]">
            Structured plays and grounded reference material for AI-assisted design system work.
          </p>
        </div>

        {/* Nav columns */}
        <div className="py-10 md:py-14 grid grid-cols-2 md:grid-cols-3 gap-10 md:gap-16 border-b border-white/[0.08]">
          {FOOTER_NAV.map(section => (
            <div key={section.label}>
              <p className="font-mono m-0 mb-5 text-[10.5px] tracking-[0.12em] uppercase text-white/30">
                {section.label}
              </p>
              <ul className="list-none p-0 m-0 flex flex-col gap-3">
                {section.links.map(link => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="no-underline transition-colors text-[14px] text-white/50 hover:text-white/90"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom strip */}
        <div className="py-6 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-5">
          <a
            href="https://johnthedesigner.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 no-underline transition-colors text-white/35 hover:text-white/65"
          >
            <JohnTheDesignerMark size={14} />
            <span className="font-mono text-[11px]">Built by John the Designer</span>
          </a>
          <span className="hidden sm:inline text-white/20 text-[11px]">·</span>
          <span className="font-mono text-[11px] text-white/20">
            Public beta
          </span>
        </div>

      </div>
    </footer>
  )
}
