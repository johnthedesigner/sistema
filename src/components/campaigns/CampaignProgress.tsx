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
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 transition-colors ${
                    done
                      ? 'bg-gray-900 text-white'
                      : active
                      ? 'bg-blue-600 text-white ring-2 ring-blue-200'
                      : 'bg-gray-100 text-gray-400'
                  }`}
                >
                  {done ? '✓' : step.number}
                </div>
                <span
                  className={`text-[10px] font-medium leading-tight text-center truncate max-w-[72px] ${
                    active ? 'text-gray-900' : done ? 'text-gray-500' : 'text-gray-400'
                  }`}
                >
                  {step.title}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div
                  className={`h-0.5 flex-1 mx-1 mb-4 rounded transition-colors ${
                    step.number < current ? 'bg-gray-900' : 'bg-gray-200'
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
