---
title: 路径写法（macOS / Linux）
sidebar_position: 27
---

社区版跑在类 Unix 系统上，路径规则和 Windows 不同。这一页说清楚哪些地方会自动兼容、哪些不会。

## 基本规则

- 分隔符用 `/`：`/Users/name/Pictures/a.png`。
- 盘符不存在；家目录用 `~` 或 `$HOME`（能否展开取决于调用的模块）。
- 大小写敏感（APFS 默认不敏感，但 Linux 敏感），不要依赖大小写差异。

## 反斜杠 `\` 会怎样

部分模块会调用内部 `pathlike()` 把 `\` 换成 `/`，**但不是所有模块都这样**：

| 会自动转换 | 不会转换（原样使用） |
| --- | --- |
| 文件/路径提取类模块、压缩、读文件、下载、检查路径存在 | 「运行或打开」「获取文件夹路径」等直接使用路径的模块 |

所以：**一律写 `/`**，不要指望兼容层。写了 `a\b.jpg` 在不转换的模块里会当成文件名的一部分，找不到文件。

:::note[副作用]
在会自动转换的模块里，你也就**无法**通过它们创建/打开文件名中真的带 `\` 的文件。这是有意的取舍。
:::

## 常见路径对照

| 用途 | macOS | Linux |
| --- | --- | --- |
| 用户数据 | `~/Library/Application Support/QuickerCommunityEdition` | `~/.local/share/QuickerCommunityEdition` |
| 临时目录 | `/tmp`（建议用系统给的 temp） | `/tmp` |
| 应用 | `/Applications/Quicker社区.app` | AppImage 文件本身 |

需要「系统文件夹」的语义（图片、下载、桌面等）时，用「获取系统路径」模块（按平台返回对应目录）。

## 平台

这一页的规则 macOS 与 Linux 通用。
