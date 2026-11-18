# 仓库约定

Quicker 社区版文档站，Docusaurus 3，内容全部是 `docs/` 下的 Markdown，构建产物在 `build/`。

## 文档写作规则

- 文档面向**最终用户**（Quicker 社区版的使用者），不是给开发者看的。
- **不要使用英文的模块 key**（例如 `sys:xxx`、`ui:xxx` 这类内部标识），要用界面上显示的中文名称来称呼模块和功能。
- **不要引用代码仓库里的任何东西**：文件路径、类名、函数名、提交记录、内部实现细节都不要写。需要解释一个行为时，用用户能看到的界面位置和现象来描述。
- 除非用户明确要求，**不要修改 `README.md`**。
- 改文档前先看同目录已有页面的标题层级、术语和排版习惯，保持一致。
- 中文标点导致的 `**加粗**` 失效可以用 `npm run docs:emphasis:check` 检查、`npm run docs:emphasis:fix` 自动修复。
- 图片的 alt 文字会显示成图片下方的图注，截图请写有意义的 alt；不想显示图注就把 alt 留空（装饰图、小图标）。
- 未发布的版本页放在 `docs/wip/`（侧边栏「开发中」），不要放进 `docs/release-notes/`。
- 在编写逻辑时，不要硬编码版本号，例如之前我们要求 release-notes/ 自动跳转到最新页面，别硬编码特定的版本，一但硬编码，由于我们是人机协作，可能会导致开发者忘记修改那些硬编码的位置导致问题。

## 常用命令

| 命令 | 说明 |
| --- | --- |
| `npm ci` | 按 lockfile 安装依赖 |
| `npm start` | 本地预览，<http://localhost:2611> |
| `npm run typecheck` | TypeScript 检查 |
| `npm run build` | 生产构建（断链会直接报错） |

提交和推送走 `ship` skill 的流程：`npm ci` → `npm run typecheck` → `npm run build` → commit → push。
