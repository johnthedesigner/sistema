import Link from 'next/link'

export function Nav() {
  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link href="/" className="font-semibold text-gray-900 hover:text-gray-600 transition-colors">
          Sistema
        </Link>
        <nav className="flex items-center gap-6 text-sm text-gray-600">
          <Link href="/kb" className="hover:text-gray-900 transition-colors">
            Knowledge Base
          </Link>
          <Link href="/playbooks" className="hover:text-gray-900 transition-colors">
            Playbooks
          </Link>
          <Link href="/tools/palette" className="hover:text-gray-900 transition-colors">
            Tools
          </Link>
          <Link href="/guide" className="hover:text-gray-900 transition-colors">
            Guide
          </Link>
        </nav>
      </div>
    </header>
  )
}
