# PROJECT_GUIDE.md — 个人网站项目指南

> 面向不熟悉网页开发的读者。读完这份文档，你应该能回答：
> 这个项目由什么组成、内容放在哪、改哪里安全、怎么在本地看效果、怎么发布、出错了怎么办。
>
> 项目：`E:\zbk\job\myWebsite`｜模板：AstroPaper v7.2.0｜框架：Astro 7.4.8｜Node ≥ 22.23.4
> 本文档只做说明，未改动任何代码、配置或样式。

---

## 0. 先建立三个概念

**① 静态网站**
这个网站不是"服务器 + 数据库"跑出来的动态程序，而是在你自己电脑上**提前生成好一堆 HTML 文件**，再原样放到网上。访问者拿到的是已经做好的页面，所以速度快、不用维护服务器。

**② Astro**
负责"把源文件变成 HTML"的构建工具。你用 Markdown 写文章，Astro 读取它、套上模板、生成 `文章标题/index.html`。

**③ AstroPaper**
别人写好的一套 Astro 模板（主题），提供了导航栏、文章列表、暗色模式、搜索等现成功能。你现在看到的所有页面外观都是它给的默认样式。

一句话：**Astro 是发动机，AstroPaper 是车身，Markdown 是汽油。**

---

## 1. 项目架构

### 1.1 数据流（从你写的一个字，到浏览器里的页面）

```
src/content/posts/xxx.md          ← 你写的 Markdown + 开头的一段"属性"（frontmatter）
        │
        │  build 时被读取（astro:content 内容集合，按 content.config.ts 校验字段）
        ▼
src/pages/posts/[...slug]/index.astro   ← 决定"文章页长什么样"
        │  套用 src/layouts/PostLayout.astro → Layout.astro
        │  内部再拼装 Header / Footer / Card / Tag / TOC 等组件
        ▼
dist/posts/xxx/index.html          ← 生成的静态 HTML
        │
        ▼
浏览器 / 托管平台（以后是 Cloudflare Pages）
```

关键点：**页面不是"存"出来的，是"算"出来的**。同一篇文章，改了 Markdown，重新生成，HTML 就变了。

### 1.2 分层

| 层 | 位置 | 作用 | 你以后会不会碰 |
|---|---|---|---|
| 内容层 | `src/content/` | Markdown 文章与页面 | **会，最常碰** |
| 模板层 | `src/pages/`、`src/layouts/`、`src/components/` | 页面结构、布局、可复用块 | 改首页/导航时会碰 |
| 样式层 | `src/styles/` + 各组件内的 Tailwind 类 | 颜色、字体、间距 | 定制视觉时碰 |
| 配置层 | `astro-paper.config.ts`、`astro.config.ts` | 站点信息、功能开关 | **会，第二常碰** |

---

## 2. 目录说明

```
myWebsite/
├─ src/                        源码目录（日常都在这里工作）
│  ├─ content/                 内容
│  │  ├─ posts/                所有文章（.md / .mdx）
│  │  │  ├─ _releases/         模板自带：版本发布说明（下划线开头，不参与构建）
│  │  │  ├─ _color-schemes/    模板自带：配色说明（不参与构建）
│  │  │  └─ examples/          模板自带：示例文章（会参与构建，上线前要删）
│  │  └─ pages/about.md        "关于"页的正文
│  ├─ pages/                   路由：每个文件对应一个网址
│  │  ├─ index.astro           首页（含 Mingalaba 那句）
│  │  ├─ about.astro           关于页外壳（正文来自 content/pages/about.md）
│  │  ├─ search.astro          搜索页（Pagefind UI）
│  │  ├─ archives/index.astro  归档页
│  │  ├─ tags/                 标签列表页 + 单个标签页
│  │  ├─ posts/[...page].astro 文章列表（分页）
│  │  ├─ posts/[...slug]/      单篇文章页（含目录、分享、上下篇、回到顶部）
│  │  ├─ rss.xml.ts            RSS 订阅源 /rss.xml
│  │  ├─ robots.txt.ts         自动生成的 robots.txt
│  │  ├─ og.png.ts             默认社交分享图
│  │  └─ 404.astro             404 页面
│  ├─ layouts/                 页面骨架
│  │  ├─ Layout.astro          全站基础布局（<head>、字体、主题脚本、View Transitions）
│  │  └─ PostLayout.astro      文章页布局（加 article 类元信息与 JSON-LD）
│  ├─ components/              可复用组件（Header、Footer、Card、Tag、分页……）
│  ├─ custom/                  ★ 留给你的三个插槽：Head / BodyEnd / PostEnd
│  ├─ i18n/                    界面文案（目前只有英文：lang/en.ts）
│  ├─ styles/                  全局样式：global.css / theme.css / typography.css
│  ├─ utils/                   工具函数（排序、过滤、slug、目录树……）
│  ├─ assets/                  图标与图片（会被 Astro 优化）
│  ├─ config.ts                ★ 把用户配置套上默认值（不要改）
│  ├─ content.config.ts        内容字段规则（frontmatter 校验）
│  └─ types/config.ts          配置项的类型定义（等于配置说明书）
├─ public/                     原样拷贝到网站根目录的静态文件
│  ├─ favicon.svg              站点图标
│  ├─ default-og.jpg           默认分享图
│  └─ pagefind/                搜索索引（构建时自动生成，已被 .gitignore 忽略）
├─ astro-paper.config.ts       ★ 站点主配置（标题、作者、功能开关、社交链接）
├─ astro.config.ts             构建配置（集成、i18n、字体、Markdown 管线）
├─ package.json                依赖与命令
├─ pnpm-lock.yaml              依赖锁定文件（保证任何机器装出同样版本）
├─ pnpm-workspace.yaml         pnpm 工作区设置（已允许 sharp/esbuild 跑构建脚本）
├─ tsconfig.json               TypeScript 配置（`@/` 指向 src/）
├─ .vscode/                    编辑器推荐扩展
├─ .github/                    模板自带的 CI 与 issue 模板（个人项目可不管）
└─ node_modules/               依赖（自动生成，不要手动改）
```

---

## 3. 核心配置文件

### 3.1 `astro-paper.config.ts` —— 你最该改的文件

目前内容（全部是模板默认值，还没个性化）：

| 字段 | 现值 | 含义 | 建议 |
|---|---|---|---|
| `site.url` | `https://astro-paper.pages.dev/` | 网站正式地址 | **必须改**，否则 RSS/分享图/站点地图链接全错 |
| `site.title` | `AstroPaper` | 站点名（页头显示） | 改成你的站名 |
| `site.description` | 模板描述 | 站点简介（SEO、RSS 用） | 改 |
| `site.author` | `Sat Naing` | 默认作者名 | 改成你 |
| `site.profile` | `https://satna.ing` | 作者主页（结构化数据用） | 改 |
| `site.ogImage` | `default-og.jpg` | 默认分享图（在 public/ 下） | 可换 |
| `site.lang` | `en` | HTML 语言属性 | 中文站建议 `zh-CN` |
| `site.timezone` | `Asia/Bangkok` | 文章时间的时区 | **改 `Asia/Shanghai`** |
| `site.dir` | `ltr` | 文字方向 | 不动 |
| `posts.perPage` | 4 | 列表页每页文章数 | 按喜好 |
| `posts.perIndex` | 4 | 首页"最近文章"条数 | 按喜好 |
| `features.lightAndDarkMode` | true | 暗色模式开关 | 保留 |
| `features.dynamicOgImage` | true | 每篇文章自动生成分享图 | 保留 |
| `features.showArchives` | true | 归档页 | 保留 |
| `features.showBackButton` | true | 文章页返回按钮 | 保留 |
| `features.editPost` | 指向 AstroPaper 仓库 | 文章页"编辑此页"链接 | **建议先关掉**（`{ enabled: false }`），否则读者点进去是别人的仓库 |
| `features.search` | `"pagefind"` | 搜索实现 | 保留 |
| `features.toc` | true | 文章目录 | 保留 |
| `socials` | 4 个示例链接 | 页头/页脚社交图标 | 换成你的（`name` 必须是 `src/assets/icons/socials/` 里存在的文件名） |
| `shareLinks` | 6 个分享平台 | 文章页分享按钮 | 可精简 |

### 3.2 `astro.config.ts` —— 构建层配置

已启用：MDX、sitemap、i18n（只有 `en`）、Markdown 增强（标题锚点、callout、表格包装、页内目录）、Shiki 代码高亮、Tailwind、Google Fonts（Google Sans Code）、SVG 优化。

日常不需要动。以后可能动的三处：`i18n.locales`（加中文）、`fonts`（换成本地字体，摆脱联网）、`site`（会自动跟随 `astro-paper.config.ts` 里的 url）。

### 3.3 其他配置文件

| 文件 | 作用 | 要不要改 |
|---|---|---|
| `src/content.config.ts` | 定义文章有哪些字段、必填与否 | 只有想加新字段（如 `category`）时才改 |
| `src/types/config.ts` | 配置类型定义，等于"配置说明书" | 不改，但值得读，注释很清楚 |
| `src/config.ts` | 把用户配置补上默认值 | 不改 |
| `package.json` | 依赖与命令 | 只通过 `pnpm add` 间接改 |
| `pnpm-lock.yaml` | 依赖版本锁 | 不手动改 |
| `tsconfig.json` | `@/` 别名指向 `src/` | 不改 |
| `.vscode/extensions.json` | 推荐装 Astro / Prettier / Tailwind / ESLint 扩展 | 可装，不必改 |

---

## 4. 内容编辑方法

### 4.1 写一篇新文章

在 `src/content/posts/` 下新建文件，例如 `signal-and-system-01.md`：

```markdown
---
title: "信号与系统：从傅里叶级数说起"
description: "一句话摘要，会出现在文章列表、搜索结果和 RSS 里"
pubDatetime: 2026-11-17T10:00:00+08:00
tags: ["通信与测控", "信号处理"]
featured: false
draft: false
---

正文从这里开始，用普通 Markdown 写：

## 一级小节

- 列表项
- 公式、代码、图片、表格都支持（公式需要额外配置，见第 8 节）
```

保存后浏览器会自动刷新（`pnpm dev` 运行中时）。

### 4.2 frontmatter 字段清单

| 字段 | 必填 | 说明 |
|---|---|---|
| `title` | 是 | 标题 |
| `description` | 是 | 摘要，缺了会构建报错 |
| `pubDatetime` | 是 | 发布时间，建议带时区 `2026-11-17T10:00:00+08:00` |
| `modDatetime` | 否 | 修改时间，填了文章页会显示"Updated" |
| `tags` | 否 | 标签数组，默认 `["others"]` |
| `featured` | 否 | `true` 会出现在首页"Featured"区 |
| `draft` | 否 | `true` = 草稿，永远不显示（本地也不显示） |
| `author` | 否 | 默认取 `astro-paper.config.ts` 的 `author` |
| `ogImage` | 否 | 本文分享图（可写 `@/assets/images/xxx.png` 或相对路径） |
| `canonicalURL` | 否 | 原文地址（转载时用） |
| `hideEditPost` | 否 | 本文隐藏"编辑此页"链接 |
| `hideToc` | 否 | 本文隐藏目录 |
| `timezone` | 否 | 本文单独指定时区 |

### 4.3 几个容易踩的行为

- **未来的日期**：`pubDatetime` 比今天晚，**生产构建时不显示**（按天判断，到那天 0 点自动出现）；本地开发时能看到，方便预览。
- **草稿**：`draft: true` 连本地也不显示。
- **子目录**：`src/content/posts/gnss/basics.md` 会生成 `/posts/gnss/basics/`，可以用目录分组。
- **文件名**：用小写英文 + 连字符，URL 干净；中文文件名会变成百分号编码的地址，能用但不推荐。
- **标签**：`/tags` 页自动汇总；中文标签可用（内部会做 slug 处理），但同一含义别写成不同写法（"AI" / "ai" 会合并成一个，"人工智能" / "AI" 则是两个）。

### 4.4 修改"关于"页

改 `src/content/pages/about.md` 即可（标题、简介在它的 frontmatter 里，正文是 Markdown）。

### 4.5 上线前要清理的模板内容

| 位置 | 内容 | 处理 |
|---|---|---|
| `src/content/posts/` 下 `how-to-*.md`、`adding-new-post.mdx`、`dynamic-og-images.md`、`setting-dates-via-git-hooks.md` | 模板教程文章 | 删除或留着当参考 |
| `src/content/posts/examples/` | 示例文章（会出现在网站列表里） | **建议删除** |
| `src/content/posts/_releases/`、`_color-schemes/` | 下划线开头，**不参与构建** | 可留可删 |
| `public/default-og.jpg`、`src/assets/images/*` | 模板配图 | 换成自己的 |
| `src/content/pages/about.md` 正文 | 模板自我介绍 | 重写 |
| 首页 `src/pages/index.astro` 第 38 行 `Mingalaba` | 演示标题 | 改成自己的 |

---

## 5. 页面、布局、组件、样式在哪

| 想改什么 | 去哪 |
|---|---|
| 首页（hero 文案、分类入口、最近文章布局） | `src/pages/index.astro` |
| 顶部导航栏（菜单项、站名、主题按钮、搜索按钮） | `src/components/Header.astro` |
| 页脚 | `src/components/Footer.astro` |

| 文章列表的卡片样式 | `src/components/Card.astro` |
| 文章页整体（标题、日期、标签、正文、目录、分享、上下篇） | `src/pages/posts/[...slug]/index.astro` |
| 文章页各小块 | `src/pages/posts/[...slug]/_components/*`（EditPost、ShareLinks、BackButton、BackToTopButton、AdjacentPostNav、PostToc） |

| 全站 `<head>`、字体、主题切换、页面过渡 | `src/layouts/Layout.astro` |
| 文章页结构化数据/元信息 | `src/layouts/PostLayout.astro` |
| 全局样式变量、配色 | `src/styles/theme.css` |
| 排版（标题字号、行高、段落间距） | `src/styles/typography.css` |
| 全局基础样式 | `src/styles/global.css` |
| 404 页 | `src/pages/404.astro` |
| 站点图标 | `public/favicon.svg` |
| 额外 `<head>` 标签（统计代码、验证 meta） | `src/custom/Head.astro` |
| 页面底部额外脚本 | `src/custom/BodyEnd.astro` |
| 文章末尾额外内容（评论、赞赏） | `src/custom/PostEnd.astro` |

> `src/custom/` 的三个文件是 AstroPaper v7 专门留给使用者的"插槽"，主题升级不会覆盖它们——**以后加统计、评论都放这里**。

---

## 6. Markdown 是怎么变成网页的（细说一遍）

以 `src/content/posts/signal-and-system-01.md` 为例：

1. **读取**：构建时 Astro 按 `src/content.config.ts` 里的 `glob({ pattern: "**/[^_]*.{md,mdx}" })` 扫描 `src/content/posts/`，下划线开头的目录被排除。文件名（含子目录）成为文章 `id`。
2. **校验**：zod schema 检查 frontmatter。缺 `title` / `description` / `pubDatetime`，或日期格式不对，构建直接报错并指出哪个文件哪一行。
3. **过滤**：`src/utils/postFilter.ts` 去掉草稿；生产构建时再去掉"发布日期在今天之后"的文章。`getSortedPosts` 按时间倒序排列。
4. **生成路由**：`src/pages/posts/[...slug]/index.astro` 的 `getStaticPaths()` 为每篇文章生成一个 URL（`/posts/signal-and-system-01/`），并把文章数据、上一篇、下一篇传进去。
5. **渲染正文**：`render(post)` 把 Markdown 交给 Markdown 管线（remark/rehype 插件：标题 id、callout、表格包裹、页内目录），代码块由 Shiki 高亮，输出 HTML。
6. **套布局**：`PostLayout.astro` → `Layout.astro`，塞进 `<head>`（标题、描述、OG 图、canonical、JSON-LD）、`Header`、`Footer`，再插入目录、分享、上下篇等组件。
7. **落盘**：`pnpm build` 把结果写进 `dist/`；`pnpm dev` 则在内存里即时生成并通过 `http://localhost:4321` 提供。

其它页面同理：`src/pages/tags/[tag]/[...page].astro` 为每个标签生成分页列表，`rss.xml.ts` 在构建时生成 XML，`og.png.ts` 用 satori 画分享图。

---

## 7. 常用命令

在项目目录（`E:\zbk\job\myWebsite`）下执行。

| 命令 | 作用 | 说明 |
|---|---|---|
| `pnpm install` | 安装依赖 | 首次或换机器时；按 lockfile 装出一致版本 |
| `pnpm dev` | 启动开发服务器 | 默认 `http://localhost:4321`，改文件自动刷新 |
| `pnpm build` | 生产构建 | 依次执行 `astro check`（类型检查）→ `astro build` → Pagefind 索引 → 复制索引，产物在 `dist/` |
| `pnpm preview` | 预览构建结果 | 先 `build` 再 `preview`，模拟线上效果（搜索在这里才可用） |
| `pnpm sync` | 生成 Astro 类型 | 改过 content 配置后执行，让编辑器补全生效 |
| `pnpm format` | 格式化代码 | Prettier |
| `pnpm format:check` | 只检查不修改 | CI 用 |
| `pnpm lint` | 代码检查 | ESLint |
| `pnpm astro <子命令>` | 直接调 Astro CLI | 如 `pnpm astro dev --port 4400`、`pnpm astro dev stop` |

**关于代理**（国内网络 + 本地代理 `127.0.0.1:7897`）：
本项目用了 Google Fonts，`dev`/`build` 时需要访问 `fonts.google.com`。Node 的 `fetch` 不读 Windows 系统代理，所以要显式给环境变量：

```bat
set NODE_USE_ENV_PROXY=1
set HTTP_PROXY=http://127.0.0.1:7897
set HTTPS_PROXY=http://127.0.0.1:7897
pnpm dev
```

不设也能跑，只是字体回退、启动慢（每次请求 10 秒超时 × 重试）。**不要把这些变量写进系统环境变量**，否则关掉代理后 `pnpm install`/`git` 也会被绑死。

**部署（以后做）**：Cloudflare Pages 连接 GitHub 仓库，构建命令 `pnpm build`，输出目录 `dist`，环境变量 `NODE_VERSION=22.23.5`、`PNPM_VERSION=10.34.9`。部署前记得把 `site.url` 改成正式域名。

---

## 8. 模板自带功能：核实结果

| 功能 | 是否存在 | 依据 | 开关/位置 |
|---|---|---|---|
| 暗色模式 | 有 | `src/scripts/theme.ts` + Header 的切换按钮；跟随系统、记住选择、无闪烁 | `features.lightAndDarkMode` |
| 站内搜索 | 有（Pagefind） | `src/pages/search.astro`；索引在 `build` 时生成 | `features.search` |
| 标签（分类的替代） | 有 | `/tags` 汇总页 + `/tags/<tag>/` 单标签页，支持分页 | 文章 frontmatter 的 `tags` |
| 文章归档 | 有 | `/archives`，按时间分组 | `features.showArchives` |
| 分页 | 有 | `/posts/2/`、标签页分页 | `posts.perPage` |
| 文章目录（TOC） | 有 | 宽屏在右侧、窄屏浮动按钮；2 个以上标题才显示 | `features.toc` / 单篇 `hideToc` |
| RSS 订阅 | 有 | `/rss.xml` | 自动 |
| 站点地图 | 有 | `/sitemap-index.xml`（@astrojs/sitemap） | 自动 |
| robots.txt | 有 | `src/pages/robots.txt.ts` | 自动 |
| 404 页面 | 有 | `src/pages/404.astro` | 可改文案 |
| 每篇文章动态分享图 | 有 | `src/pages/posts/[...slug]/index.png.ts`（satori 绘制） | `features.dynamicOgImage` |
| 分享按钮 | 有 | 文章页底部，6 个平台 | `shareLinks` |
| 上/下篇导航 | 有 | `AdjacentPostNav.astro` | 自动 |
| 回到顶部 | 有 | `BackToTopButton.astro` | 自动 |
| 页面过渡动画 | 有 | `Layout.astro` 里的 `<ClientRouter />` | 自动 |
| 无障碍支持 | 有 | 跳转正文链接、aria 标签、键盘可达 | 自动 |
| i18n 多语言 | 有框架，只配了英文 | `astro.config.ts` 的 `locales: ["en"]`，文案在 `src/i18n/lang/en.ts` | 加中文需要改两处 |
| 评论 | **没有** | 只有一篇"如何集成 giscus"的教程文章 | 需自己加（放 `src/custom/PostEnd.astro`） |
| 数学公式（KaTeX） | **没有** | 只有教程文章，依赖里没有 `remark-math`/`rehype-katex` | 需自己配（10 分钟） |
| 真正的"分类"字段 | **没有** | schema 里只有 `tags`，没有 `category` | 用 tags 代替 |
| CMS / 后台管理 | 没有 | 内容就是 Git 里的 Markdown 文件 | 不需要 |
| 访问统计 | 没有 | 模板未集成 | 以后加 Cloudflare Web Analytics |

---

## 9. 哪些文件可以改，哪些别动

### 放心改（改坏也容易恢复）

- `src/content/posts/**`（你的文章）
- `src/content/pages/about.md`（关于页正文）
- `astro-paper.config.ts`（站点名、作者、时区、社交链接、功能开关）
- `public/favicon.svg`、`public/default-og.jpg`（换成自己的图）
- `src/custom/Head.astro`、`BodyEnd.astro`、`PostEnd.astro`（加统计、评论等）
- `src/i18n/lang/en.ts`（界面文案，想临时改成中文可以先动这里）

### 可以改，但要理解后果

- `src/pages/index.astro`（首页结构；改 hero 文案最简单，改布局要动 HTML/Tailwind 类）
- `src/components/Header.astro`（导航项写死在这里，加导航要自己加 `<li>`）
- `src/styles/theme.css`、`typography.css`（配色与排版；动 CSS 变量会影响全站）
- `src/pages/about.astro`（关于页外壳，一般不用动）
- `astro.config.ts`（加集成、改 i18n、换字体；改错会导致构建失败，好在有类型检查）
- `src/content.config.ts`（想加 `category` 这类新字段时才碰，加完要同步改模板里读取的地方）

### 暂时不要动

- `src/utils/**`、`src/types/config.ts`（逻辑与类型，改错会让全站报错）
- `src/layouts/**`、`src/pages/posts/[...slug]/index.astro`（文章页核心，659 行）
- `package.json` 里的依赖版本（升级用 `pnpm up`，别手改）
- `pnpm-lock.yaml`（锁文件，手改会让 Cloudflare 构建失败）
- `node_modules/`、`.astro/`、`dist/`（自动生成）
- `.github/`（模板的 CI 配置，个人项目用不上，留着也无害）
- `AGENTS.md`、`Dockerfile`、`compose.yaml`、`cz.yaml`（模板附带，不影响网站）

---

## 10. 常见错误处理

| 现象 | 原因 | 处理 |
|---|---|---|
| 启动时一堆 `Could not fetch ... fonts.google.com`，`ready in 80s` | Node 的 fetch 没走代理 | 启动前设 `NODE_USE_ENV_PROXY=1` + `HTTP_PROXY`/`HTTPS_PROXY`；或以后把字体改成本地文件 |
| `Another astro dev server is already running` | 同项目已有 dev 实例占着 4321 | `pnpm astro dev stop` 再启动；或直接用已有实例 |
| `Port 4321 is in use` | 端口被占 | `pnpm dev -- --port 4400` |
| 搜索页没有结果 | Pagefind 索引只在 `build` 后生成 | `pnpm build && pnpm preview` 验证；`dev` 下页面会提示 "DEV mode Warning" |
| 文章不出现在列表里 | `draft: true`，或 `pubDatetime` 是未来日期 | 检查 frontmatter |
| 构建失败：`description is required` 之类 | frontmatter 缺字段 | 按第 4.2 节补齐 |
| 构建失败：`astro check` 报类型错误 | 改了 `.astro` 的 props/类型 | 看报错里的文件与行号，本地先跑 `pnpm build` |
| 改了代码页面没变 | 浏览器缓存 / dev 没在跑 | 硬刷新 `Ctrl+F5`；确认终端还在运行 |
| 图片不显示（线上） | 用了本地绝对路径 | 放 `src/assets/` 用 `@/assets/...` 引用，或放 `public/` 用 `/xxx.png` |
| `Unsupported engine` | Node 版本低于 22.23.4 | `nvm install 22.23.5 && nvm use 22.23.5` |
| Cloudflare 构建失败 | 云端 pnpm 版本读不了 lockfile | 设环境变量 `PNPM_VERSION=10.34.9`、`NODE_VERSION=22.23.5` |
| `git push` 卡住 | GitHub 网络 | 重试 / 走代理 / 用 SSH |
| 终端里 `pnpm` 找不到 | 新装的 Node 没进 PATH | 重开终端；`where pnpm` 检查 |
| 中文路径或 OneDrive 下装依赖报错 | 路径含中文/空格/同步盘 | 本项目在 `E:\zbk\job` 下，已避开 |

---

## 11. 建议的学习/推进顺序

1. **先改配置**（30 分钟）：`astro-paper.config.ts` 里的标题、作者、时区、社交链接，关掉 `editPost`。
2. **再写一篇自己的文章**（1 小时）：跑通 frontmatter、标签、图片。
3. **清理模板内容**（30 分钟）：删 `examples/`、改 `about.md`、换 favicon。
4. **改首页文案**（30 分钟）：只动 `index.astro` 的 `<h1>` 和两段 `<p>`，不动结构。
5. **上线**（1 小时）：GitHub 仓库 + Cloudflare Pages。
6. **之后再谈**：中文界面（i18n）、数学公式、评论、首页分类卡片、本地字体。

> 记住一个原则：**每次只改一类东西，改完在浏览器里确认，再改下一类。** 出问题时用 git（以后会初始化）回退，比记住改了什么更可靠。

---

## 12. 本次分析的边界

- 只读取了项目文件，未修改任何代码、配置、样式，未删除任何文件。
- 未执行 `pnpm build`（构建会写入 `dist/`），因此"构建能否通过"尚未验证；需要验证时执行 `pnpm build`，它会先跑类型检查。
- 项目当前**尚未初始化 Git 仓库**（创建时用了 `--no-git`），部署前需要 `git init` 并推送到 GitHub。
