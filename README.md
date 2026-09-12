# daily-news

赛道扫描（Track Scan）：把一次关键词扫描做成可浏览的静态站点。当前仓库在 `main` 上从这份说明起步，站点跑在仓库根目录。

品牌色 Marrs Green `#01847E`，画布 `#f6f5f2`，阅读区用白纸卡片。界面为中文。文章选择走 URL `?article=<id>`，不用 Zustand / `useState` 记「正在读哪篇」。Zustand 只存筛选：关键词、是否仅看可打开原文、搜索框。

## 本地运行

```bash
npm install
npm run dev
```

打开 [http://localhost:3000](http://localhost:3000)。

- `/` 扫描列表
- `/scans/2026-09-12` 一次扫描：筛选 + 列表 + 阅读面板
- `/scans/2026-09-12?article=2026-09-12-weread-001` 打开指定文章（刷新可复现）
- `/about` 数据说明

生产构建：

```bash
npm run build
npm start
```

## 数据

目录 `data/index.json`：

```json
{
  "version": "1.0.0",
  "updatedAt": "2026-09-12T09:00:00+08:00",
  "scans": [
    {
      "id": "2026-09-12",
      "date": "2026-09-12",
      "title": "云原生训推 / 算力成本 / 模型测评",
      "sources": ["weread"],
      "articleCount": 90,
      "notes": "可选"
    }
  ],
  "articles": [
    {
      "id": "2026-09-12-weread-001",
      "scanDate": "2026-09-12",
      "channel": "微信公众号",
      "query": "vLLM SGLang",
      "title": "标题",
      "account": "账号",
      "publishedLabel": "27分钟前",
      "summary": "摘要",
      "url": "https://mp.weixin.qq.com/s/...",
      "hasDirectLink": true
    }
  ]
}
```

样例扫描日期 `2026-09-12`，来源微信读书（weread），约 90 篇，检索词覆盖：

- vLLM SGLang
- PD 分离 Prefill Decode
- Kueue Volcano Gang Scheduling
- GPU 算力成本 MFU
- 昇腾 国产卡 Day0
- 模型评测 benchmark 独立复现

其中 `2026-09-12-weread-001` 为指定种子文（水金聊投资 / SGLang 和 vLLM）。后续可以用完整数据集整文件替换 `data/index.json`。

重新生成样例（会覆盖 `data/index.json`）：

```bash
node scripts/seed-catalog.mjs
```

## 追加一次扫描

1. 在 `scans` 里加一条，`id` 与 `date` 建议同一天，例如 `2026-09-13`。
2. 把当天的文章追加到 `articles`，`scanDate` 对上扫描日期；`id` 建议 `日期-来源-序号`。
3. `articleCount` 写成当天篇数。
4. 本地 `npm run dev` 看 `/scans/<id>`，再 `npm run build`。

阅读面板的「打开原文」只在 `hasDirectLink === true` 且 `url` 非空时出现。

文章高亮与面板内容由服务端页面 `app/scans/[scanId]/page.tsx` 读取 `searchParams.article`，再把 `selectedId` 传给列表和面板。列表行是：

```tsx
<Link href={`/scans/${scanId}?article=${encodeURIComponent(id)}`} scroll={false}>
```

## 部署到 Vercel

1. 用 [Vercel](https://vercel.com/new) 导入 `zhuima/daily-news`。
2. Framework Preset 选 Next.js，根目录保持仓库根（不要填子目录）。
3. Build Command：`npm run build`；Output 用 Next.js 默认即可。
4. 不需要环境变量。数据在构建时打进产物，更新 `data/index.json` 后重新部署即生效。

CLI：

```bash
npx vercel
```

## 技术栈

Next.js App Router、TypeScript、Tailwind CSS、Zustand（仅筛选）。
