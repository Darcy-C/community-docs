---
title: 维护工具
sidebar_position: 7
---

数据目录入口，以及「共享子程序」的批量更新。

<img class="qk-shot" src="/img/docs/settings/maintenance/light.webp" data-dark="/img/docs/settings/maintenance/dark.webp" alt="维护工具" />

## 三个目录

| 目录 | 内容 |
| --- | --- |
| 根目录 | 全部用户数据（动作、设置、资源、数据库） |
| 状态数据目录 | 动作的运行状态、缓存 |
| 日志目录 | 运行日志，反馈问题时应提供 |

点击路径可直接在访达 / 文件管理器中打开。macOS 下默认位于 `~/Library/Application Support/QuickerCommunityEdition`。目录结构见 [用户数据文件夹结构](/tech/userdata-structure)。

## 共享子程序

从其他动作**复制**子程序时，得到的是一份独立副本（可以自由修改，和原动作再无关联）。如果这些副本都来自同一个子程序，它们共享同一个「子程序 ID」，可以用 **批量更新子程序…** 一次性把所有副本刷新成最新版本。

详细机制（复制语义、更新时机、内部 ID）见 [回调子程序](/tech/callback-subprogram)。

:::warning

批量更新会覆盖副本里的本地修改，操作前建议先用「导出」备份动作。

:::
