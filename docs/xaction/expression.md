---
title: 表达式
sidebar_position: 8
---

用 C# 语法写单行表达式，放在 `$=` 后面（或直接在表达式输入框里），由 Roslyn 编译执行。需要 .NET 7 运行时。

## 怎么写

```text
$= {n} > 2
$= List.Count.ToString()
$= DateTime.Now.ToString("yyyy-MM-dd")
```

- 没有 `return`，**最后一行的值**就是结果；表达式模式会自动补分号。
- 变量按类型注入，见 [变量](/xaction/variable)。
- 复杂逻辑写多行时，就是一段方法体（和「运行 C# 代码」模块同一套引擎）。

## 上下文对象

| 成员 | 说明 |
| --- | --- |
| `ActionId` / `ActionTitle` | 当前动作的标识；**在纯表达式里通常是 `"Empty"`**（只有走模块执行时才有真实值） |
| `IsRootContext` | 是否主流程 |
| `GetVarValue(name)` | 取变量值，不存在返回 `null` |
| `SetVarValue(name, value)` | 写变量值；变量不存在时返回 `false` 且不生效 |

## 类型转换

- C# 的可枚举结果会被转成 Python 列表（`ToList`）。
- 数字、布尔、字符串、`DateTime` 按类型映射。
- **图片变量不能进表达式**：报 `image variables are not supported in expressions yet.`。
- 想把自定义对象原样带回动作，目标变量必须是 **动态对象**（见 [变量](/xaction/variable)）。

## 出错时

表达式错误会让该步骤失败，是否中断动作取决于步骤的「失败时中止」设置（默认不中断后续动作的判断要自己确认）。

## 平台

macOS 与 Linux 都需要 .NET 7：macOS 用系统安装的运行时，Linux 用包里内置的那份。C# 语言版本固定为 **C# 10**。

:::tip

只是想拼字符串或做简单判断，用 [插值](/xaction/interpolation) 更轻；表达式适合需要类型、方法调用或日期计算的场合。

:::
