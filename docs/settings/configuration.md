---
title: 配置杂项
sidebar_position: 6
---

系统集成类的开关：搜索入口、托盘图标、焦点行为、语言等。

<img class="qk-shot" src="/img/docs/settings/configuration/light.webp" data-dark="/img/docs/settings/configuration/dark.webp" alt="配置杂项" />

## 选项说明

| 选项 | 平台 | 说明 |
| --- | --- | --- |
| 在 Spotlight 中搜索 Quicker 社区版动作 | macOS | 打开后可在系统 Spotlight（`⌘ Space`）里搜到动作并直接运行 |
| 启用搜索面板全局快捷键 | 全平台 | `Ctrl + Space` 在鼠标所在屏幕中央弹出搜索面板 |
| 在任务栏显示 Quicker 图标 | 全平台 | macOS 显示在顶部菜单栏（空间不足时会被折叠）；Linux 显示在托盘 |
| 运行动作前恢复上一个窗口的焦点 | macOS | 默认关闭；**macOS 27 上强制开启**，否则点面板里的动作后原应用会失去焦点 |
| 启用 Quicker Helper 进程 | macOS | 用于在 Dock 和 `⌘Tab` 切换器里显示图标，方便切回 Quicker，这在编辑动作时很有用 |
| 动作编辑器全局快捷键 | 全平台 | 随时打开动作编辑器 |
| 软件语言 | 全平台 | 中文 / English，**重启后生效** |

:::note[macOS 27 的焦点设置]
macOS 27 改变了窗口激活行为：点击面板里的动作会让原应用看起来「失活」。因此该选项在新系统上恒为开启，点击开关只会给出说明，不提供关闭。
:::
