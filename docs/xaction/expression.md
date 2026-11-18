---
title: 表达式
sidebar_position: 8
---

用 C# 语法写单行表达式，放在 `$=` 后面（或直接在表达式输入框里）。

## 怎么写

```text
$= {n} > 2
$= List.Count.ToString()
$= DateTime.Now.ToString("yyyy-MM-dd")
```

- 没有 `return`，**最后一行的值**就是结果；表达式模式会自动补分号。
- 变量按类型注入。
- 复杂逻辑写多行时，就是一段方法体（和「运行 C# 代码」模块同一套引擎）。

## 上下文对象

`_context`

| 成员 | 说明 |
| --- | --- |
| `ActionId` / `ActionTitle` | 当前动作的标识 |
| `IsRootContext` | 是否主流程 |
| `GetVarValue(name)` | 取变量值，不存在返回 `null` |
| `SetVarValue(name, value)` | 写变量值；变量不存在时返回 `false` 且不生效 |

想把自定义对象原样带回动作，目标变量的类型必须是 **动态对象**。

## 平台

macOS 与 Linux 都需要 .NET 7：macOS 用系统安装的运行时，Linux 已内置在软件内。C# 语言版本固定为 **C# 10**。

:::tip

只是想拼字符串或做简单判断，用 [插值](/xaction/interpolation) 更轻；表达式适合需要类型、方法调用或日期计算的场合。

:::
