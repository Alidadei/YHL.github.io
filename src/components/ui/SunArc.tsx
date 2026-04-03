import { useState, useEffect } from 'react';

interface SunArcProps {
  lang: 'zh' | 'en';
}

export default function SunArc({ lang }: SunArcProps) {
  const [time, setTime] = useState({ hour: 12, min: 0 });

  useEffect(() => {
    const now = new Date();
    setTime({ hour: now.getHours(), min: now.getMinutes() });
    const timer = setInterval(() => {
      const n = new Date();
      setTime({ hour: n.getHours(), min: n.getMinutes() });
    }, 30000);
    return () => clearInterval(timer);
  }, []);

  const h = time.hour + time.min / 60;

  // Sun visible 5:30 ~ 18:30, arc from left to right
  const sunRise = 5.5;
  const sunSet = 18.5;
  const dayLen = sunSet - sunRise;
  const progress = (h - sunRise) / dayLen; // 0=sunrise, 1=sunset
  const isDay = h >= sunRise && h <= sunSet;
  const isNight = h >= 20 || h < 4.5;
  const isDusk = h >= sunSet && h < 20;
  const isDawn = h >= 4.5 && h < sunRise;

  // Sun position along a semicircular arc
  const sunX = 8 + progress * 84; // 8% to 92%
  const arcHeight = Math.sin(progress * Math.PI); // 0→1→0
  const sunY = 85 - arcHeight * 72; // bottom 85% up to top 13%

  // Sun altitude determines brightness
  const altitude = arcHeight; // 0 at horizon, 1 at noon

  // Sky gradient
  const skyStyle = (() => {
    if (isDay) {
      if (altitude > 0.6) {
        return 'linear-gradient(180deg, #1e3a5f 0%, #4a90c4 30%, #87ceeb 60%, #f0e6d3 100%)';
      }
      if (altitude > 0.2) {
        return 'linear-gradient(180deg, #2c4a6e 0%, #6a9fc4 25%, #e8b87a 60%, #f4a460 85%, #d4764e 100%)';
      }
      return 'linear-gradient(180deg, #3a4a6e 0%, #c47a4a 30%, #e88a50 50%, #d06030 75%, #8a3020 100%)';
    }
    if (isDusk) {
      const duskFade = (h - sunSet) / (20 - sunSet);
      return `linear-gradient(180deg, #1a1a3e ${duskFade * 60}%, #2a2a5a ${30 + duskFade * 30}%, #4a3060 ${50 + duskFade * 20}%, #1a1a2e 100%)`;
    }
    if (isDawn) {
      const dawnFade = (h - 4.5) / (sunRise - 4.5);
      return `linear-gradient(180deg, #1a1a3e ${100 - dawnFade * 60}%, #3a2a5a ${80 - dawnFade * 30}%, #8a4a3a ${60 - dawnFade * 20}%, #d4764e 100%)`;
    }
    return 'linear-gradient(180deg, #0a0a1e 0%, #111128 40%, #1a1a35 100%)';
  })();

  // Sun glow color
  const sunColor = altitude > 0.5 ? '#fff5d0' : altitude > 0.2 ? '#ffd080' : '#ff8030';
  const sunGlow = altitude > 0.5 ? 'rgba(255,245,208,0.15)' : altitude > 0.2 ? 'rgba(255,180,80,0.15)' : 'rgba(255,100,30,0.12)';

  // Greeting
  const greeting = lang === 'zh'
    ? (h < 6 ? '夜深了' : h < 12 ? '早上好' : h < 18 ? '下午好' : '晚上好')
    : (h < 6 ? 'Good Night' : h < 12 ? 'Good Morning' : h < 18 ? 'Good Afternoon' : 'Good Evening');

  return (
    <div
      className="relative w-full rounded-xl overflow-hidden transition-all duration-[2000ms] ease-in-out"
      style={{ height: '120px', background: skyStyle }}
    >
      {/* Stars */}
      {(isNight || isDusk || isDawn) && (
        <div className="absolute inset-0">
          {Array.from({ length: 15 }).map((_, i) => {
            const seed = i * 137.5;
            const starOpacity = isNight ? 0.6 + Math.random() * 0.4 : (isDusk ? Math.max(0, (h - sunSet) / 2) : Math.max(0, (sunRise - h) / 2)) * 0.5;
            return (
              <span
                key={i}
                className="absolute rounded-full bg-white"
                style={{
                  width: '1.5px',
                  height: '1.5px',
                  left: `${(seed * 7.3) % 95}%`,
                  top: `${(seed * 3.7) % 55}%`,
                  opacity: starOpacity,
                  animation: `pulse ${2 + (i % 3)}s ease-in-out infinite`,
                  animationDelay: `${(i * 0.3) % 3}s`,
                }}
              />
            );
          })}
        </div>
      )}

      {/* Moon */}
      {(isNight || isDusk) && (
        <svg
          className="absolute"
          style={{
            left: isNight ? `${65 + Math.sin(h * 0.3) * 10}%` : '85%',
            top: isNight ? '18%' : '30%',
            opacity: isNight ? 0.85 : Math.max(0, (h - sunSet - 0.5) * 0.5),
            transition: 'all 2s ease',
          }}
          width="20" height="20" viewBox="0 0 20 20"
        >
          <circle cx="10" cy="10" r="7" fill="#e8e0c8" opacity="0.9" />
          <circle cx="13" cy="8" r="6" fill="transparent" style={{ fill: skyStyle.includes('#0a0a1e') ? '#0a0a1e' : '#111128' }} />
        </svg>
      )}

      {/* Horizon */}
      <div className="absolute left-0 right-0" style={{ bottom: '20px', height: '1px', background: 'rgba(255,255,255,0.08)' }} />

      {/* Sun */}
      {isDay && (
        <>
          {/* Outer glow */}
          <div
            className="absolute rounded-full transition-all duration-[2000ms] ease-in-out"
            style={{
              width: '80px',
              height: '80px',
              left: `calc(${sunX}% - 40px)`,
              top: `calc(${sunY}% - 40px)`,
              background: `radial-gradient(circle, ${sunGlow} 0%, transparent 70%)`,
            }}
          />
          {/* Sun disc */}
          <div
            className="absolute rounded-full transition-all duration-[2000ms] ease-in-out"
            style={{
              width: '18px',
              height: '18px',
              left: `calc(${sunX}% - 9px)`,
              top: `calc(${sunY}% - 9px)`,
              background: `radial-gradient(circle at 40% 40%, ${sunColor}, ${altitude > 0.3 ? '#ffe090' : '#e07020'})`,
              boxShadow: `0 0 ${altitude > 0.5 ? 12 : 20}px ${altitude > 0.5 ? 'rgba(255,220,100,0.6)' : 'rgba(255,140,40,0.5)'}`,
            }}
          />
        </>
      )}

      {/* Ground fade */}
      <div
        className="absolute bottom-0 left-0 right-0"
        style={{ height: '20px', background: 'linear-gradient(transparent, var(--color-bg))' }}
      />

      {/* Greeting */}
      <div className="absolute left-0 right-0 text-center" style={{ bottom: '24px' }}>
        <p className="text-xs font-medium" style={{ color: isDay ? 'rgba(90,60,30,0.5)' : 'rgba(255,255,255,0.4)' }}>
          {greeting}
        </p>
      </div>
    </div>
  );
}
