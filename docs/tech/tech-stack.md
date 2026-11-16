---
title: 技术栈
sidebar_position: 6
---

社区版不是「把 Windows 版搬到 Mac」，而是用另一套技术栈**重新实现**了一遍。下表是当前代码里实际用的东西（版本以 C2027.6.0 的 `pyproject.toml` 为准）。

## 主体

| 层 | 技术 | 说明 |
| --- | --- | --- |
| 语言 / 运行时 | **Python 3.10** | `requires-python >= 3.10`，只在 3.10 上验证 |
| 界面 | **Qt 6 / PySide6 6.6.3** | 全部是原生 Widget，没有 Web 前端 |
| 编辑器步骤区 | 自绘图形视图 | 手写线性布局，没有用 Qt 的布局器 |
| 系统能力 | **pyobjc 10.1** + **C++17 pybind11 扩展** | Accessibility、事件监听、图像匹配等在原生扩展 `darcytool` 里 |
| C# 支持 | **pythonnet 3.0.5** + **Roslyn**（`QuickerRoslyn.dll`） | 运行时是 **.NET 7**（`Microsoft.NETCore.App 7.x`） |
| 数据 | **sqlite3** | 单文件 `userdata.sqlite3`，动作/场景/设置都在里面 |
| 辅助进程 | Swift 应用 **Quicker Helper** | 与主程序 IPC，负责 Dock/⌘Tab 图标等 |
| 打包 | **PyInstaller 6.12** | macOS 出 `.app`，Linux 出 `.AppImage` |

## 为什么钉在 PySide6 6.6.3

Qt 从 6.7 起放弃了 macOS 11，而项目要支持 **macOS 11+**，所以 PySide6 固定回 6.6.3。升级会同时抬高最低系统版本。

## 常用第三方库

| 用途 | 库 |
| --- | --- |
| JSON 加速 | `orjson` |
| LRU 缓存 | `lru-dict` |
| 文件监听 | `watchdog` |
| 代码编辑 / 补全 | `tree-sitter`、`jedi`、Monaco（独立窗口） |
| 图像 / OCR | OpenCV + 系统 Vision（macOS） |
| AI 规划 | `zhipuai`（酷调用） |
| Python 表达式 | `pydantic-monty`（`@=` 的受限解释器） |

## 平台矩阵

| | macOS | Linux |
| --- | --- | --- |
| 架构 | arm64 / x86_64 | arm64 / x86_64 |
| 最低系统 | macOS 11 | glibc ≥ 2.31，仅 X11 |
| 图形会话 | 原生 | X11（**Wayland 不支持**：无法监听/拦截全局输入） |
| 打包 | `.app`（含签名与公证流程） | AppImage（在 `debian:11` 容器里按架构构建） |
| 原生扩展 | `darcytool`（含 AX / EventTap / 图像匹配） | `darcytool`（仅图像匹配部分） |
| .NET / Roslyn | 使用系统安装的 .NET 7 | 包内内置 .NET 与 Roslyn |
| 平台专属模块 | 较多（Vision、AppleScript、Accessibility…） | 见 [模块实现进度](/xaction/module-progress) 的 Linux 列 |

## 与「Windows 版 Quicker」的关系

| Windows 版 | 社区版 |
| --- | --- |
| C# / WinForms / WebView2 | Python / Qt Widgets / WKWebView |
| Windows 系统 API | macOS Cocoa / Accessibility；Linux X11 |
| 组合动作编辑器是 Web 前端 | 原生自绘（旧 Web 编辑器已停用） |

动作定义（`qka` JSON）尽量兼容，靠 [转译流程](/tech/translation) 转换进来。

:::note

「WebView2 浏览器窗口」模块名字沿用上游，实际在 macOS 上用的是 **WKWebView**（见 [WebView2 浏览器窗口](/xaction/webview2)）。

:::
