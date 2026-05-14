interface Step {
  number: number
  title: string
}

interface Props {
  steps: Step[]
  current: number  // 1-indexed
  campaignSlug: string
}

export function CampaignProgress({ steps, current, campaignSlug }: Props) {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-0">
        {steps.map((step, i) => {
          const done = step.number < current
          const active = step.number === current
          return (
            <div key={step.number} className="flex items-center flex-1 min-w-0">
              <div className="flex flex-col items-center gap-1 flex-1 min-w-0">
                <div
                  className={`w-7 h-7 rounded-radius-full flex items-center justify-center text-xs font-semibold shrink-0 transition-colors ${
                    done
                      ? 'bg-on-surface text-on-primary'
                      : active
                      ? 'bg-primary text-on-primary ring-2 ring-primary-container'
                      : 'bg-surface text-on-surface-muted'
                  }`}
                >
                  {done ? '✓' : step.number}
                </div>
                <span
                  className={`text-[10px] font-medium leading-tight text-center truncate max-w-[72px] ${
                    active ? 'text-on-surface' : done ? 'text-on-surface-muted' : 'text-on-surface-muted'
                  }`}
                >
                  {step.title}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div
                  className={`h-0.5 flex-1 mx-1 mb-4 rounded-radius-sm transition-colors ${
                    step.number < current ? 'bg-on-surface' : 'bg-border'
                  }`}
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
