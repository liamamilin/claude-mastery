# 项目状态

最近更新：2026-10-26（第七轮：第25–28章）

## 已完成
| 事项 | 状态 | 证据 |
|---|---|---|
| 资料包解压到项目目录 | 完成 | 原 zip 保留但已加入 `.gitignore` |
| 导读 + 第01–32章正文 + 附录A–F | 完成（无真实 Desktop 截图） | `book/00-导读.md`、`book/chapters/01–32`、`book/appendix/`；04–32 依据官方 desktop 与 best-practices 页（2026-10-26 读取） |
| 第22章 | 先行示范稿，未改动 | `book/chapters/22-*.md` |
| 新增 SVG 图解 | 完成 | `three-layers.svg`（第01章，已浏览器核对）、`three-evidence.svg`（第04章，尚未逐图目视核对） |
| 案例 B IssueBoard | 基线通过 | `cases/lab-b-issueboard/`：`node test.mjs` PASS；Browser 经 http 显示“共 5 个任务，未完成 4 个”，三列 3/1/1。trailing-comma 场景实测：200 OK、页面“共 0 个任务”且无错误提示、JSON.parse 报 SyntaxError；发现 main.js 错误提示被 render([]) 覆盖（真实次生缺陷，未修）。file:// 行为未实测 |
| Git 命令实测（第15、16章） | 通过 | 临时目录、macOS、Git 2.54.0：init/commit、status/diff、restore、revert、merge 冲突与 --abort、worktree add/list/remove（脏目录被拒）、merge 快进、branch -d |
| 案例 C Web Preview Lab | 通过 | `cases/lab-c-preview/`：筛选 6/2/1/3，?empty、?error 状态正确；起始版 375px 下 scrollWidth 1016（真实溢出缺陷），`solution/` 为 375；`app.js/index.html/data.js` 与 solution 逐字节相同 |
| 真实案例截图 | 1 张 | `book/public/screenshots/lab-c-mobile-compare.png`（无头 Chrome，375px iframe）；**不是** Claude Desktop 界面 |
| 发布验证（第20章） | 本地通过 | `SITE_BASE` 与 `GITHUB_REPOSITORY` 两种 base；`npm ci` 全新目录通过；子路径预览 200。**未推送、未发布** |
| 案例 E 能力扩展包 | 脚本层通过 | `cases/lab-e-extensions/`：`node test.mjs` 三项 PASS（Skill 脚本、Hook 退出码含缺 jq 时 fail-closed、MCP 服务器协议）。实测发现并修复：Node 22 错误信息无 position（改为尾逗号启发式定位）、Hook 缺 jq 时原版静默放行（改为阻止）。**未验证**：Desktop 是否发现 Skill、触发 Hook、连接 MCP、委派子代理 |
| SVG（第21章） | `fault-layers.svg`（已用无头 Chrome 渲染目视核对；`three-evidence.svg` 同） | |
| SVG | 新增 `memory-layers.svg`（第11章，已目视核对） | |
| 互动练习 Lab 2 执行方式选择器 | 完成 | `ModePicker.vue`，第08章；dev server 中 5 条分支结果逐一核对，控制台无错误 |
| Lab A 浏览器验收 | 通过 | 见下 |
| 站点构建 | 通过 | `npm install`、`npm run build`、`SITE_BASE=/claude-mastery/ npm run build` |
| 子路径预览 | 通过 | `vitepress preview` 于 `/claude-mastery/`：首页、章节页 200，SVG 图片加载，侧边栏列出 01/02/03/22 |
| 移动端 375px | 通过 | 首页与第02章无横向溢出；DecisionLab 点击出现反馈 |
| 事实核对 | 完成 | WebFetch 官方 desktop-quickstart 与 desktop 页（2026-10-26），用于第02、03章 |

## Lab A 验收记录（Browser pane，http://localhost:48123/，真实操作）
- 新增“Claude 官方文档 / https://code.claude.com/docs”→ 列表 1 条，提示“收藏已保存。” ✅
- 刷新 → 仍为 1 条 ✅
- 点击“删除” → 0 条，提示“已删除并保存。”；刷新 → 空状态文案 ✅
- 空标题 → “请填写收藏标题。” ✅；`ftp://` 网址 → “请输入包含 http:// 或 https:// 的有效网址。” ✅（这两项通过 form.requestSubmit 触发）
- 注：本机 8765、8791 端口已被其他项目占用，`launch.json` 改用 48123。
- **Lab D 浏览器验收通过**（2026-10-26）：起始版点击删除后页面清空、`localStorage` 值不变、刷新后任务回来；solution（配同一 index.html/styles.css）新增→存储 2 条→删除→存储 1 条→刷新仍 1 条。起始版未被修改。

## 缺口 / 限制
- **没有真实 Claude Desktop Code 界面截图**：浏览器工具无法保存图像文件，也不应伪造界面；需要在 Desktop 里手动截图或获得截屏授权。第02、03章已如实声明未附截图。
- 未验证 Linux、Windows 操作；第02章只引用官方说明。
- 互动练习已有 DecisionLab、ModePicker；读者自验清单尚未做。
- 第04–12章中的操作（含 /init、/memory、/context、交接流程）（launch.json、Browser 窗格、对比实验、搜索功能）为教学设计，作者未在 Claude Desktop 内逐步实测；Lab A 的搜索功能未实现验收。
- 未推送，GitHub Pages 未发布（需用户明确授权）。
- 未生成 PDF/EPUB。

| 案例 F 毕业题 | 脚本层通过 | `cases/lab-f-graduation/`：起始版 `test.mjs` 失败 3/4；仅修月份后 TZ=America/New_York 下月初检查仍失败（第二层时区缺陷）。浏览器验收通过（2026-10-26）：添加两本本月的书后页面显示“本月已读 0 本”（缺陷复现）；`pages` 留空存为空字符串，总页数不变；无 README（GOAL.md 为入口） |
| 第29–32章、附录A–F | 完成 | 第30、31章全部依据官方文档，作者未实测云端/SSH/Chrome/Computer use/Design（附录F明示）；构建通过 |

| 读者自验清单（Lab 3） | 完成 | `ReaderChecklist.vue`，接入第03、20章；勾选刷新后保留、清空生效，标注“自报，不是自动测试”；构建通过 |

## 下一动作
1. 真实 Claude Desktop 截图（需用户提供）。
2. 等用户授权后推送到 https://github.com/liamamilin/claude-mastery 并核对 Actions。
