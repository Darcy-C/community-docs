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

## 版本更新页

`/release-notes` 是跳转页，会跳到 `docs/release-notes/` 下版本号最大的页面。
版本页按 `年份-版本号.md` 命名（如 `2027-5.md`），新增后无需改代码：

- 构建时 `plugins/latest-release` 扫描目录，按文件名里的数字比较大小，把最新页面地址注入页面的 `<meta name="qk-latest-release">`；
- 前端 `src/clientModules/releaseNotesRedirect.ts` 读取这个地址完成跳转；
- front matter 写 `draft: true` 的页面会被跳过，可以用来提前占位但暂不发布。

还没发布的版本页放在 `docs/wip/`（侧边栏「开发中」，排在「版本更新」下面），不要放进 `docs/release-notes/`，
否则会被当成已发布版本、并可能被 `/release-notes` 跳转选中。发布时把文件移动到 `docs/release-notes/` 即可。
