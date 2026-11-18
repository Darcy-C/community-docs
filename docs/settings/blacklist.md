---
title: 前台黑名单
sidebar_position: 5
---

当**前台应用**在黑名单里时，Quicker 会尽可能不响应（不拦截）快捷键与鼠标触发，把按键交还给该应用。

<img class="qk-shot" src="/img/docs/settings/blacklist/light.webp" data-dark="/img/docs/settings/blacklist/dark.webp" alt="前台黑名单" />

## 用法

1. 点 **添加应用程序…**，从当前正在运行的应用列表里选一个。
2. 需要移除时，在列表里右键点删除。

## 什么时候需要它

- 玩游戏、用远程桌面、用虚拟机时，避免触发键被 Quicker 抢走。
- 某些软件自己用 Ctrl 组合键、右键拖动，和 Quicker 的触发方式冲突。
- 输入法、截图工具的快捷键与 Quicker 冲突。

:::note

匹配的是**应用名**，不是窗口标题。同一个应用的所有窗口都受影响。

:::

:::tip

只是想避免误触，不一定非要加黑名单：把触发方式试着换一换，也可能可以解决误触问题。

:::
