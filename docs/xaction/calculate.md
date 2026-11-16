---
title: 计算
sidebar_position: 19
---

对表达式求值。社区版用 Python 实现（`simpleeval`），不是 C# 词法器，但常用函数的语义与 Quicker 一致。

## 两种模式

| 模式 | 能写什么 |
| --- | --- |
| 普通模式 | 纯数学表达式，例如 `(1+2)*3`、`Sqrt(16)` |
| 增强模式 | 额外支持 `{变量名}` 取变量，以及 `Math` 对象（`Math.Sqrt`、`Math.PI`、`Math.E`） |

## 支持的函数

| 类别 | 函数 |
| --- | --- |
| 三角函数 | `Sin` `Cos` `Tan` `Asin` `Acos` `Atan` `Atan2` |
| 其他 | `Abs` `Sqrt` `Pow` `Log` `Log10` `Exp` `Floor` `Ceiling` `Round` `Truncate` `Min` `Max` `Sign` |

## 与 C# 的差异

- **`^` 是乘方**，不是异或：`2^10` = 1024。（社区版特意把 `^` 重映射成了幂运算。）
- 结果是 Python 的 `int`/`float`，需要整数时自己 `Floor`/`Round`。
- `Sign(0)` 会除零报错（C# 返回 0），不要对可能为 0 的值直接用。
- 出错时步骤报错：`计算执行错误: ...`。

## 平台

macOS 与 Linux 都用同一套 Python 实现，行为完全一致。

:::tip

要做字符串处理、日期计算，用 [表达式](/xaction/expression)（C# 语法）更合适；「计算」只做数学，速度更快。

:::
