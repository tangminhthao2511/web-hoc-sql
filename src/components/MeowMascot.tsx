import React from 'react';

export type MascotMood = 'happy' | 'thinking' | 'celebrating' | 'error' | 'coding';

interface MeowMascotProps {
  mood?: MascotMood;
  size?: number;
  message?: string;
  className?: string;
}

export const MeowMascot: React.FC<MeowMascotProps> = ({
  mood = 'happy',
  size = 56,
  message,
  className = '',
}) => {
  const accentColor =
    mood === 'celebrating'
      ? '#10B981'
      : mood === 'error'
        ? '#EF4444'
        : mood === 'coding'
          ? '#3B6BFF'
          : '#F98207';

  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      <div
        className="relative shrink-0 select-none"
        style={{ width: size, height: size }}
        aria-hidden="true"
      >
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-sm">
          {/* Background circle */}
          <circle cx="50" cy="54" r="42" fill="#FFF4E0" stroke={accentColor} strokeWidth="3" />
          {/* Cat Ears */}
          <path d="M22 36 L18 12 L40 26 Z" fill="#FDBA74" stroke="#9A3412" strokeWidth="2.5" strokeLinejoin="round" />
          <path d="M78 36 L82 12 L60 26 Z" fill="#FDBA74" stroke="#9A3412" strokeWidth="2.5" strokeLinejoin="round" />
          <path d="M24 32 L22 18 L35 27 Z" fill="#FCA5A5" />
          <path d="M76 32 L78 18 L65 27 Z" fill="#FCA5A5" />

          {/* Cat Head */}
          <ellipse cx="50" cy="55" rx="31" ry="27" fill="#FED7AA" stroke="#9A3412" strokeWidth="2.5" />

          {/* Forehead stripes */}
          <path d="M45 30 L47 37 M50 28 L50 37 M55 30 L53 37" stroke="#C2410C" strokeWidth="2.5" strokeLinecap="round" />

          {/* Eyes based on mood */}
          {mood === 'celebrating' ? (
            <>
              <path d="M33 50 Q38 44 43 50" fill="none" stroke="#1E293B" strokeWidth="3" strokeLinecap="round" />
              <path d="M57 50 Q62 44 67 50" fill="none" stroke="#1E293B" strokeWidth="3" strokeLinecap="round" />
            </>
          ) : mood === 'error' ? (
            <>
              <path d="M34 46 L42 54 M42 46 L34 54" stroke="#991B1B" strokeWidth="3" strokeLinecap="round" />
              <path d="M58 46 L66 54 M66 46 L58 54" stroke="#991B1B" strokeWidth="3" strokeLinecap="round" />
            </>
          ) : mood === 'coding' ? (
            <>
              {/* Cute glasses */}
              <rect x="29" y="43" width="17" height="13" rx="4" fill="#EFF6FF" stroke="#1E3A8A" strokeWidth="2.3" />
              <rect x="54" y="43" width="17" height="13" rx="4" fill="#EFF6FF" stroke="#1E3A8A" strokeWidth="2.3" />
              <line x1="46" y1="49" x2="54" y2="49" stroke="#1E3A8A" strokeWidth="2.3" />
              <circle cx="38" cy="49.5" r="2.8" fill="#1E293B" />
              <circle cx="62" cy="49.5" r="2.8" fill="#1E293B" />
            </>
          ) : (
            <>
              <circle cx="38" cy="49" r="4.2" fill="#1E293B" />
              <circle cx="62" cy="49" r="4.2" fill="#1E293B" />
              <circle cx="39.5" cy="47.5" r="1.4" fill="#FFFFFF" />
              <circle cx="63.5" cy="47.5" r="1.4" fill="#FFFFFF" />
            </>
          )}

          {/* Cheeks */}
          <ellipse cx="29" cy="58" rx="4.5" ry="2.6" fill="#FB7185" opacity="0.45" />
          <ellipse cx="71" cy="58" rx="4.5" ry="2.6" fill="#FB7185" opacity="0.45" />

          {/* Nose & Mouth */}
          <polygon points="47,57 53,57 50,60.5" fill="#EA580C" />
          {mood === 'error' ? (
            <path d="M44 66 Q50 61 56 66" fill="none" stroke="#9A3412" strokeWidth="2.2" strokeLinecap="round" />
          ) : (
            <>
              <path d="M50 60.5 Q46 66 42 63" fill="none" stroke="#9A3412" strokeWidth="2.2" strokeLinecap="round" />
              <path d="M50 60.5 Q54 66 58 63" fill="none" stroke="#9A3412" strokeWidth="2.2" strokeLinecap="round" />
            </>
          )}

          {/* Whiskers */}
          <path d="M16 54 L27 56 M15 60 L27 60" stroke="#9A3412" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M84 54 L73 56 M85 60 L73 60" stroke="#9A3412" strokeWidth="1.8" strokeLinecap="round" />

          {/* Celebration stars */}
          {mood === 'celebrating' && (
            <>
              <circle cx="14" cy="24" r="3" fill="#10B981" />
              <circle cx="88" cy="22" r="3.5" fill="#F59E0B" />
              <circle cx="86" cy="76" r="2.5" fill="#3B82F6" />
            </>
          )}
        </svg>
      </div>
      {message && (
        <div
          className={`text-xs sm:text-sm px-3 py-2 rounded-xl border font-medium leading-snug ${
            mood === 'celebrating'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
              : mood === 'error'
                ? 'bg-red-50 border-red-200 text-red-900'
                : 'bg-amber-50 border-amber-200 text-amber-950'
          }`}
        >
          {message}
        </div>
      )}
    </div>
  );
};
