# wechatDownload → D1 链接导入（本地 MCP）

「拉取全部文章链接」**只导入 URL 与元数据到 D1**，不在服务器上批量下载正文。正文仍用 [x-fetcher](https://github.com/zhuima/x-fetcher) 在本机对单篇 mp URL 抓取。

## 1. 本地导出（wechatDownload）

在已配置 **wechatDownload** MCP / CLI 的机器上，对目标公众号执行导出（需已配置 key，**export_article_data** 一类能力）：

- 输出：**JSON 或 CSV**
- 每行至少：**标题** + **可验证链接**（`mp.weixin.qq.com` 含 `__biz` 或 `mid`+`sn`，或 `weixin.sogou.com/link`）
- **不要**使用搜狗/微信读书 **关键词搜索页** URL（搜索页通常**没有**阅读/点赞/评论）

### 互动数据（阅读 / 点赞 / 在看 / 评论）

**仅**在 wechatDownload 导出列里可能出现，例如：

| 常见列名（模糊匹配） | 写入字段 |
|---------------------|----------|
| 阅读、阅读量、read_num | `read_count` |
| 点赞、点赞数、like_num | `like_count` |
| 在看、old_like | `old_like_count` |
| 评论、评论数 | `comment_count` |
| 分享、转发 | `share_count` |

列表关键词扫描**不会**产生这些数据；缺列则保持空，**不编造 0**。

示例 JSON：

```json
[
  {
    "title": "文章标题",
    "nickname": "公众号名称",
    "url": "https://mp.weixin.qq.com/s?__biz=...&mid=...&sn=...",
    "阅读": "12000",
    "点赞": "86",
    "评论": "12"
  }
]
```

## 2. 在站点导入

1. Cloudflare Pages + D1 migrate + seed。
2. `/accounts` → `ACCOUNTS_ADMIN_TOKEN` 解锁。
3. 选择扫描批次，上传 CSV/JSON。
4. 可选勾选 **尝试从 mp 页解析互动**（best-effort，常失败，不阻塞导入）。

匹配规则：按 **公众号 + 标题** 更新已有行或插入新行。

## 3. API

```bash
curl -X POST "https://news.affdirs.com/api/accounts/import?scanId=2026-09-12&tryMpEngagement=0" \
  -H "Authorization: Bearer $ACCOUNTS_ADMIN_TOKEN" \
  -F "file=@export.csv"
```

`tryMpEngagement=1`：导出无互动列时，对 mp 链接做一次 HTML 解析尝试（失败忽略）。

## 4. 与「质量分」的关系

**质量分**只看内容深度/结构/论据/原创（title+summary）。互动指标**仅展示**，不参与质量分。

## 5. 正文下载（本地）

```bash
export X_FETCHER_PATH=/path/to/x-fetcher
node scripts/download-account-bodies.mjs --account "公众号名"
```

输出：`data/downloads/<slug>/`（本地，不进 D1）。
