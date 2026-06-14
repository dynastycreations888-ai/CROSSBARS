import React from 'react';

interface LogoProps {
  className?: string;
  showText?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ className = 'h-10', showText = true }) => {
  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Aesthetic SVG Logo from user picture (Lime-green dynamic triangle wrapper and ball nested) */}
      <svg
        viewBox="0 0 100 100"
        className="h-10 w-10 filter drop-shadow-[0_2px_8px_rgba(0,122,255,0.25)]"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Neon blue triangle framework */}
        <path
          d="M 12 25 L 88 25 L 50 88 Z"
          stroke="#007AFF"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="animate-pulse"
        />
        {/* Outer styling lines */}
        <path
          d="M 8 18 L 92 18"
          stroke="#007AFF"
          strokeWidth="3.5"
          strokeLinecap="round"
        />

        {/* Soccer Ball Hexagons inside */}
        <circle cx="50" cy="55" r="16" fill="#007AFF" stroke="#ffffff" strokeWidth="2.5" />
        
        {/* Core soccer pattern details */}
        {/* Center Pentagram */}
        <polygon points="50,47 57,52 54,60 46,60 43,52" fill="#ffffff" />
        {/* Directing seams */}
        <line x1="50" y1="47" x2="50" y2="39" stroke="#ffffff" strokeWidth="1.5" />
        <line x1="57" y1="52" x2="64" y2="49" stroke="#ffffff" strokeWidth="1.5" />
        <line x1="54" y1="60" x2="60" y2="67" stroke="#ffffff" strokeWidth="1.5" />
        <line x1="46" y1="60" x2="40" y2="67" stroke="#ffffff" strokeWidth="1.5" />
        <line x1="43" y1="52" x2="36" y2="49" stroke="#ffffff" strokeWidth="1.5" />
      </svg>
      {showText && (
        <span className="font-extrabold text-2xl tracking-tighter text-slate-900 font-sans italic flex items-center">
          CROSS
          <span className="text-blue-600 font-black not-italic relative pl-1">
            BARS
            <span className="absolute -bottom-1 left-1 right-0 h-1 bg-blue-600 rounded-full animate-bounce" style={{ animationDuration: '3s' }} />
          </span>
        </span>
      )}
    </div>
  );
};
