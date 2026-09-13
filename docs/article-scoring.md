# 文章质量分

从**内容质量**评估（深度、结构、论据、原创），**不是**赛道选题价值、不是流量热度；链接类型**不**占主权重。

| 维度 | 上限 | 依据 |
|------|------|------|
| 实质与深度 | 35 | 机制/数字/架构/权衡；惩罚空泛盘点、标题党 |
| 清晰与结构 | 25 | 论点清楚、层次分明；惩罚堆砌与粘贴感 |
| 论据与严谨 | 25 | 数据、基准、可复现步骤、局限；惩罚无来源断言 |
| 原创与非重复 | 15 | 分析/综合 vs 通稿转载、SEO 洗稿 |

实现：`lib/scoring/content-quality-score.ts`（启发式；有 `body` 时用全文，否则 title+summary 并在理由中标注「仅据标题摘要」）。

UI 展示：**质量分** chip。

重算全库：

```bash
npm run db:rescore:local    # 本地 D1
npm run db:rescore:remote   # 远程 D1（生产 news.affdirs.com 绑定库）
npm run db:rescore:json     # 仅更新 data/index.json 种子
```

导入链接或写入文章时会自动按同一规则计分。
