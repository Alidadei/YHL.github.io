import { useState, useEffect } from 'react';

interface SunArcProps {
  lang: 'zh' | 'en';
}

export default function SunArc({ lang }: SunArcProps) {
  const [hour, setHour] = useState(12);

  useEffect(() => {
    setHour(new Date().getHours() + new Date().getMinutes() / 60);
    const timer = setInterval(() => {
      setHour(new Date().getHours() + new Date().getMinutes() / 60);
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // Sun travels from 6am (left) to 18pm (right), peak at 12pm
  const progress = Math.max(0, Math.min(1, (hour - 6) / 12));
  const isDay = hour >= 5.5 && hour <= 18.5;
  const isTwilight = (hour >= 5 && hour < 5.5) || (hour >= 18.5 && hour < 19);

  // Arc: x goes 5%..95%, y follows a parabola peaking at top
  const sunX = 5 + progress * 90;
  const sunY = isDay ? 80 - 70 * Math.sin(progress * Math.PI) : 90;
  const sunOpacity = isDay ? 1 : isTwilight ? 0.4 : 0;

  // Greeting based on time
  const greeting = lang === 'zh'
    ? (hour < 6 ? '夜深了' : hour < 12 ? '早上好' : hour < 18 ? '下午好' : '晚上好')
    : (hour < 6 ? 'Good Night' : hour < 12 ? 'Good Morning' : hour < 18 ? 'Good Afternoon' : 'Good Evening');

  // Sky gradient based on time
  const skyColors = (() => {
    if (hour >= 7 && hour < 17) return 'from-sky-300 via-blue-200 to-amber-50';
    if ((hour >= 5.5 && hour < 7) || (hour >= 17 && hour < 19)) return 'from-orange-300 via-pink-200 to-purple-200';
    if (hour >= 19 || hour < 5) return 'from-indigo-900 via-slate-800 to-slate-700';
    return 'from-slate-700 via-indigo-800 to-orange-200';
  })();

  const isNight = hour >= 19 || hour < 5.5;

  return (
    <div className={`relative w-full h-40 sm:h-52 rounded-2xl overflow-hidden bg-gradient-to-b ${skyColors} mb-4 transition-colors duration-1000`}>
      {/* Stars at night */}
      {isNight && (
        <div className="absolute inset-0">
          {Array.from({ length: 20 }).map((_, i) => (
            <span
              key={i}
              className="absolute rounded-full bg-white animate-pulse"
              style={{
                width: `${1 + Math.random() * 2}px`,
                height: `${1 + Math.random() * 2}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 60}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 3}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* Moon at night */}
      {isNight && (
        <svg
          className="absolute"
          style={{ left: `${70 + (hour >= 19 ? (hour - 19) / 10 * 15 : (hour + 5) / 10 * 15)}%`, top: '15%' }}
          width="32" height="32" viewBox="0 0 32 32"
        >
          <circle cx="16" cy="16" r="12" fill="#fde68a" opacity="0.9" />
          <circle cx="20" cy="12" r="10" fill="currentColor" className="text-indigo-900" />
        </svg>
      )}

      {/* Horizon line */}
      <div className="absolute bottom-8 left-0 right-0 h-px bg-white/20" />

      {/* Ground */}
      <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-[var(--color-bg)] to-transparent" />

      {/* Sun */}
      <svg
        className="absolute transition-all duration-1000 ease-in-out"
        style={{
          left: `calc(${sunX}% - 24px)`,
          top: `calc(${sunY}% - 24px)`,
          opacity: sunOpacity,
        }}
        width="48" height="48" viewBox="0 0 48 48"
      >
        {/* Glow */}
        <circle cx="24" cy="24" r="20" fill="#fbbf24" opacity="0.3">
          <animate attributeName="r" values="18;22;18" dur="3s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.2;0.4;0.2" dur="3s" repeatCount="indefinite" />
        </circle>
        {/* Sun body */}
        <circle cx="24" cy="24" r="12" fill="#fbbf24" />
        <circle cx="24" cy="24" r="10" fill="#fcd34d" />
        {/* Rays */}
        {Array.from({ length: 8 }).map((_, i) => (
          <line
            key={i}
            x1="24" y1="4" x2="24" y2="8"
            stroke="#fbbf24"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.6"
            transform={`rotate(${i * 45} 24 24)`}
          >
            <animate attributeName="opacity" values="0.4;0.8;0.4" dur="2s" begin={`${i * 0.25}s`} repeatCount="indefinite" />
          </line>
        ))}
      </svg>

      {/* Time greeting */}
      <div className="absolute bottom-10 left-0 right-0 text-center">
        <p className={`text-sm font-medium ${isNight ? 'text-white/70' : 'text-amber-900/60'}`}>
          {greeting}
        </p>
      </div>
    </div>
  );
}
