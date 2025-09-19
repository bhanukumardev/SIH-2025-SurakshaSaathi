import type React from "react"

export const PhulkariIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2L8 6L12 10L16 6L12 2Z" fill="currentColor" className="text-[#D2691E]" />
    <path d="M12 10L8 14L12 18L16 14L12 10Z" fill="currentColor" className="text-[#228B22]" />
    <path d="M6 8L2 12L6 16L10 12L6 8Z" fill="currentColor" className="text-[#DAA520]" />
    <path d="M18 8L14 12L18 16L22 12L18 8Z" fill="currentColor" className="text-[#B22222]" />
  </svg>
)

export const WheatStalkIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M12 2V22M8 4L12 2L16 4M7 6L12 4L17 6M6 8L12 6L18 8M5 10L12 8L19 10M4 12L12 10L20 12"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      className="text-[#DAA520]"
    />
  </svg>
)

export const GurudwaraIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2L8 6H16L12 2Z" fill="currentColor" className="text-[#D2691E]" />
    <rect x="10" y="6" width="4" height="12" fill="currentColor" className="text-[#228B22]" />
    <rect x="6" y="14" width="12" height="4" fill="currentColor" className="text-[#8B4513]" />
    <circle cx="12" cy="20" r="2" fill="currentColor" className="text-[#DAA520]" />
  </svg>
)

export const PunjabiBorder = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div
    className={`border-2 rounded-lg p-4 ${className}`}
    style={{
      borderImage: "linear-gradient(45deg, #D2691E, #228B22, #DAA520) 1",
    }}
  >
    {children}
  </div>
)

export const PhulkariPattern = ({ className = "" }: { className?: string }) => (
  <div
    className={`${className}`}
    style={{
      backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23D2691E' fillOpacity='0.1'%3E%3Cpath d='M20 20l10-10v20l-10-10zm0 0l-10 10h20l-10-10z'/%3E%3C/g%3E%3C/svg%3E")`,
    }}
  />
)
