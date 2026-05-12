const TIER_STYLES: Record<number, string> = {
  1: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  2: 'bg-amber-50 text-amber-700 border-amber-200',
  3: 'bg-purple-50 text-purple-700 border-purple-200',
}

const TIER_LABELS: Record<number, string> = {
  1: 'Tier 1 — Reference-grounded',
  2: 'Tier 2 — Analysis-then-generate',
  3: 'Tier 3 — Generative workflow',
}

export function TierBadge({ tier }: { tier?: 1 | 2 | 3 }) {
  if (!tier) return null
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${TIER_STYLES[tier] ?? 'bg-gray-50 text-gray-600 border-gray-200'}`}
      title={TIER_LABELS[tier]}
    >
      Tier {tier}
    </span>
  )
}
