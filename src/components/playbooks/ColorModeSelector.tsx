'use client'

const OPTIONS = [
  { value: 'Light only', label: 'Light only' },
  { value: 'Dark only', label: 'Dark only' },
  { value: 'Both', label: 'Both' },
]

export const COLOR_MODE_STORAGE_KEY = 'sistema-color-mode'

interface Props {
  value: string
  onChange: (value: string) => void
}

export function ColorModeSelector({ value, onChange }: Props) {
  return (
    <div className="flex gap-2">
      {OPTIONS.map(opt => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={`px-3 py-1.5 rounded-md text-sm font-medium border transition-colors ${
            value === opt.value
              ? 'bg-gray-900 text-white border-gray-900'
              : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400 hover:text-gray-900'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}
