import React from 'react';

export const KangarooIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg 
    viewBox="0 0 100 100" 
    className={className} 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Geometric, front-facing athletic Kangaroo head inspired by the premium modern sports brand reference */}
    <g fill="currentColor">
      {/* Central Forehead & Snout */}
      <path d="M50 26 L42 29 L45 42 L46 56 L50 62 L54 56 L55 42 L58 29 Z" />

      {/* Left Ear - Outer Blade */}
      <path d="M34 26 L5 1 L20 14 L30 22 Z" />

      {/* Left Ear - Inner Blade */}
      <path d="M44 23 L23 8 L29 17 L36 21 Z" />

      {/* Right Ear - Outer Blade */}
      <path d="M66 26 L95 1 L80 14 L70 22 Z" />

      {/* Right Ear - Inner Blade */}
      <path d="M56 23 L77 8 L71 17 L64 21 Z" />

      {/* Brow Lashes */}
      <path d="M25 36 L36 41 L27 39 Z" />
      <path d="M75 36 L64 41 L73 39 Z" />

      {/* Cheeks */}
      <path d="M28 39 L38 42 L40 54 L35 52 Z" />
      <path d="M72 39 L62 42 L60 54 L65 52 Z" />

      {/* Chin Detail */}
      <path d="M46 61 L50 66 L54 61 L50 62 Z" />

      {/* Chest Base / Collar */}
      <path d="M50 74 L36 56 L15 80 L50 100 Z" />
      <path d="M50 74 L64 56 L85 80 L50 100 Z" />
    </g>
  </svg>
);


