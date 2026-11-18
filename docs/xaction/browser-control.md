---
title: 浏览器控制
sidebar_position: 26
---

操作你**真实在用的浏览器**：打开/激活标签页、读取页面元素、执行脚本、填表单。

**平台：仅 macOS**（依赖 AppleScript / NSWorkspace），Linux 版隐藏该模块。

## 支持的浏览器

Chrome、Thorium、Edge、Safari、Arc、Vivaldi。

- Chromium 系（Chrome/Edge/Arc/Vivaldi/Thorium）走 AppleScript，可按标签页 id 精确操作。
- **Safari 不支持按标签页 id**：激活/关闭标签页这类操作会直接报错。

## 常用操作

| 操作 | 说明 |
| --- | --- |
| 打开网址 | 在指定浏览器里打开（可指定窗口/标签） |
| 激活标签页 / 关闭标签页 | 按 id |
| 获取元素信息 | 用 CSS 选择器，**返回所有匹配元素** |
| 修改元素 / 触发事件 | 只作用于**第一个**匹配元素 |
| 执行脚本 | 在页面里跑 JS |
| 等待加载完成 | 配合超时（毫秒），超时报「网页没有在规定的的时间内加载完成」 |

参数里可以指定 `browser`（自动 / chrome / msedge / safari），输出 「结果」 与 `browser`。

## 注意

- 元素读取需要浏览器开启「允许 JavaScript 来自 Apple 事件」（Chrome：视图 → 开发者 → 允许 Apple 事件中的 JavaScript）。
