import { useState } from 'react';

interface InteractiveResumeProps {
  lang: 'zh' | 'en';
}

const sectionDefs = {
  zh: [
    { id: 'education', title: '教育经历', icon: '🎓' },
    { id: 'internship', title: '实习经历', icon: '💼' },
    { id: 'research', title: '研究经历', icon: '🔬' },
    { id: 'skills', title: '专业技能', icon: '💻' },
    { id: 'awards', title: '获奖荣誉', icon: '🎖' },
  ],
  en: [
    { id: 'education', title: 'Education', icon: '🎓' },
    { id: 'internship', title: 'Internship', icon: '💼' },
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
  const s = sectionDefs[lang];
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
    const newState: Record<string, boolean> = {};
    s.forEach((sec) => { newState[sec.id] = false; });
    setCollapsed(newState);
    setTimeout(() => window.print(), 200);
  };

  const renderContent = (id: string) => {
    if (id === 'education') return <Education lang={lang} />;
    if (id === 'internship') return <Internship lang={lang} />;
    if (id === 'research') return <Research lang={lang} />;
    if (id === 'skills') return <Skills lang={lang} />;
    if (id === 'awards') return <Awards lang={lang} />;
    return null;
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
              <span className={`text-text-muted transition-transform duration-200 ${collapsed[sec.id] ? '' : 'rotate-180'}`}>
                ▼
              </span>
            </button>
            <div className={`overflow-hidden transition-all duration-300 ${collapsed[sec.id] ? 'max-h-0' : 'max-h-[3000px]'}`}>
              <div className="p-4 pt-0">
                {renderContent(sec.id)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Education({ lang }: { lang: 'zh' | 'en' }) {
  const items = lang === 'zh' ? [
    { period: '2024 - 至今', text: '复旦大学 · 医学人工智能博士研究生' },
    { period: '2021 - 2025', text: '中国海洋大学 · 电子工程学院 · 书法协会干事、自强社志愿者' },
    { period: '2018 - 2021', text: '深圳外国语学校高中部' },
    { period: '2015 - 2018', text: '深圳外国语学校初中部' },
  ] : [
    { period: '2024 - Present', text: 'Fudan University — Ph.D. in Medical AI' },
    { period: '2021 - 2025', text: 'Ocean University of China — Electronic Engineering' },
    { period: '2018 - 2021', text: 'Senior High School of Shenzhen Foreign Language School' },
    { period: '2015 - 2018', text: 'Junior High School of Shenzhen Foreign Language School' },
  ];
  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div key={item.period} className="border-l-4 border-accent pl-4">
          <h3 className="font-bold text-lg text-primary">{item.period}</h3>
          <p className="text-text-secondary">{item.text}</p>
        </div>
      ))}
    </div>
  );
}

function Internship({ lang }: { lang: 'zh' | 'en' }) {
  const placeholder = lang === 'zh'
    ? { company: '公司名称', period: '20XX.XX - 20XX.XX', role: '职位/岗位', desc: '工作职责和成果描述...' }
    : { company: 'Company Name', period: '20XX.XX - 20XX.XX', role: 'Position / Role', desc: 'Job responsibilities and achievements...' };

  return (
    <div className="space-y-6">
      <div className="border-l-4 border-accent pl-4">
        <div className="flex items-baseline justify-between flex-wrap gap-2">
          <h3 className="font-bold text-lg text-primary">{placeholder.company}</h3>
          <span className="text-sm text-text-muted">{placeholder.role}</span>
        </div>
        <p className="text-sm text-text-muted mb-2">{placeholder.period}</p>
        <p className="text-text-secondary">{placeholder.desc}</p>
      </div>
    </div>
  );
}

function Research({ lang }: { lang: 'zh' | 'en' }) {
  const items = lang === 'zh' ? [
    {
      title: '"智能自主系统"课题组',
      role: '核心成员',
      period: '2023.8 - 2024.8',
      desc: '参与"结合大语言模型和强化学习的机器人学习方法"文献调研，初步形成综述文章。同时参与"基于大语言模型的社交机器人Haru的自主行为学习方法"项目，完成ROS环境搭建和Gazebo仿真实验。',
    },
    {
      title: '校级大创：基于 STM32 的智能桌面系统',
      role: '负责人',
      period: '2022.11 - 2023.11',
      desc: '主持校级大创项目，设计多功能人机交互书桌系统。用Keil C编写控制框架，利用哈希思想和函数指针优化语音控制轮询过程。',
    },
  ] : [
    {
      title: '"Intelligent Autonomous Systems" Research Group',
      role: 'Core Member',
      period: '2023.8 - 2024.8',
      desc: 'Engaged in literature research on "Robot Learning Methods Combining LLMs and RL". Participated in the "Autonomous Behavioral Learning for Social Robot Haru" project, setting up ROS environment and conducting Gazebo simulations.',
    },
    {
      title: 'Innovation Project: STM32 Intelligent Desktop System',
      role: 'Project Leader',
      period: '2022.11 - 2023.11',
      desc: 'Led the project to design a multifunctional human-computer interaction desk system. Used Keil C for the control framework, optimizing voice control polling with hash thinking and function pointers.',
    },
  ];

  return (
    <div className="space-y-6">
      {items.map((item) => (
        <div key={item.title} className="border-l-4 border-accent pl-4">
          <div className="flex items-baseline justify-between flex-wrap gap-2">
            <h3 className="font-bold text-lg text-primary">{item.title}</h3>
            <span className="text-sm text-text-muted">{item.role}</span>
          </div>
          <p className="text-sm text-text-muted mb-2">{item.period}</p>
          <p className="text-text-secondary">{item.desc}</p>
        </div>
      ))}
    </div>
  );
}

function Skills({ lang }: { lang: 'zh' | 'en' }) {
  const groups = lang === 'zh' ? [
    { title: '编程技能', items: ['C', 'C++', 'Matlab', 'Python', 'Verilog'] },
    { title: '科研技能', items: ['LaTeX', 'Gazebo', 'Simulink', 'ROS', 'Git'] },
    { title: '通用技能', items: ['Office', 'CET-6: 622', 'CET-4: 657', '普通话二甲'] },
  ] : [
    { title: 'Programming', items: ['C', 'C++', 'Matlab', 'Python', 'Verilog'] },
    { title: 'Research', items: ['LaTeX', 'Gazebo', 'Simulink', 'ROS', 'Git'] },
    { title: 'General', items: ['Office', 'CET-6: 622', 'CET-4: 657', 'Putonghua 2A'] },
  ];

  return (
    <div className="grid md:grid-cols-3 gap-6">
      {groups.map((g) => (
        <div key={g.title} className="p-4 rounded-lg bg-bg-secondary">
          <h3 className="font-semibold text-primary mb-3">{g.title}</h3>
          <div className="flex flex-wrap gap-2">
            {g.items.map((s) => (
              <span key={s} className="px-2 py-1 text-sm rounded bg-bg-tertiary text-text-secondary">{s}</span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function Awards({ lang }: { lang: 'zh' | 'en' }) {
  const awards = lang === 'zh' ? [
    { title: '二等奖学金', desc: '中国海洋大学' },
    { title: '优秀学生称号', desc: '中国海洋大学' },
    { title: '全国英语阅读比赛一等奖', desc: '' },
    { title: '全国大学生商务英语竞赛二等奖', desc: '2023' },
    { title: '山东省机器人大赛三等奖', desc: '' },
    { title: '蓝桥杯电子赛省奖', desc: '第十四届' },
    { title: '华为HSD证书', desc: '' },
    { title: '美赛S奖', desc: 'MCM/ICM' },
  ] : [
    { title: 'Second-Class Scholarship', desc: 'Ocean University of China' },
    { title: 'Outstanding Student', desc: 'Ocean University of China' },
    { title: 'National English Reading Competition - First Prize', desc: '' },
    { title: 'Business English Competition - Second Prize', desc: '2023' },
    { title: 'Robot Competition - Third Prize (Shandong)', desc: '' },
    { title: 'Lanqiao Cup Electronic Competition - Provincial Award', desc: '14th' },
    { title: 'Huawei HSD Certificate', desc: '' },
    { title: 'MCM/ICM - S Award', desc: '' },
  ];

  return (
    <div className="space-y-3">
      {awards.map((award) => (
        <div key={award.title} className="flex items-center gap-3 p-3 rounded-lg border border-border">
          <span className="text-lg">🎖</span>
          <div>
            <p className="font-medium text-primary">{award.title}</p>
            {award.desc && <p className="text-sm text-text-muted">{award.desc}</p>}
          </div>
        </div>
      ))}
    </div>
  );
}
