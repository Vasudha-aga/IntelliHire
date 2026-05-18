"use client"

interface LogoProps {
  size?: "sm" | "md" | "lg"
  showText?: boolean
}

export function IntelliHireLogo({ size = "md", showText = true }: LogoProps) {
  const dimensions = {
    sm: { icon: 32, text: "text-lg" },
    md: { icon: 40, text: "text-xl" },
    lg: { icon: 56, text: "text-3xl" },
  }

  const { icon, text } = dimensions[size]

  return (
    <div className="flex items-center gap-2.5">
      <div className="relative" style={{ width: icon, height: icon }}>
        {/* Outer glow */}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary via-accent to-primary blur-md opacity-50" />
        
        {/* Main logo container */}
        <svg
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="relative w-full h-full"
        >
          {/* Background shape with gradient */}
          <defs>
            <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F43F5E" />
              <stop offset="50%" stopColor="#EC4899" />
              <stop offset="100%" stopColor="#3B82F6" />
            </linearGradient>
            <linearGradient id="accentGradient" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3B82F6" />
              <stop offset="100%" stopColor="#F43F5E" />
            </linearGradient>
            <filter id="innerGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          
          {/* Main rounded square */}
          <rect
            x="2"
            y="2"
            width="44"
            height="44"
            rx="12"
            fill="url(#logoGradient)"
          />
          
          {/* Shine effect */}
          <path
            d="M6 14C6 9.58172 9.58172 6 14 6H24V6C24 10.4183 20.4183 14 16 14H6V14Z"
            fill="white"
            fillOpacity="0.25"
          />
          
          {/* Brain/AI icon - left hemisphere */}
          <path
            d="M16 15C16 15 12 17 12 22C12 27 14 30 16 31C18 32 20 32 22 31"
            stroke="white"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
          />
          
          {/* Brain/AI icon - right hemisphere */}
          <path
            d="M32 15C32 15 36 17 36 22C36 27 34 30 32 31C30 32 28 32 26 31"
            stroke="white"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
          />
          
          {/* Center connection - neural link */}
          <circle cx="24" cy="22" r="4" fill="white" />
          
          {/* Neural connections */}
          <path
            d="M20 22H16M28 22H32"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
          />
          
          {/* Upward arrow/target representing career growth */}
          <path
            d="M24 35V28M24 28L20 32M24 28L28 32"
            stroke="white"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          
          {/* Small accent dots */}
          <circle cx="14" cy="18" r="1.5" fill="white" fillOpacity="0.7" />
          <circle cx="34" cy="18" r="1.5" fill="white" fillOpacity="0.7" />
          <circle cx="18" cy="26" r="1" fill="white" fillOpacity="0.5" />
          <circle cx="30" cy="26" r="1" fill="white" fillOpacity="0.5" />
        </svg>
      </div>
      
      {showText && (
        <span className={`font-heading font-bold ${text} gradient-text`}>
          IntelliHire
        </span>
      )}
    </div>
  )
}
