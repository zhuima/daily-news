# wechatDownload → D1 链接导入（本地 MCP）

「拉取全部文章链接」**只导入 URL 到 D1**，不在服务器上批量下载正文。正文仍用 [x-fetcher](https://github.com/zhuima/x-fetcher) 在本机对单篇 mp URL 抓取。

## 1. 本地导出（wechatDownload）

在已配置 **wechatDownload** MCP / CLI 的机器上，对目标公众号执行导出（名称以你本地工具为准）：

- 功能：`export_article_data`（或等价导出）
- 输出：**JSON 或 CSV**，每行至少包含 **标题** 与 **可验证链接**（`mp.weixin.qq.com` 含 `__biz` 或 `mid`+`sn`，或 `weixin.sogou.com/link`）
- **不要**使用搜狗关键词搜索页 URL

示例 JSON 字段（工具字段名可能不同，导入器会尝试映射）：

```json
[
  {
    "title": "文章标题",
    "nickname": "公众号名称",
    "url": "https://mp.weixin.qq.com/s?__biz=...&mid=...&sn=..."
  }
]
```

## 2. 在站点导入

1. 部署到 Cloudflare Pages（OpenNext）并完成 D1 migrate + seed。
2. 打开 `/accounts`，用 `ACCOUNTS_ADMIN_TOKEN` 解锁管理。
3. 在 **导入文章链接** 区域选择扫描批次（如 `2026-09-12`），上传 CSV/JSON。
4. 服务端会：
   - 按 **公众号 + 标题** 匹配已有扫描条目并更新 `url`
   - 无匹配时插入新行（仅链接与元数据，不伪造 URL）

## 3. API（可选）

```bash
curl -X POST "https://YOUR_DOMAIN/api/accounts/import?scanId=2026-09-12" \
  -H "Authorization: Bearer $ACCOUNTS_ADMIN_TOKEN" \
  -F "file=@export.json"
```

## 4. 正文下载（本地）

```bash
export X_FETCHER_PATH=/path/to/x-fetcher
node scripts/download-account-bodies.mjs --account "公众号名"
```

输出目录：`data/downloads/<slug>/`（本地文件，不进 D1）。
