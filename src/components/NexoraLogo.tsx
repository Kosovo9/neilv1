/**
 * Nexora Logo Component
 * Logo metálico azul con efecto 3D
 */

interface NexoraLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

export default function NexoraLogo({ size = 'md', showText = true, className = '' }: NexoraLogoProps) {
  const sizeClasses = {
    sm: { n: 'w-8 h-8', text: 'text-lg' },
    md: { n: 'w-12 h-12', text: 'text-2xl' },
    lg: { n: 'w-16 h-16', text: 'text-4xl' }
  };

  const currentSize = sizeClasses[size];

  return (
    <div className={`flex flex-col items-center gap-2 ${className}`}>
      {/* Stylized "N" with metallic effect */}
      <div className={`${currentSize.n} relative`}>
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Metallic blue gradient - more realistic */}
            <linearGradient id="metallicBlue" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#60a5fa" stopOpacity="1" />
              <stop offset="15%" stopColor="#3b82f6" stopOpacity="1" />
              <stop offset="30%" stopColor="#2563eb" stopOpacity="1" />
              <stop offset="50%" stopColor="#1d4ed8" stopOpacity="1" />
              <stop offset="70%" stopColor="#1e40af" stopOpacity="1" />
              <stop offset="85%" stopColor="#1e3a8a" stopOpacity="1" />
              <stop offset="100%" stopColor="#172554" stopOpacity="1" />
            </linearGradient>
            {/* Highlight gradient - brighter for metallic shine */}
            <linearGradient id="highlight" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#bfdbfe" stopOpacity="1" />
              <stop offset="30%" stopColor="#93c5fd" stopOpacity="0.9" />
              <stop offset="60%" stopColor="#60a5fa" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.3" />
            </linearGradient>
            {/* Radial highlight for top-left */}
            <radialGradient id="radialHighlight" cx="30%" cy="30%">
              <stop offset="0%" stopColor="#bfdbfe" stopOpacity="1" />
              <stop offset="50%" stopColor="#93c5fd" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#60a5fa" stopOpacity="0" />
            </radialGradient>
            {/* Shadow filter */}
            <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceAlpha" stdDeviation="3" />
              <feOffset dx="2" dy="2" result="offsetblur" />
              <feComponentTransfer>
                <feFuncA type="linear" slope="0.3" />
              </feComponentTransfer>
              <feMerge>
                <feMergeNode />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          
          {/* Stylized N - Ribbon/Twisted effect with smooth curves */}
          <path
            d="M 15 15 
               Q 15 15, 20 20
               L 20 75
               Q 20 80, 25 80
               L 45 45
               Q 50 40, 55 45
               L 75 80
               Q 80 80, 80 75
               L 80 20
               Q 80 15, 75 15
               L 55 50
               Q 50 55, 45 50
               L 25 15
               Q 20 15, 15 15 Z"
            fill="url(#metallicBlue)"
            filter="url(#shadow)"
            className="drop-shadow-2xl"
            stroke="url(#metallicBlue)"
            strokeWidth="0.5"
          />
          
          {/* Highlight overlay for 3D effect - top-left */}
          <path
            d="M 15 15 
               Q 15 15, 20 20
               L 20 40
               Q 20 45, 25 45
               L 40 30
               Q 45 25, 50 30
               L 65 45
               Q 70 45, 70 40
               L 70 20
               Q 70 15, 65 15
               L 50 30
               Q 45 35, 40 30
               L 25 15
               Q 20 15, 15 15 Z"
            fill="url(#highlight)"
            opacity="0.7"
          />
          
          {/* Bottom-right highlight */}
          <path
            d="M 50 50
               Q 50 50, 55 55
               L 70 70
               Q 75 75, 75 80
               L 80 80
               Q 80 75, 75 70
               L 60 55
               Q 55 50, 50 50 Z"
            fill="url(#highlight)"
            opacity="0.5"
          />
          
          {/* Top-left bright radial highlight */}
          <ellipse
            cx="25"
            cy="25"
            rx="8"
            ry="8"
            fill="url(#radialHighlight)"
            opacity="0.8"
          />
          
          {/* Bottom-right bright radial highlight */}
          <ellipse
            cx="70"
            cy="70"
            rx="6"
            ry="6"
            fill="url(#radialHighlight)"
            opacity="0.6"
          />
        </svg>
      </div>

      {/* NEXORA Text */}
      {showText && (
        <div className="relative">
          <span
            className={`${currentSize.text} font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-b from-blue-400 via-blue-500 to-blue-700`}
            style={{
              textShadow: `
                0 1px 0 rgba(59, 130, 246, 0.5),
                0 2px 4px rgba(0, 0, 0, 0.3),
                0 0 8px rgba(59, 130, 246, 0.2),
                inset 0 -1px 0 rgba(30, 64, 175, 0.3)
              `,
              filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.4))'
            }}
          >
            NEXORA
          </span>
        </div>
      )}
    </div>
  );
}

