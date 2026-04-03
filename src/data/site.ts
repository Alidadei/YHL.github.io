export const siteConfig = {
  name: '余泓麟 / Honglin Yu',
  title: 'About Honglin Yu',
  description: {
    zh: '余泓麟的个人网站 - 复旦大学医学人工智能博士研究生',
    en: 'Honglin Yu\'s personal website - Ph.D. student in Medical AI at Fudan University',
  },
  url: 'https://alidadei.github.io',
  author: {
    name: '余泓麟',
    nameEn: 'Honglin Yu',
    avatar: '/images/my_profile.png',
    bio: {
      zh: '复旦大学医学人工智能博士研究生',
      en: 'Ph.D. student in Medical AI at Fudan University',
    },
    location: 'Shenzhen / Shanghai, China',
    email: 'yuhl@stu.ouc.edu.cn',
    github: 'Alidadei',
    researchInterests: [
      'Deep Reinforcement Learning',
      'Large Language Models',
      'Intelligent Decision Making',
      'Human-Computer Interaction',
    ],
  },
  nav: {
    zh: [
      { label: '首页', href: '/zh/' },
      { label: '关于', href: '/zh/about/' },
      { label: '博客', href: '/zh/blog/' },
      { label: '项目', href: '/zh/projects/' },
      { label: '论文', href: '/zh/publications/' },
      { label: '简历', href: '/zh/cv/' },
      { label: '联系', href: '/zh/contact/' },
    ],
    en: [
      { label: 'Home', href: '/en/' },
      { label: 'About', href: '/en/about/' },
      { label: 'Blog', href: '/en/blog/' },
      { label: 'Projects', href: '/en/projects/' },
      { label: 'Publications', href: '/en/publications/' },
      { label: 'CV', href: '/en/cv/' },
      { label: 'Contact', href: '/en/contact/' },
    ],
  },
} as const;

export type Lang = 'zh' | 'en';
export const languages: Lang[] = ['zh', 'en'];
export const defaultLang: Lang = 'zh';
