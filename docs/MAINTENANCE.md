# 网站维护指南

## 目录结构

```
YHL.github.io-v2/
├── src/
│   ├── content/           ← 所有内容在这里
│   │   ├── posts/zh/      ← 中文博客文章（Markdown）
│   │   ├── posts/en/      ← 英文博客文章（可选）
│   │   ├── publications/  ← 论文列表
│   │   ├── talks/         ← 演讲/报告
│   │   ├── teaching/      ← 教学经历
│   │   ├── portfolio/     ← 作品集
│   │   └── projects/      ← 项目展示（目前为空）
│   ├── data/
│   │   └── site.ts        ← 站点信息（姓名、邮箱、研究方向等）
│   ├── i18n/
│   │   └── ui.ts          ← 中英文 UI 翻译
│   ├── pages/             ← 页面模板（一般不需要改）
│   ├── components/        ← 交互组件（一般不需要改）
│   └── styles/
│       └── global.css     ← 全局样式和配色
├── public/
│   ├── images/            ← 图片资源
│   └── files/             ← PDF 等文件
├── docs/                  ← 文档（本文件）
└── .github/workflows/
    └── deploy.yml         ← 自动部署配置
```

---

## 常见操作

### 1. 新增博客文章

在 `src/content/posts/zh/` 下新建 `.md` 文件：

```markdown
---
title: 文章标题
description: 文章摘要
date: 2026-04-03
tags: [标签1, 标签2]
lang: zh
draft: false
---

正文内容，支持标准 Markdown 语法。

## 二级标题

代码块、图片、链接等都支持。
```

英文文章放 `src/content/posts/en/`，将 `lang` 改为 `en`。

### 2. 新增论文（Publication）

在 `src/content/publications/` 下新建 `.md` 文件：

```markdown
---
title: "论文标题"
authors: [作者1, 作者2]
pub: "期刊/会议名称"
year: 2026
category: journal    # journal / conference / preprint
link: https://doi.org/xxx
pdf: /files/paper.pdf
---
```

### 3. 新增演讲（Talk）

在 `src/content/talks/` 下新建 `.md` 文件：

```markdown
---
title: "演讲标题"
event: "活动名称"
date: 2026-04-03
location: "地点"
link: /files/slides.pdf
type: talk    # talk / tutorial
---
```

### 4. 新增项目（Project）

在 `src/content/projects/` 下新建 `.md` 文件：

```markdown
---
title: 项目名称
description: 项目简介
tags: [标签1, 标签2]
github: https://github.com/xxx
demo: https://xxx.vercel.app
featured: true
lang: zh
---

项目详细描述...
```

### 5. 新增教学经历（Teaching）

在 `src/content/teaching/` 下新建 `.md` 文件：

```markdown
---
title: "课程名称"
role: "助教"
semester: "2026 春季"
department: "院系"
---
```

### 6. 修改个人信息

编辑 `src/data/site.ts`：

- 姓名、邮箱、GitHub
- 研究方向
- 个人简介
- 导航菜单

### 7. 修改 UI 文字翻译

编辑 `src/i18n/ui.ts`，修改对应的中英文字符串。

### 8. 修改配色

编辑 `src/styles/global.css` 中的 `@theme` 部分：

```css
@theme {
  --color-primary: #5b4636;        /* 主色 */
  --color-accent: #b07d4f;         /* 强调色 */
  --color-bg: #faf6f0;             /* 背景色 */
  --color-text: #3a2e24;           /* 文字色 */
  /* ... */
}
```

### 9. 添加图片

将图片放入 `public/images/` 目录，在 Markdown 中引用：

```markdown
![图片描述](/images/filename.jpg)
```

> 注意：文件名避免使用中文，建议用小写英文 + 连字符。

---

## 部署流程

1. 本地修改后提交：`git add . && git commit -m "说明"`
2. 推送到 GitHub：`git push origin astro-v2`
3. 合并到 master 后 GitHub Actions 自动构建部署

### 本地预览

```bash
npm run dev       # 开发服务器（热更新）
npm run build     # 构建
npm run preview   # 预览构建结果
```

---

## Content Collections 字段参考

| 集合 | 必填字段 | 可选字段 |
|------|----------|----------|
| posts | title, date, lang, tags | description, draft |
| publications | title, authors, year, category | pub, link, pdf |
| talks | title, date | event, location, link, type |
| teaching | title, semester | role, department |
| projects | title, description, lang | tags, github, demo, featured |
| portfolio | title, description | order, image, link |
