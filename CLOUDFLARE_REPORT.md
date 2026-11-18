# Cloudflare 部署报告

- 项目：`E:\zbk\job\myWebsite`（Astro + AstroPaper）
- GitHub 仓库：`https://github.com/zbkdsg/my-personal-blog`
- 线上地址：`https://my-personal-blog.zbk3089065771.workers.dev`
- 报告时间：2026-11-18

---

## 一、我们到底做了什么

### 1.1 一句话概括

把 GitHub 上的代码仓库接到 Cloudflare，让 Cloudflare 每次发现仓库有新提交时，自动拉代码、装依赖、跑 `pnpm build` 生成静态文件、再把生成结果发布到全球网络。

### 1.2 操作时间线

| 步骤 | 做了什么 | 结果 |
|---|---|---|
| ① | 在 GitHub 建空仓库 `my-personal-blog` | 有地方存代码 |
| ② | 本地 `git init`、提交 162 个文件、推到 `main` | 代码上线到 GitHub |
| ③ | Cloudflare 里新建应用，授权 GitHub 并选中该仓库 | Cloudflare 获得读取权限 |
| ④ | 填构建配置：`pnpm build` + `npx wrangler deploy` | 告诉它怎么构建、怎么发布 |
| ⑤ | 加环境变量 `NODE_VERSION` / `PNPM_VERSION` | 保证云端构建环境和你本地一致 |
| ⑥ | 新增 `wrangler.jsonc`，声明静态资源目录 `./dist` | 解决"部署命令找不到要发布的文件" |
| ⑦ | 点 Deploy，首次构建 | 172 个文件，构建 25s + 部署 28s，成功 |
| ⑧ | 把 `site.url` 改成真实地址并推送 | RSS、sitemap、分享卡链接正确 |

### 1.3 我们用的是 Workers，不是 Pages

Cloudflare 目前有两条做静态站的路，界面都归在 "Workers & Pages" 下：

| | Pages（老方案） | Workers + 静态资源（你现在用的） |
|---|---|---|
| 配置方式 | 只需要"构建命令 + 输出目录" | 需要仓库里有 `wrangler.jsonc` |
| 发布命令 | 平台自动上传 `dist/` | `npx wrangler deploy` 主动发布 |
| 默认域名 | `xxx.pages.dev` | `xxx.<子域>.workers.dev` |
| 现状 | 仍在维护，新功能主要投向 Workers | Cloudflare 当前主推 |

我们从 "Connect to Git" 进入的是 Workers 向导，所以多了一步 `wrangler.jsonc`。这个文件内容就三件事：

```jsonc
{
  "name": "my-personal-blog",        // 项目名，决定域名前缀
  "compatibility_date": "2026-11-18", // 运行时兼容日期
  "assets": {
    "directory": "./dist",           // 发布这个目录里的文件
    "not_found_handling": "404-page" // 找不到页面时用 Astro 生成的 404.html
  }
}
```

### 1.4 云端构建流水线（每次 push 都会跑一遍）

```
检测到 main 有新提交
  ↓
Cloning        拉取仓库（约 1s）
  ↓
Installing     pnpm install（按 pnpm-lock.yaml 装依赖，18s）
  ↓
Building       pnpm build（25s）
                 ├─ astro check     类型检查，有错就停
                 ├─ astro build     生成 dist/
                 ├─ pagefind        生成搜索索引
                 └─ copy-pagefind   把索引复制到 public/
  ↓
Deploying      npx wrangler deploy（28s）
                 └─ 按 wrangler.jsonc 上传 dist/ 里的 172 个文件
  ↓
线上生效（workers.dev 域名 + 预览 URL）
```

关键点：**Cloudflare 只是执行命令的机器**。构建逻辑全在 `package.json` 的 `build` 脚本里，和你本地跑的是同一套。

---

## 二、Cloudflare 控制台导览

进入路径：Dashboard → **Workers & Pages** → 点你的项目 `my-personal-blog`。

### 2.1 顶部标签页

| 标签 | 作用 | 你什么时候会用到 |
|---|---|---|
| **Overview** | 项目概况、生产/预览环境、最近部署 | 想知道"现在线上是哪个版本" |
| **Metrics** | 请求量、错误率、流量曲线 | 看有没有人来、有没有 5xx |
| **Deployments** | 每次构建的记录（谁触发、耗时、成功与否） | **最常用**：看构建结果、重试、回滚 |
| **Observability** | 运行时日志、异常追踪 | 页面报错时查原因（静态站用得少） |
| **Issues** | 平台检测到的异常汇总 | 偶尔看一眼 |
| **Domains** | 绑定自定义域名 | 买了域名之后来这里加 |
| **Access** | 访问控制（Zero Trust） | 想让网站只有自己人能看时才用 |
| **Settings** | 构建配置、环境变量、Git 连接、删除项目 | 改构建命令、加变量 |

### 2.2 Deployments 页面能做什么

每条部署记录展开后能看到：

- **五段耗时条**：Initializing / Cloning / Installing / Building / Deploying，哪段红了一眼看出
- **完整构建日志**：`Download log` 可下载
- **当前版本 ID**：如 `6e8392ab-...`，用于回滚定位
- **操作**：Retry deployment（用同一份代码重跑）、Rollback（回到某个旧版本）

### 2.3 Settings 里最重要的两处

1. **Build configuration**：构建命令、部署命令、根目录、分支
2. **Variables and Secrets**：环境变量。我们加了两个：
   - `NODE_VERSION=22.23.5`
   - `PNPM_VERSION=10.34.9`

改完环境变量需要重新部署一次才生效。

### 2.4 需要认识的几个名词

| 名词 | 含义 |
|---|---|
| Worker | Cloudflare 上的一个"应用单元"。你现在这个只做一件事：发静态文件 |
| 静态资源（Assets） | 构建出来的 HTML/CSS/JS/图片，由边缘节点直接返回 |
| Build | 一次"拉代码 → 构建 → 部署"的完整过程 |
| Deployment | 一次发布产生的结果，可回滚 |
| Preview URL | 非 `main` 分支或 PR 自动生成的临时地址，不影响正式站 |
| `workers.dev` | Cloudflare 免费提供的默认域名，不需要自己的域名 |
| 自定义域名 | 绑自己的 `example.com`，需要在 Domains 里添加并按提示配 DNS |

---

## 三、我们现在的配置清单（留档）

| 项 | 值 |
|---|---|
| GitHub 仓库 | `zbkdsg/my-personal-blog` |
| 生产分支 | `main` |
| 构建命令 | `pnpm build` |
| 部署命令 | `npx wrangler deploy` |
| 预览命令 | `npx wrangler versions upload`（或取消预览构建） |
| 环境变量 | `NODE_VERSION=22.23.5`、`PNPM_VERSION=10.34.9` |
| 资源目录 | `./dist` |
| 404 处理 | `404-page` |
| 线上地址 | `https://my-personal-blog.zbk3089065771.workers.dev` |
| 相关提交 | `5c1ae72` → `8d30248`（wrangler 配置）→ `30e5e78`（站点地址） |

---

## 四、日常运维

### 4.1 发布新内容

```bat
:: 1. 本地写好文章，先自己看效果
pnpm dev

:: 2. 提交
git add -A
git commit -m "post: 文章标题"

:: 3. 推送（必须带代理，否则连不上 GitHub）
git -c http.proxy=http://127.0.0.1:7897 push
```

推送后约 2 分钟自动上线，不需要点任何按钮。

### 4.2 出问题怎么处理

| 情况 | 处理 |
|---|---|
| 构建失败 | Deployments → 点开最近一次 → 看 Building 段的红字；改完代码再 push |
| 线上样式错乱 | 大概率是构建时 Tailwind 出问题，看日志里 `astro build` 段 |
| 想回到上一个版本 | Deployments → 找到旧版本 → Rollback |
| 改了环境变量没生效 | 需要手动 Retry 一次部署 |
| 域名打不开 | 先确认 `wrangler.jsonc` 里的 `name` 和域名前缀一致 |

### 4.3 成本与限制

- 静态资源请求在免费额度内不额外计费，个人博客基本用不到付费档
- 每月构建次数有上限（个人使用远远够）
- 具体数值以 Cloudflare 官网定价页为准，此处不写死

---

## 五、一个必须知道的现实问题：国内访问

Cloudflare 的边缘节点在境外，国内访问要经过国际出口，晚高峰容易丢包、超时，表现为"时快时慢甚至打不开"。

- 这**不是** Astro 或构建方式的问题，而是网络路径问题
- `*.workers.dev`、`*.pages.dev` 这类共享域名在国内被干扰的概率更高
- 绑定自己的域名通常比共享域名稳定一些，但改善有限

如果要认真解决，路线见对话中的说明：**域名 + ICP 备案 + 国内对象存储/CDN**。好消息是：网站是纯静态文件，换托管只需要把 `dist/` 换个地方放，代码一行都不用改。
