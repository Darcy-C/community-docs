---
title: 设置页说明
sidebar_position: 1
---

设置窗口（`⌘,` 或从托盘/面板菜单打开）左侧固定为三部分：**功能页**、**触发方式**、以及各页右上角的开关。本目录按设置窗口**实际存在的页面**逐页说明，截图取自当前版本（C2027.6.0）的真实界面。

> 截图会跟随站点明暗主题自动切换：页面是深色主题时显示深色截图。

## 页面一览

| 页面 | 作用 |
| --- | --- |
| [关于 Quicker](/settings/about) | 版本信息、实验室入口、按键状态自检 |
| [动作与场景管理](/settings/actions) | 管理场景（动作页）及其顺序 |
| [外观](/settings/appearance) | 面板、轮盘的配色与尺寸，应用字体 |
| [前台黑名单](/settings/blacklist) | 指定应用在前台时不再响应触发 |
| [配置杂项](/settings/configuration) | Spotlight、搜索面板快捷键、托盘图标、语言等 |
| [维护工具](/settings/maintenance) | 数据目录、共享子程序批量更新 |
| [弹出面板](/settings/panel) | 面板的鼠标/键盘/触控板触发方式 |
| [弹出轮盘菜单](/settings/circle-menu) | 轮盘的触发键、场景动作、第三圈 |
| [左键辅助](/settings/left-button) | 按住左键 + 按键触发动作 |
| [自动运行动作](/settings/auto-run) | 按 cron 规则定时运行动作 |
| [动作全局快捷键](/settings/action-hotkeys) | 给单个动作绑定系统级快捷键 |
| [面板动作触发键](/settings/panel-keys) | 面板打开后按键触发对应位置的按钮 |
| [扩展热键](/settings/power-keys) | 普通键当组合键用（引导键 + 次键） |
| [按键双击](/settings/dblclick) | 双击单个按键触发动作 |
| [文本指令](/settings/text-command) | 缩写 + 触发键，发送文本或运行动作 |
| [事件触发](/settings/event-triggers) | 系统事件（切换应用、唤醒等）触发动作 |

## 平台支持

设置窗口在 macOS 和 Linux（X11）上都可用，但个别页面和选项是平台独有的，各页会单独标注：

| 功能 | macOS | Linux (X11) |
| --- | --- | --- |
| 弹出面板 / 轮盘 / 左键辅助 / 文本指令 | ✅ | ✅ |
| 扩展热键（引导键） | ✅ | ❌ 页面直接隐藏，见 [扩展热键](/settings/power-keys) |
| 触控板触发（四指、Command 键） | ✅ | ❌ 无对应硬件与系统接口 |
| 事件触发 | ✅ 13 种事件 | ⚠️ 仅「应用激活」 |
| Spotlight 搜索、Helper 进程 | ✅ | ❌ |
| 全局输入（按键/鼠标监听） | 需授权「辅助功能」 | 需 X11 会话，Wayland 不支持 |

> Linux 版本整体仍在完善中，Wayland 下无法监听或拦截全局输入，只能用 X11 会话。
