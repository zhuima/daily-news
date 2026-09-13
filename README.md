# daily-news

赛道扫描（Track Scan）：微信读书关键词扫描的静态归档站。**主数据存储：Cloudflare D1**；**主部署：Cloudflare Pages（OpenNext）**。Vercel 仍可用 `npm run build`（无 D1 时回退读仓库内 JSON 种子）。

品牌色 Marrs Green `#01847E`，画布 `#f6f5f2`。文章选择走 URL `?article=<id>`。Zustand 只存检索词与搜索。

**链接策略：**「打开原文」仅 `mp.weixin.qq.com`（可验证）或 `weixin.sogou.com/link`；**禁止**搜狗搜索页。不伪造 URL。

## 本地开发

### 仅 UI（JSON 回退）

```bash
npm install
npm run dev
```

打开 http://localhost:3000。读写公众号**不会持久化**（无 D1 绑定）。

### 带 D1（推荐，与生产一致）

1. 安装依赖后，在 `wrangler.jsonc` 填入 D1 `database_id`（见下方「首次 Cloudflare 部署」）。
2. 迁移 + 种子：

```bash
npm run db:migrate:local
npm run db:seed:local
```

3. 预览 OpenNext + 本地 D1：

```bash
npm run dev:cf
```

或 `npx wrangler pages dev`（在 `npm run build:cf` 之后）。

强制只用 JSON（调试）：`TRACK_SCAN_USE_JSON=1 npm run dev`

## Cloudflare D1  schema（摘要）

| 表 | 说明 |
|----|------|
| `accounts` | `slug` PK（中文名 → base64url）、`name`、`added_at`、`notes` |
| `scans` | 扫描批次 `id`、`scan_date`、`title`、`sources_json`、`notes` |
| `articles` | 目录条目：`id`、`scan_id`、`title`、`account`、`url`、`query`…；索引：`scan_id`、`account`、`title`、`url` |
| `catalog_meta` | `version` / `updatedAt` |

迁移文件：`migrations/0001_init.sql`

## 首次 Cloudflare 部署（用户必做）

在已登录 `wrangler` 的机器上：

```bash
# 1. 创建 D1
npx wrangler d1 create track-scan-db
# 复制输出的 database_id 到 wrangler.jsonc → d1_databases[0].database_id

# 2. 应用 schema
npm run db:migrate:remote

# 3. 导入当前仓库 JSON 种子（后续可用真实 ~49 URL 目录替换 data/index.json 再跑）
npm run db:seed:remote

# 4. Pages 项目 Secrets（Dashboard → Workers & Pages → 项目 → Settings → Variables）
#    ACCOUNTS_ADMIN_TOKEN = 管理口令
#    NEXT_PUBLIC_SITE_URL = https://news.affdirs.com

# 5. 构建并部署
npm run build:cf
npm run deploy:cf
```

绑定名称必须为 **`DB`**（与 `wrangler.jsonc` 一致）。OpenNext 产物目录：`.open-next/`。

## `/accounts` 管理

- **增删公众号** → D1 `accounts` 表（需 `ACCOUNTS_ADMIN_TOKEN`）
- **导入文章链接**：上传 wechatDownload `export_article_data` 的 CSV/JSON → `POST /api/accounts/import`（仅链接，不批量抓正文）
- 说明：[docs/wechat-download-import.md](docs/wechat-download-import.md)

## 正文下载（本地）

[x-fetcher](https://github.com/zhuima/x-fetcher) 单篇 mp URL：

```bash
export X_FETCHER_PATH=/path/to/x-fetcher
node scripts/download-account-bodies.mjs --account "水金聊投资"
```

## 脚本

| 命令 | 作用 |
|------|------|
| `npm run build` | Next 标准构建（Vercel / CI；D1 不可用时 JSON 回退） |
| `npm run build:cf` | OpenNext for Cloudflare |
| `npm run deploy:cf` | 部署到 Cloudflare Pages |
| `npm run db:migrate:local` / `:remote` | D1 migrations |
| `npm run db:seed:local` / `:remote` | 从 `data/*.json` 写入 D1 |
| `npm run db:rescore` / `db:rescore:remote` | 重算全库「质量分」（见 docs/article-scoring.md） |
| `node scripts/seed-catalog.mjs` | 仅 regenerates `data/index.json` 样例（Git 种子，非运行时 SoT） |

## 路由

- `/` `/scans/[scanId]` `/about` `/accounts` `/llms.txt` `/sitemap.xml` `/feed.xml`

## 技术栈

Next.js App Router、TypeScript、Tailwind v4、Zustand、Cloudflare D1、OpenNext Cloudflare、JSON-LD / SEO / GEO。
