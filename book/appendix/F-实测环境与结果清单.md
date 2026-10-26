# 附录 F｜已实测与未实测清单

**环境：** macOS（Darwin 25.6），Node v22.21.1，jq 1.7.1，Git 2.54.0，VitePress 1.6.4。日期 2026-10-26。

## 已实测

| 项目 | 结果 |
|---|---|
| 站点构建（含 `SITE_BASE` 子路径）、`npm ci` | 通过 |
| 子路径预览（`/claude-mastery/`） | 首页与章节 200，SVG 加载 |
| 首页、第 02 章 375px | 无横向溢出 |
| Lab A（增/刷新/删/空标题/非法网址） | 通过 |
| Lab B 基线与 trailing-comma 场景 | 5 任务 3/1/1 列；尾逗号 → 0 任务且无提示（缺陷） |
| Lab C 筛选、?empty、?error、窄屏对比 | 起始 scrollWidth 1016，solution 375 |
| Lab D 起始版与 solution | 缺陷复现；solution 通过 |
| Lab E `node test.mjs` | 3 项 PASS（Skill 脚本、Hook 退出码、MCP 协议） |
| Lab F 起始版 `test.mjs` | 4 项失败 3；仅修月份后月初检查在 `TZ=America/New_York` 仍失败 |
| Git 命令（第 15、16 章） | 临时目录实测通过 |
| 执行方式选择器 ModePicker | 5 条分支核对，控制台无错误 |

## 未实测（明示）

- **Claude Desktop 内的几乎所有界面操作**：控制行、窗格、`/init`、`/memory`、`/context`、Worktree 开关、`/code-review`、PR 监控；
- Skill 被发现与触发、Hook 在会话中真的触发、MCP 连接、子代理被委派；
- 云端、SSH、WSL、teleport；
- Claude in Chrome、Computer use、Claude Design、Artifacts；
- Windows、Linux；
- GitHub Actions 部署（**从未运行**）、GitHub Pages 线上效果；
- PDF / EPUB（未生成）；
- **真实 Claude Desktop 截图：无。**唯一的截图是 Lab C 的无头 Chrome 渲染。
