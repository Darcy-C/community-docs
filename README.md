# community-docs

Quicker 社区版（Quicker Community Edition）文档站，使用 [Docusaurus 3](https://docusaurus.io/) 生成静态站点。
站点结构与样式对齐 <https://github.com/QuickerOrg/docs.getquicker.net>（Docusaurus 3 + 本地搜索 + 同一套主题变量），
内容从 2026 年 11 月 16 日起，从社区语雀知识库整理迁入，之后内容维护统一在本仓库进行。

## 本地开发

```bash
npm ci
npm start        # http://localhost:3000
```

## 构建

```bash
npm run build    # 产物在 build/，是纯静态文件，可直接托管
npm run serve    # 本地预览 build/ 的结果
```

其他脚本：

| 命令 | 说明 |
| --- | --- |
| `npm run typecheck` | TypeScript 检查（`docusaurus.config.ts`） |
| `npm run docs:emphasis:check` | 检查中文标点导致的 `**加粗**` 失效 |
| `npm run docs:emphasis:fix` | 自动修复上面的问题 |
| `node tools/gen-module-status.mjs --write` | 从应用仓库重新生成「模块实现进度」表 |
| `npm run clear` | 清理 `.docusaurus/` 缓存 |
