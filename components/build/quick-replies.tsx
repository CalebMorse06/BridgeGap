'use client'

interface QuickRepliesProps {
  options: string[]
  onSelect: (text: string) => void
}

export function QuickReplies({ options, onSelect }: QuickRepliesProps) {
  if (!options.length) return null
  return (
    <div className="flex flex-wrap gap-2 mb-4 pl-10" style={{ animation: 'fadeIn 0.3s ease-out' }}>
      {options.map((opt) => (
        <button
          key={opt}
          onClick={() => onSelect(opt)}
          className="px-3.5 py-2 rounded-xl text-sm font-medium bg-white border border-gray-200 text-gray-700 hover:border-blue-400 hover:text-blue-700 hover:bg-blue-50 transition-all duration-150 shadow-sm active:scale-95"
        >
          {opt}
        </button>
      ))}
    </div>
  )
}
