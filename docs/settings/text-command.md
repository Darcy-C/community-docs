---
title: 文本指令
sidebar_position: 16
---

输入一个**缩写**，再按触发键（空格 / 回车 / Tab），发送一段文本或运行一个动作。该功能实现的原理是「按键检测 + 退格 + 动作触发（或发送文本）」。

<img class="qk-shot" src="/img/docs/settings/text-command/light.webp" data-dark="/img/docs/settings/text-command/dark.webp" alt="文本指令" />

## 一条指令包含

| 字段 | 说明 |
| --- | --- |
| 缩写 | 要匹配的字符串（例如邮箱前缀、常用回复的开头） |
| 触发字符 | 空格 / 回车 / Tab，可多选 |
| 操作 | **发送文本**（内容发送给前台应用）或 **运行动作**（按动作 ID） |
| 直接触发 | 开启后不需要触发字符，缩写一打完立刻执行 |
