---
title: 用户数据文件夹结构
sidebar_position: 3
---

所有用户数据都在一个目录里。删除它等于恢复出厂设置（动作、设置、状态一起没）。

| 平台 | 路径 |
| --- | --- |
| macOS | `~/Library/Application Support/QuickerCommunityEdition` |
| Linux | `~/.local/share/QuickerCommunityEdition` |

在应用里打开：**设置 → 维护工具**（根目录 / 状态 / 日志三个入口）。

## 里面有什么

```text
QuickerCommunityEdition/
├── userdata.sqlite3     # 动作、场景、设置
├── backup/              # 数据库升级前的自动备份
├── state/               # 每个动作一个状态文件
├── log/                 # 调试运行留下的记录
├── cache/               # 网络图片缓存
├── temp/                # 截图等临时文件
└── fault_traceback.txt  # 启动时清空；非空说明上次是崩溃退出
```

:::note
设置没有单独的配置文件，也在 `userdata.sqlite3` 里。备份或重置设置，备份这个文件即可。
:::

- `backup/` 只在**数据升级**时生成，平时是空的。
- `state/` 每个动作一个文件，外加一个全局状态文件；**不会自动清理**，用久了文件会很多（几万个属正常）。
- `log/` 只保存「调试运行」的输出。日常运行不落盘，反馈问题时请打开调试模式再跑一次。
- `fault_traceback.txt` 启动时会被清空；如果启动后发现它有内容，说明上次进程是崩溃退出的。

## 移动 / 迁移

- 换机器：退出应用后整目录拷贝即可。
- 只想搬动作：用动作的「导出」，或拷贝 `userdata.sqlite3` 后在新机器上覆盖（同版本更安全）。
- **不要**在应用运行时手动改数据库。
