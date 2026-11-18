---
title: “Quicker 组合动作”转译流程
sidebar_position: 5
---

把 Windows 版 Quicker 的动作（`.qka` / 分享链接）转换成社区版能运行的格式。转换在**内存里**完成，不落中间文件。

:::warning[转译不等于能用]
转换只解决「动作定义格式」这一层。社区版没有实现的模块、平台专属的模块（AppleScript、Vision、注册表等）转过来仍然是空的，实际运行时多半要自己重写对应步骤。**基本很难希望 Windows 动作导入后直接跑通。**
:::

## 入口

| 入口 | 说明 |
| --- | --- |
| 粘贴分享链接 | 在面板**空按钮**上右键粘贴 `https://getquicker.net/Sharedaction?code=...`，会联网下载并转换 |
| 拖入本地文件 | 把本地导出的分享 JSON 拖进面板（需要是带 `Data` 键的分享记录，裸 `qka` 不接受） |
| URL 协议 | `quicker:previewaction:<分享码>`（仅 macOS），转换后直接在编辑器打开 |
| 反向导出 | 动作右键可导出为 `qka`，也可以分享回 getquicker.net |

## 流程

```text
分享链接 / 文件
      ↓
GetSharedActionByLink 接口（或本地 JSON）
      ↓
translate()：逐步骤映射模块 key、转换变量类型
      ↓
直接写入 sqlite（actions 表）
```

转换后存的是社区版自己的动作数据；**不会生成也不会保存 `qka` 文件**。
