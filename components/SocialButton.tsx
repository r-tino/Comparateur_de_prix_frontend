// components/SocialButton.tsx

import type React from "react"

interface SocialButtonProps {
  Icon: React.ComponentType<{ className?: string }>
  text: string
  gradient: string
  className?: string
}

export function SocialButton({ Icon, text, gradient, className }: SocialButtonProps) {
  return (
    <button
      className={`flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-white transition-all duration-200 rounded-lg bg-gradient-to-r ${gradient} ${className}`}
    >
      <Icon className="w-5 h-5 mr-2" />
      {text}
    </button>
  )
}