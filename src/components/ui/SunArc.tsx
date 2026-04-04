import React, { useState, useEffect } from 'react';
import { Solar } from 'lunar-javascript';

interface SunArcProps {
  lang: 'zh' | 'en';
}

// 五行颜色映射
const wuxingColor: Record<string, string> = {
  // 木
  '甲': '#3d8b5a', '乙': '#3d8b5a', '寅': '#3d8b5a', '卯': '#3d8b5a',
  // 火
  '丙': '#c0392b', '丁': '#c0392b', '巳': '#c0392b', '午': '#c0392b',
  // 土
  '戊': '#9a7b4a', '己': '#9a7b4a', '辰': '#9a7b4a', '戌': '#9a7b4a', '丑': '#9a7b4a', '未': '#9a7b4a',
  // 金
  '庚': '#b8860b', '辛': '#b8860b', '申': '#b8860b', '酉': '#b8860b',
  // 水
  '壬': '#2874a6', '癸': '#2874a6', '亥': '#2874a6', '子': '#2874a6',
};

function getWuxingColor(char: string): string {
  return wuxingColor[char] || 'inherit';
}

function LunarDate({ lang }: { lang: 'zh' | 'en' }) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);

  const lunar = Solar.fromDate(new Date()).getLunar();
  const yearGZ = lunar.getYearInGanZhi(); // "丙午"
  const monthCN = lunar.getMonthInChinese(); // "二"
  const dayCN = lunar.getDayInChinese(); // "十七"
  const fullText = lang === 'zh'
    ? `${yearGZ}年 ${monthCN}月${dayCN}日`
    : `${yearGZ} Year ${monthCN} Month ${dayCN} Day`;

  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      i++;
      setDisplayed(fullText.slice(0, i));
      if (i >= fullText.length) {
        clearInterval(timer);
        setTimeout(() => setDone(true), 600);
      }
    }, 100);
    return () => clearInterval(timer);
  }, [fullText]);

  // Render each character with wuxing color if applicable
  const renderChars = (text: string) => {
    return text.split('').map((char, i) => (
      <span
        key={i}
        style={{
          color: wuxingColor[char] || 'inherit',
          fontWeight: wuxingColor[char] ? 600 : 400,
        }}
      >
        {char}
      </span>
    ));
  };

  return (
    <div className="text-center py-3 select-none" style={{ minHeight: '28px' }}>
      <p className="text-sm tracking-widest" style={{ color: 'var(--color-text-muted)' }}>
        {renderChars(displayed)}
        {!done && (
          <span
            className="inline-block ml-0.5"
            style={{
              animation: 'blink 0.8s step-end infinite',
              color: 'var(--color-accent)',
              fontWeight: 300,
            }}
          >
            |
          </span>
        )}
      </p>
    </div>
  );
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

  const sunRise = 5.5;
  const sunSet = 18.5;
  const progress = Math.max(0, Math.min(1, (h - sunRise) / (sunSet - sunRise)));
  const isDay = h >= sunRise && h <= sunSet;
  const isNight = h >= 20 || h < 4.5;
  const isDusk = h >= sunSet && h < 20;
  const isDawn = h >= 4.5 && h < sunRise;

  const arcHeight = Math.sin(progress * Math.PI);
  const sunX = 8 + progress * 84;
  const sunY = 90 - arcHeight * 75;
  const altitude = isDay ? arcHeight : 0;

  // Sky gradient
  const skyGradient = (() => {
    if (isDay) {
      if (altitude > 0.6) return 'linear-gradient(180deg, rgba(135,195,235,0.35) 0%, rgba(200,220,240,0.2) 50%, rgba(250,246,240,0) 100%)';
      if (altitude > 0.2) return 'linear-gradient(180deg, rgba(232,168,100,0.35) 0%, rgba(220,180,140,0.2) 50%, rgba(250,246,240,0) 100%)';
      return 'linear-gradient(180deg, rgba(210,120,60,0.4) 0%, rgba(200,140,80,0.25) 50%, rgba(250,246,240,0) 100%)';
    }
    if (isDusk) {
      const f = (h - sunSet) / (20 - sunSet);
      return `linear-gradient(180deg, rgba(60,40,80,${0.3*(1-f)}) 0%, rgba(40,30,60,${0.15*(1-f)}) 50%, rgba(250,246,240,0) 100%)`;
    }
    if (isDawn) {
      const f = (h - 4.5) / (sunRise - 4.5);
      return `linear-gradient(180deg, rgba(210,120,60,${0.3*f}) 0%, rgba(200,140,80,${0.15*f}) 50%, rgba(250,246,240,0) 100%)`;
    }
    return 'linear-gradient(180deg, rgba(15,15,40,0.25) 0%, rgba(20,20,50,0.1) 50%, rgba(250,246,240,0) 100%)';
  })();

  // Sun glow
  const sunCore = altitude > 0.5 ? '#fff5d0' : altitude > 0.2 ? '#ffd080' : '#ff8030';
  const glowColor = altitude > 0.5 ? 'rgba(255,240,180,0.25)' : 'rgba(255,140,40,0.2)';

  const greeting = lang === 'zh'
    ? (h < 6 ? '夜深了' : h < 12 ? '早上好' : h < 18 ? '下午好' : '晚上好')
    : (h < 6 ? 'Good Night' : h < 12 ? 'Good Morning' : h < 18 ? 'Good Afternoon' : 'Good Evening');

  return (
    <div className="relative w-full" style={{ height: '160px' }}>
      {/* Blurred sky layer */}
      <div
        className="absolute inset-0"
        style={{
          background: skyGradient,
          filter: 'blur(8px)',
          WebkitFilter: 'blur(8px)',
          opacity: 0.7,
          maskImage: 'linear-gradient(to bottom, black 40%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, black 40%, transparent 100%)',
        }}
      />

      {/* Stars at night */}
      {(isNight || isDusk || isDawn) && (
        <div className="absolute inset-0" style={{ opacity: isNight ? 0.5 : 0.2 }}>
          {Array.from({ length: 12 }).map((_, i) => {
            const seed = i * 137.5;
            return (
              <span
                key={i}
                className="absolute rounded-full bg-white"
                style={{
                  width: '1.5px',
                  height: '1.5px',
                  left: `${(seed * 7.3) % 90 + 5}%`,
                  top: `${(seed * 3.7) % 50 + 5}%`,
                  opacity: 0.4 + (i % 3) * 0.15,
                  animation: `pulse ${2 + (i % 3)}s ease-in-out infinite`,
                  animationDelay: `${(i * 0.4) % 3}s`,
                }}
              />
            );
          })}
        </div>
      )}

      {/* Moon */}
      {(isNight || isDusk) && (
        <div
          className="absolute transition-all duration-[2000ms]"
          style={{
            left: `${isNight ? 70 : 85}%`,
            top: '15%',
            opacity: isNight ? 0.7 : Math.min(0.5, (h - sunSet)),
          }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16">
            <circle cx="8" cy="8" r="5.5" fill="#e8dcc0" opacity="0.8" />
            <circle cx="11" cy="6" r="4.5" fill="var(--color-bg)" />
          </svg>
        </div>
      )}

      {/* Sun glow */}
      {isDay && (
        <div
          className="absolute rounded-full transition-all duration-[2000ms]"
          style={{
            width: '50px',
            height: '50px',
            left: `calc(${sunX}% - 25px)`,
            top: `calc(${sunY}% - 25px)`,
            background: `radial-gradient(circle, ${glowColor} 0%, transparent 70%)`,
          }}
        />
      )}

      {/* Sun disc */}
      {isDay && (
        <div
          className="absolute rounded-full transition-all duration-[2000ms]"
          style={{
            width: '14px',
            height: '14px',
            left: `calc(${sunX}% - 7px)`,
            top: `calc(${sunY}% - 7px)`,
            background: `radial-gradient(circle at 35% 35%, ${sunCore}, ${altitude > 0.3 ? '#ffe090' : '#d06020'})`,
            boxShadow: `0 0 ${altitude > 0.5 ? 10 : 16}px ${altitude > 0.5 ? 'rgba(255,220,100,0.5)' : 'rgba(255,140,40,0.4)'}`,
          }}
        />
      )}

      {/* Greeting - top left, subtle */}
      <div className="absolute top-2 left-3">
        <p className="text-xs" style={{ color: 'var(--color-text-muted)', opacity: 0.5 }}>
          {greeting}
        </p>
      </div>

      {/* Bottom content area */}
      <div className="absolute bottom-0 left-0 right-0">
        <LunarDate lang={lang} />
      </div>

      {/* Blink cursor animation */}
      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}
