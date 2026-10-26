# 附录 A｜Desktop Code 操作速查

> 依据官方 [桌面入门](https://code.claude.com/docs/en/desktop-quickstart) 与 [Desktop 参考](https://code.claude.com/docs/en/desktop)，核对日期 2026-10-26。界面会变；与你看到的不一致时，以界面和官方说明为准。**作者未逐项在应用内实测。**

## 提示框下方的控制行

环境（Local / Cloud / SSH / WSL）· 文件夹 · 权限模式 · 模型。

## 权限模式（官方名称）

Manual · Accept edits · Plan · Auto · Bypass。**Desktop 里 `Shift+Tab` 不用于循环切换模式**（官方说明）。选择见第 13 章。

## 窗格与快捷键（官方列出的）

| 窗格 | 快捷键 |
|---|---|
| Browser | Cmd+Shift+B |
| Changes / Diff | Cmd+Shift+D |
| Terminal | Ctrl+` |
| Plan 相关 | Cmd+Shift+M（以官方说明为准） |

另有 Files、Background tasks 窗格。

## 常见任务

| 我想 | 去看 |
|---|---|
| 打开本地项目、发出第一个任务 | 第 2、3 章 |
| 预览网页、让 Claude 点一点 | 第 17 章；`.claude/launch.json` |
| 看改了什么 | 第 15、19 章（Changes 窗格） |
| 并行会话、隔离 | 第 16 章（Worktree 开关默认关） |
| 会话归档的后果 | 第 16 章：Archive anyway 会丢弃未提交工作 |
| 代码审阅 | 第 19 章：`/code-review` |
| 云端、SSH | 第 30 章 |

## 系统差异

作者仅在 macOS 上做过本地实测。Windows、Linux、WSL 的差异只引用官方说明，未验证。
