# Project Guide (ZH-CN): YHL.github.io

本仓库是一个基于 **Jekyll** 的静态站点，用于在 **GitHub Pages** 上发布个人学术主页（基于 Academic Pages 模板，底层主题风格来自 Minimal Mistakes）。

## 1. 站点概览

- 站点全局配置入口: `_config.yml`
- 首页入口: `_pages/about.md`（front matter 中 `permalink: /`）
- 顶部导航配置: `_data/navigation.yml`
- 页面布局/组件: `_layouts/` + `_includes/`
- 样式与资源: `_sass/` + `assets/` + `images/` + `files/`

当前 `_config.yml` 配置的站点地址:

- `url: https://alidadei.github.io/YHL.github.io/`
- `baseurl: ""`

提示: 如果你使用的是 GitHub Pages 的 Project Pages 形式 `https://<user>.github.io/<repo>/`，更常见的写法是:

- `url: https://<user>.github.io`
- `baseurl: "/<repo>"`

## 2. 技术栈与构建方式

- 静态站点生成: Jekyll (Ruby) + Liquid 模板
- Markdown 渲染: kramdown
- 代码高亮: rouge
- CSS: SCSS（`assets/css/main.scss` 引入 `_sass/` 中的模块并由 Jekyll 编译）
- JavaScript: jQuery + 一组插件 + 站点脚本（源文件 `assets/js/_main.js`）
  - 最终打包压缩为 `assets/js/main.min.js`（站点实际加载该文件，见 `_includes/scripts.html`）
- 部署: GitHub Pages
  - 本仓库未提供自定义工作流 `.github/workflows/*`，通常依赖 GitHub Pages 的默认构建/部署流程

## 3. 本地运行与构建

### 3.1 环境依赖

- Ruby + Bundler（用于运行 Jekyll）
- Node.js + npm（仅在需要重新打包 `assets/js/main.min.js` 时需要）

### 3.2 安装依赖

在仓库根目录执行:

```bash
bundle install
```

如果你需要重新打包 JS:

```bash
npm install
```

### 3.3 本地预览

```bash
bundle exec jekyll serve -l -H localhost
```

默认访问地址一般为 `http://localhost:4000/`。

### 3.4 生成静态产物

```bash
bundle exec jekyll build
```

产物会输出到 `_site/`（通常不提交到 Git）。

## 4. 目录结构说明

### 4.1 内容与数据

- `_pages/`: 独立页面
  - 首页/关于页: `_pages/about.md`（permalink 设为 `/`）
  - 简历页: `_pages/cv.md`（permalink: `/cv/`）
  - 列表页: `_pages/publications.html`、`_pages/talks.html`、`_pages/portfolio.html`、`_pages/teaching.html`
  - 归档页: `year-archive.html`、`category-archive.html`、`tag-archive.html` 等
- `_posts/`: 博客文章（文件名通常为 `YYYY-MM-DD-title.md`）
  - 注意: `_config.yml` 中 `future: false`，未来日期的文章默认不会被构建出来
- `_publications/`: Publications 集合内容（每篇论文一个 Markdown）
- `_talks/`: Talks 集合内容（每个 talk 一个 Markdown）
- `_teaching/`: Teaching 集合内容
- `_portfolio/`: Portfolio 集合内容
- `_drafts/`: 草稿文章（默认不发布）
- `_data/`: YAML 数据文件
  - `_data/navigation.yml`: 站点顶部导航链接
  - `_data/ui-text.yml`: UI 文案/国际化文本
  - `_data/comments/`: 评论数据（如果启用相关功能）

### 4.2 主题与样式

- `_layouts/`: 页面布局模板（例如 `default.html`、`single.html`、`talk.html`）
- `_includes/`: 可复用的页面片段（header/footer/sidebar 等）
- `_sass/`: SCSS 模块（被 `assets/css/main.scss` 引入编译）
- `assets/`: 静态资源
  - `assets/css/`: 站点样式入口与少量独立样式
  - `assets/js/`: 脚本入口与打包后的 `main.min.js`
  - `assets/fonts/`、`assets/webfonts/`: 字体/图标资源

### 4.3 站点资源

- `images/`: 站点图片（头像 `my_profile.png` 等）
- `files/`: 下载文件（PDF、slides 等，站点上可通过 `/files/<filename>` 访问）

### 4.4 辅助工具

- `markdown_generator/`: 将结构化数据自动生成 Markdown 的工具
  - `publications.py` + `publications.tsv`: 生成 `_publications/*.md`
  - `talks.py` + `talks.tsv`: 生成 `_talks/*.md`
  - `pubsFromBib.py`: 从 bibtex 生成 publications 的另一条路径（需要 pybtex）
- `talkmap/` + `talkmap.py` + `talkmap.ipynb`: 生成 talks 地图
- `docs/c4-architecture.md`: C4 架构图文档（Mermaid）

## 5. 常见内容维护点

### 5.1 修改个人信息/侧边栏

主要在 `_config.yml` 的 `author:` 段落中配置（头像在 `images/` 目录）。

### 5.2 修改顶部导航

编辑 `_data/navigation.yml` 的 `main:` 列表即可控制 header 导航的显示与顺序。

### 5.3 新增一篇博客文章

在 `_posts/` 新建文件，例如:

- `_posts/2026-03-13-my-post.md`

并添加 YAML front matter。站点对 posts 的默认值在 `_config.yml` 的 `defaults` 中配置（如 `layout: single`、`author_profile: true`）。

### 5.4 新增 publications/talks/teaching/portfolio

这些内容是 Jekyll 的 collections，在 `_config.yml` 中已声明并配置了 permalink。

- Publications 列表页: `_pages/publications.html` 会按类别渲染 `_publications/` 内容
- Talks 列表页: `_pages/talks.html` 会渲染 `_talks/` 内容
- Portfolio 列表页: `_pages/portfolio.html` 会渲染 `_portfolio/` 内容
- Teaching 列表页: `_pages/teaching.html` 会渲染 `_teaching/` 内容

建议保持文件名为无空格的英文/数字组合，避免 URL 里出现空格带来的转义问题。

## 6. 自动生成工具

### 6.1 publications 生成（TSV）

在 `markdown_generator/` 下运行 `publications.py` 会读取 `publications.tsv` 并写入 `../_publications/`。

`publications.tsv` 需要包含列（见脚本注释）:

- `pub_date`（YYYY-MM-DD）
- `title`
- `venue`
- `excerpt`（可空）
- `citation`
- `site_url`
- `paper_url`（可空）
- `url_slug`

### 6.2 talks 生成（TSV）

在 `markdown_generator/` 下运行 `talks.py` 会读取 `talks.tsv` 并写入 `../_talks/`。

`talks.tsv` 需要包含列（见脚本注释）:

- `title`（必填）
- `type`（可空，默认 Talk）
- `url_slug`（必填）
- `venue`（可空）
- `date`（YYYY-MM-DD，必填）
- `location`（可空，但用于 talkmap 时建议填写）
- `talk_url`（可空）
- `description`（可空）

## 7. Talk Map（演讲地图）

- 页面入口: `_pages/talkmap.html`（通过 iframe 引用 `talkmap/map.html`）
- 生成方式: 在 `_talks/` 目录运行根目录下的 `talkmap.py`（脚本注释要求在 `_talks/` 下运行）
  - 它会读取每个 talk 的 front matter 中的 `location: "..."` 字段
  - 使用 geopy/Nominatim 做地理编码，然后输出到 `talkmap/` 目录

## 8. 前端资源打包（JS）

本项目在 `_includes/scripts.html` 中只加载 `assets/js/main.min.js`。

当你修改了 `assets/js/_main.js` 或插件脚本后，可以重新打包:

```bash
npm install
npm run build:js
```

可选: 监听构建

```bash
npm run watch:js
```

## 9. 常见排错清单

- 页面路径/资源 404: 优先检查 `_config.yml` 的 `url` / `baseurl` 配置是否符合你的 GitHub Pages 站点类型
- 文章没显示: 检查日期是否在未来（本项目 `future: false`）
- 日期/归档不符合预期: 检查 `_config.yml` 的 `timezone`
- 中文乱码: 检查文件编码是否为 UTF-8（建议统一使用 UTF-8）
