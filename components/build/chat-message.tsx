'use client'

import { type Message } from '@/types'

export function ChatMessage({ message }: { message: Message }) {
  const isAI = message.role === 'ai'
  return (
    <div
      className={`flex items-end gap-2.5 mb-3 ${isAI ? '' : 'flex-row-reverse'}`}
      style={{ animation: 'fadeIn 0.25s ease-out' }}
    >
      {isAI && (
        <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-xs shrink-0 shadow-sm">
          ✨
        </div>
      )}
      <div
        className={`max-w-[85%] px-4 py-2.5 text-[14px] leading-relaxed shadow-sm whitespace-pre-line ${
          isAI
            ? 'bg-white border border-gray-200 text-gray-800 rounded-2xl rounded-bl-md'
            : 'bg-blue-600 text-white rounded-2xl rounded-br-md'
        }`}
      >
        {message.content}
      </div>
    </div>
  )
}

export function TypingIndicator() {
  return (
    <div className="flex items-end gap-2.5 mb-3">
      <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-xs shrink-0 shadow-sm">
        ✨
      </div>
      <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
        <div className="flex gap-1 items-center h-3">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="w-1.5 h-1.5 bg-gray-400 rounded-full"
              style={{
                animation: 'bounceDot 1.4s infinite',
                animationDelay: `${i * 0.16}s`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
