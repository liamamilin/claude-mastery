# 项目状态

最近更新：2026-10-26（第一轮纵向切片）

## 已完成
| 事项 | 状态 | 证据 |
|---|---|---|
| 资料包解压到项目目录 | 完成 | 原 zip 保留但已加入 `.gitignore` |
| 导读 + 第01、02、03章正文 | 完成（无真实 Desktop 截图） | `book/00-导读.md`、`book/chapters/01–03` |
| 第22章 | 先行示范稿，未改动 | `book/chapters/22-*.md` |
| 新增 SVG 图解 | 完成 | `book/public/figures/three-layers.svg`，用于第01章；已在浏览器核对渲染 |
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
- Lab D 仍只有 Node 逻辑测试，未在浏览器验收；不标为已验证。

## 缺口 / 限制
- **没有真实 Claude Desktop Code 界面截图**：浏览器工具无法保存图像文件，也不应伪造界面；需要在 Desktop 里手动截图或获得截屏授权。第02、03章已如实声明未附截图。
- 未验证 Linux、Windows 操作；第02章只引用官方说明。
- 仅 DecisionLab 一个互动练习；执行方式选择器、自验清单尚未做。
- 未推送，GitHub Pages 未发布（需用户明确授权）。
- 未生成 PDF/EPUB。

## 下一动作
1. 第04章（桌面预览、终端与变更面板）+ 对应 SVG。
2. 第05–08章，及 Lab 2「执行方式选择器」。
3. 等用户授权后推送到 https://github.com/liamamilin/claude-mastery 并核对 Actions。
