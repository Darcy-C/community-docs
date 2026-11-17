---
name: ship
description: 提交并推送本仓库的改动：先跑 npm ci、npm run typecheck、npm run build，全部通过后再 commit 并 push
---

# Ship

把当前工作区的改动过一遍检查，然后提交、推送。**任何一步检查失败就停下来报告，不要带着失败提交。**

## 1. 先看改动

```bash
git status
git diff
```

- 确认改动都属于本次任务。遇到明显无关的改动（比如别人还没提交的文档内容、临时测试文件），先问用户，不要顺手一起提交。
- `build/`、`.docusaurus/`、`node_modules/` 是生成物，已写在 `.gitignore` 里，不要提交。

## 2. 过检查（必须全部通过）

```bash
npm ci
npm run typecheck
npm run build
```

- `npm ci` 按 `package-lock.json` 重装依赖。同一次会话里刚装过、且 `package.json` / `package-lock.json` 都没变时才可以跳过，跳过要在汇报里说明。
- `npm run build` 配置了 `onBrokenLinks: 'throw'`，断链会直接让构建失败。
- typecheck 或 build 报错就先修；修不了就停下来说明原因，**不要提交**。

## 3. 提交

- 只 `git add` 本次任务涉及的文件，不要 `git add -A` / `git add .` 把无关改动带进来。
- commit message 跟仓库现有风格一致，`类型: 简述`，类型用 `docs` / `fix` / `chore` / `feat`。例如：
  - `docs: 补充 2027.6 开发中说明`
  - `fix: 修复 /release-notes 跳转地址写死的问题`
- 用一句中文说清楚改了什么；不要只写「update docs」。

## 4. 推送

```bash
git push
```

- 推送当前分支到它的上游；没有上游时用 `git push -u origin <branch>`。
- 不要 `--force`，不要 `--amend` 已经推送过的提交。
- 推送失败（权限、冲突、网络）就原样报告，不要自行 rebase / merge / 重置分支。

## 5. 汇报

最后简短说明：

- 提交了哪些文件、commit hash；
- 推送到哪个分支。
