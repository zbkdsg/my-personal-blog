# AGENTS.md — 本项目长期使用的 AI 开发规则

> 本文件适用于所有在本项目中工作的 AI 助手（以及未来的协作者）。
> 优先级：**用户的明确指令 > 本文件 > 模板/框架的默认习惯**。
> 与项目事实冲突时，以 `PROJECT_GUIDE.md` 和仓库实际内容为准。

---

## 1. 项目定位

1. 本项目是一个**长期维护的个人网站**，采用**渐进式开发**：先能跑、能发内容，再逐步改善结构与外观。
2. 不做"一次性大改造"。任何改造都应拆成可验证的小步，每步都能独立回滚。
3. 判断标准：**三个月后还能维护**比"现在看起来最先进"更重要。

---

## 2. 项目事实（改动前先核对，不要凭记忆写命令）

| 项 | 实际值 |
|---|---|
| 项目根目录 | `E:\zbk\job\myWebsite` |
| 模板 | AstroPaper v7.2.0（`package.json` 的 `version`） |
| 框架 | Astro 7.4.8（`node_modules/astro/package.json`） |
| Node 要求 | `>=22.23.4`（本机 v22.23.5，经 nvm 管理） |
| 包管理器 | pnpm 10.34.9 |
| 本地端口 | 4321（`pnpm dev` 默认） |
| 内容格式 | Markdown / MDX |
| 输出 | 静态文件，构建产物在 `dist/` |
| Git | 创建时用了 `--no-git`；若仓库尚无 `.git`，部署前需 `git init` 并推送 |

**命令（均已在本机验证，不要臆造其它写法）：**

| 目的 | 命令 |
|---|---|
| 启动开发服务器 | `pnpm dev`（后台模式：`pnpm astro dev --background`） |
| 查看/停止后台服务 | `pnpm astro dev status`、`pnpm astro dev stop`、`pnpm astro dev logs --follow` |
| 生产构建 | `pnpm build`（= `astro check` → `astro build` → Pagefind 索引 → 复制索引） |
| 预览构建结果 | `pnpm preview`（搜索功能只有构建后才可用） |
| 生成类型 | `pnpm sync` |
| 格式化 / 检查 | `pnpm format`、`pnpm format:check`、`pnpm lint` |

**关键路径：**

- 站点配置：`astro-paper.config.ts`（标题、作者、时区、开关、社交链接）
- 构建配置：`astro.config.ts`（集成、i18n、字体、Markdown 管线）
- 文章：`src/content/posts/`；关于页正文：`src/content/pages/about.md`
- 页面：`src/pages/`；布局：`src/layouts/`；组件：`src/components/`
- 样式：`src/styles/`；自定义插槽：`src/custom/{Head,BodyEnd,PostEnd}.astro`
- 文章必填 frontmatter：`title`、`description`、`pubDatetime`

**环境注意：** 本机访问 Google Fonts 需代理。运行 `dev`/`build` 前如需联网取字体，在**当前会话**设置
`NODE_USE_ENV_PROXY=1`、`HTTP_PROXY`/`HTTPS_PROXY=http://127.0.0.1:7897`；
**不得**写入系统或用户环境变量，避免关闭代理后影响 `pnpm install` 与 `git`。

---

## 3. 改动范围

1. **未经用户明确要求，不得大规模重构现有项目。** 包括但不限于：批量移动目录、重写布局、更换框架/主题、改动路由结构、重命名既有文章与图片。
2. **优先复用现有组件和项目功能。** 新增界面前先检索 `src/components/`、`src/layouts/`、`src/utils/` 是否已有等价实现；不要重复造轮子，也不要引入功能重叠的第三方库。
3. **每次只处理用户明确提出的任务。** 不擅自增加无关功能、不改与任务无关的文件、不"顺手优化"。
4. **不得随意升级框架、依赖或修改锁文件。** 不手动编辑 `package.json` 的版本号与 `pnpm-lock.yaml`；确需升级时先说明理由、影响范围与回滚方式，经确认后执行。
5. **不得删除现有文章、图片和配置。** 清理模板示例内容属于独立任务，需用户明确授权后单独执行。

---

## 4. 改动之前

1. **先检查相关文件**：读取将要修改的文件、其引用方与被引用方，确认字段、props、样式变量、路由的真实写法。
2. **先说明计划**：列出要改的文件、每处改动的原因、预期影响、验证方式；涉及多处文件或多步操作时先给方案再动手。
3. 不确定的行为先查 `PROJECT_GUIDE.md` 或官方文档（Astro / AstroPaper / Tailwind），不要凭印象下结论。
4. 动手前确认目标路径正确；覆盖前确认文件现状；目录非空时不得假设可以清空。

---

## 5. 改动之后

1. **运行适当的检查和构建**：涉及页面/组件/配置时跑 `pnpm build`（内含 `astro check` 类型检查）；只改 Markdown 时至少确认 `pnpm dev` 下页面正常渲染。
2. **优先修根本原因，不得隐藏错误**：不允许通过加 `any`、关掉检查、删掉报错代码、注释掉功能、跳过测试等方式让检查"变绿"。修不了就先停下来说明。
3. **每个阶段完成后向用户汇报**（见第 8 节）。
4. 改动若产生临时文件、调试输出、无用依赖，结束前清理干净。

---

## 6. 内容与语言

1. **所有面向用户的内容优先使用中文**（标题、正文、导航、按钮、提示、错误说明），同时保留必要的英文技术术语（如 Markdown、API、Node.js、build），不硬译。
2. 代码注释可用中文；变量名、函数名、文件名保持英文与既有风格。
3. 面向用户的中文文案要准确、克制，不写营销式夸张表述。
4. 界面本身的语言（i18n）目前只配置了 `en`，界面文案在 `src/i18n/lang/en.ts`；改中文界面属于独立任务，需单独确认，不要在普通改动中顺手替换。

---

## 7. 信息安全

1. **网站内容和代码中不得包含单位内部资料、涉密资料或未经授权公开的信息。** 包括截图、文档、数据、内部链接、项目代号等。
2. **不得在代码、Git 仓库或日志中保存密码、API Key、访问令牌等秘密信息。** 需要配置时使用环境变量，且确认 `.env` 已被 `.gitignore` 忽略（本项目已忽略 `.env`、`.env.production`）。
3. 汇报与日志中若出现疑似凭据，立即脱敏（只保留前缀与长度），并提示用户轮换。
4. 不执行会外发项目文件的命令；不把项目内容上传到未确认的第三方服务。

---

## 8. 汇报格式（每个阶段结束必填）

```
## 阶段汇报
### 修改文件
- 路径：改了什么
### 修改原因
- 为什么必须改，不改会怎样
### 测试结果
- 执行的命令 + 结果（通过/失败、关键输出）
- 未执行的验证，说明原因
### 已知问题 / 风险
- 未解决的点、遗留的坑、需要用户决策的事项
```

汇报要能给用户做判断：改了哪些、为什么、验证到什么程度、还有什么不确定。

---

## 9. 文件分区（与 `PROJECT_GUIDE.md` 第 9 节一致）

- **可直接修改**：`src/content/**`（文章、关于页）、`astro-paper.config.ts`、`public/`、`src/custom/*.astro`
- **需先说明再改**：`src/pages/index.astro`、`src/components/Header.astro`、`src/styles/*.css`、`astro.config.ts`、`src/content.config.ts`
- **默认不改**：`src/utils/**`、`src/layouts/**`、`src/pages/posts/[...slug]/index.astro`、依赖版本、`pnpm-lock.yaml`、`node_modules/`、`.astro/`、`dist/`、`.github/`

---

## 10. 参考文档

- 项目说明：`PROJECT_GUIDE.md`
- Astro 文档：https://docs.astro.build
- Astro 路由：https://docs.astro.build/en/guides/routing/
- 内容集合：https://docs.astro.build/en/guides/content-collections/
- Astro 组件：https://docs.astro.build/en/basics/astro-components/
- 样式与 Tailwind：https://docs.astro.build/en/guides/styling/
- AstroPaper：https://github.com/satnaing/astro-paper
