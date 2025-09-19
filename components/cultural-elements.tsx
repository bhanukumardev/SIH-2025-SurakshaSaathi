import type React from "react"

export const PeacockFeatherIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M12 2C8 2 5 5 5 9c0 2 1 4 3 5l4 8 4-8c2-1 3-3 3-5 0-4-3-7-7-7z"
      fill="currentColor"
      className="text-primary"
    />
    <circle cx="12" cy="9" r="3" fill="currentColor" className="text-accent" />
    <circle cx="12" cy="9" r="1" fill="currentColor" className="text-white" />
  </svg>
)

export const LotusIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2l2 6h6l-5 4 2 6-5-4-5 4 2-6-5-4h6l2-6z" fill="currentColor" className="text-secondary" />
  </svg>
)

export const PhulkariPattern = ({ className = "" }: { className?: string }) => (
  <div className={`phulkari-pattern ${className}`} />
)

export const CulturalBorder = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`heritage-border border-2 rounded-lg p-4 ${className}`}>{children}</div>
)

export const TricolorStripe = ({ className = "h-1" }: { className?: string }) => (
  <div className={`flex ${className}`}>
    <div className="flex-1 bg-[#FF9933]" />
    <div className="flex-1 bg-white" />
    <div className="flex-1 bg-[#138808]" />
  </div>
)
