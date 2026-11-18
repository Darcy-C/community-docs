---
title: 运行 Python 代码
sidebar_position: 13
---

在动作里执行 Python，可以直接读写动作变量，适合处理文本、调用 Python 库。

## 用哪个步骤

模块列表里有两个相近的步骤，**新动作请用「运行 Python 片段」**：

| 步骤 | 状态 | 说明 |
| --- | --- | --- |
| 运行 Python 片段 | **推荐** | 动作变量直接变成 Python 变量，改完自动写回 |
| 运行 Python 代码 | 已过期（模块选择列表内不再显示了） | 旧步骤，只能通过 `quicker.context` 读写变量，仅为兼容旧动作保留 |

## 「运行 Python 片段」怎么用

```python
# 动作里的变量可以直接用
result = text.upper()          # 读 text
count = len(result)            # 写 count（变量已存在时才会写回）
```

- 动作变量被注入成 Python 全局变量。
- 执行结束后，**已存在的变量**会做类型转换并写回；新创建的全局变量不会变成动作变量。
- **没有输出**：结果要靠写回变量传给后续步骤。
- `print()` 的内容不会进日志，只出现在应用的标准输出里。

## 旧步骤（「运行 Python 代码」）

```python
quicker.context.SetVarValue("result", "hello")
```

它没有变量注入，只能通过 `quicker.context` 读写，已被标注为过期。除非在维护老动作，否则不要用。

## 环境与限制

- 与主程序同一个进程、同一个解释器：**没有沙箱**，可以 `import` 应用自带的依赖（`requests`、`orjson` 等），也能读写本地文件。
- 应用内是 Python 3.10，第三方库版本与应用一致。
- 异常会直接让步骤失败，错误信息形如 `脚本报错内容: ...`。
- 依赖 macOS 系统接口的库（`pyobjc` 等）在 Linux 上不可用。

:::tip
要跑**系统里的另一个 Python**（比如装了特定库的虚拟环境），用 [运行或打开](/xaction/run-or-open) 调用它，不要用本步骤。
:::
