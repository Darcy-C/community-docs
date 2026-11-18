---
title: Quicker 协议外部触发
sidebar_position: 2
---

通过 `quicker:` 网址从外部（浏览器、脚本、快捷指令、其他动作）触发社区版的某个功能。

**平台：仅 macOS**。

<!-- 协议是在 macOS 应用包里注册的；Linux 版没有注册 `x-scheme-handler`，链接不会拉起应用。 -->

## 支持的协议

| 协议 | 作用 |
| --- | --- |
| `quicker:runaction:<动作UID>` | 运行指定动作。UID 必须是 **32 位**，否则提示「找不到动作」 |
| `quicker:showpanel` | 把主面板移动到鼠标位置并显示 |
| `quicker:showmessage:<类型>:<文本>` | 弹出提示，类型见下 |
| `quicker:previewaction:<分享码>` | 从 getquicker.net 拉取**分享的动作**并在编辑器里打开（需要联网） |

提示类型：`success`（绿）、`warning`（黄）、`error`（红）、`info`（蓝，默认）。

## 编码规则

整串会先做一次 percent-decode，再用 `:` 最多切三段，所以：

- 文本里含空格、中文、`:`，**必须百分号编码**，否则会被切断或解析失败。
- 例：`quicker:showmessage:success:%E4%BF%9D%E5%AD%98%E6%88%90%E5%8A%9F` → 「保存成功」。

```bash
# 从终端触发
open "quicker:runaction:0123456789abcdef0123456789abcdef"
open "quicker:showmessage:info:hello%20world"
```

## 注意

- `runaction` 的触发方式会被标记为「外部触发」，方便动作里区分来源。
- `previewaction` 的参数是**动作库的ID**（`getquicker.net/Sharedaction?code=...` 里的 code）。
- 未知的 `quicker:` 子命令会被**静默忽略**，不会有任何提示。
