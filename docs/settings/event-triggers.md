---
title: 事件触发
sidebar_position: 17
---

当系统发生特定事件时自动运行动作，例如「换到某个应用」「屏幕唤醒」「Mac 即将睡眠」。

<img class="qk-shot" src="/img/docs/settings/event-triggers/light.webp" data-dark="/img/docs/settings/event-triggers/dark.webp" alt="事件触发" />

## 支持的事件

| 事件 | macOS | Linux (X11) |
| --- | --- | --- |
| 应用被激活 | ✅ | ✅ |
| 应用失去激活 | ✅ | ❌ |
| 应用即将启动 / 已启动 / 已退出 | ✅ | ❌ |
| 应用被隐藏 / 取消隐藏 | ✅ | ❌ |
| 活动空间切换 | ✅ | ❌ |
| Mac 唤醒 / 即将睡眠 / 即将断电 | ✅ | ❌ |
| 屏幕休眠 / 屏幕唤醒 | ✅ | ❌ |

Linux 上目前只会上报「应用被激活」，其余事件不会触发（X11 的前台应用轮询只能拿到激活事件）。

## 规则字段

- 事件类型、目标动作、动作参数、启用开关、备注。
:::
