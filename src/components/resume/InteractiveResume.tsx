import { useState } from 'react';

interface InteractiveResumeProps {
  lang: 'zh' | 'en';
}

const sections = {
  zh: [
    { id: 'education', title: '教育经历', icon: '🎓' },
    { id: 'research', title: '研究经历', icon: '🔬' },
    { id: 'skills', title: '专业技能', icon: '💻' },
    { id: 'awards', title: '获奖荣誉', icon: '🎖' },
  ],
  en: [
    { id: 'education', title: 'Education', icon: '🎓' },
    { id: 'research', title: 'Research', icon: '🔬' },
    { id: 'skills', title: 'Skills', icon: '💻' },
    { id: 'awards', title: 'Awards', icon: '🎖' },
  ],
};

const labels = {
  zh: { export: '导出 PDF', collapse: '全部收起', expand: '全部展开' },
  en: { export: 'Export PDF', collapse: 'Collapse all', expand: 'Expand all' },
};

export default function InteractiveResume({ lang }: InteractiveResumeProps) {
  const s = sections[lang];
  const t = labels[lang];
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  const toggle = (id: string) => {
    setCollapsed((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleAll = () => {
    const allCollapsed = s.every((sec) => collapsed[sec.id]);
    const newState: Record<string, boolean> = {};
    s.forEach((sec) => { newState[sec.id] = !allCollapsed; });
    setCollapsed(newState);
  };

  const exportPdf = () => {
    // Expand all sections before printing
    const newState: Record<string, boolean> = {};
    s.forEach((sec) => { newState[sec.id] = false; });
    setCollapsed(newState);
    setTimeout(() => window.print(), 200);
  };

  return (
    <div>
      <div className="flex gap-2 mb-6">
        <button
          onClick={exportPdf}
          className="px-4 py-2 text-sm rounded-lg bg-primary text-white hover:bg-primary-light transition-colors"
        >
          📄 {t.export}
        </button>
        <button
          onClick={toggleAll}
          className="px-4 py-2 text-sm rounded-lg border border-border text-text-secondary hover:bg-bg-tertiary transition-colors"
        >
          {s.every((sec) => collapsed[sec.id]) ? t.expand : t.collapse}
        </button>
      </div>

      <div className="space-y-4">
        {s.map((sec) => (
          <div key={sec.id} className="border border-border rounded-lg overflow-hidden">
            <button
              onClick={() => toggle(sec.id)}
              className="w-full flex items-center justify-between p-4 hover:bg-bg-secondary transition-colors text-left"
            >
              <span className="flex items-center gap-2">
                <span>{sec.icon}</span>
                <span className="font-semibold text-primary">{sec.title}</span>
              </span>
              <span className={`text-text-muted transition-transform ${collapsed[sec.id] ? '' : 'rotate-180'}`}>
                ▼
              </span>
            </button>
            <div className={`transition-all ${collapsed[sec.id] ? 'max-h-0 overflow-hidden' : 'max-h-[2000px]'}`}>
              <div className="p-4 pt-0" id={`resume-${sec.id}`}>
                {/* Content is rendered by Astro slot */}
                <slot name={sec.id} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
