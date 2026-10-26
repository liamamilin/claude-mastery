# 《驾驭 Claude》写书与教学网站开发包｜从这里开始

> 目标产品：**Claude Mastery Lab｜驾驭 Claude：Claude Code Desktop 实战学院**
> 资料版本：2026-10-26；面向 Anthropic **Claude Desktop 的 Code 标签页**，CLI 是重要延伸但不是主入口。
> 本包包含：32 章课程任务书、实战案例蓝图、两章正文样稿、可运行的基础案例、VitePress 站点脚手架、交互练习、SVG、GitHub Pages 工作流、质量与出版要求。**这不是已写完的32章成书。**

## 给项目所有者

1. 解压本包到一个新目录，使用 Claude Desktop → **Code** 标签页打开该目录，选择 **Local** 环境，确认项目文件可见。
2. 直接把 `docs/14_直接交给Claude的启动指令.md` 的正文发给 Claude。`CLAUDE.md` 是简洁的项目常驻规则。
3. 首轮检查三个实际产物：**一本可读的书（至少三章）、一个能运行的案例、一个在桌面和手机都能阅读的网站**。不要因只看到好看的首页就判断书写完了。
4. 无自建服务器：最终网站发布在 **GitHub Pages**。预期仓库 `claude-mastery-lab`；仓库名可以更改，构建需自动适配 base。
5. 首次本地开发：运行 `npm install` 生成并提交 `package-lock.json`（本包没有预制锁文件）、`npm run dev` 预览、`npm run build` 验证；若网络、权限或依赖缺失，记录真实障碍再由 Claude 处理。
6. 未经明确授权，Claude 不应创建公开远端仓库、执行 push、购买额度或配置付费服务。

## 目录导航

| 路径 | 是什么 |
|---|---|
| `CLAUDE.md` | Claude Code 原生项目指引，保持短小，避免规则套规则 |
| `docs/01_...` ~ `docs/14_...` | 定位、目录、案例、写作规范、事实核验、视觉、技术与执行说明 |
| `book/` | **唯一教材正文源**，当前有导读及两章样稿（其余待写） |
| `book/.vitepress/` | 网站框架、主题和 Vue 交互组件 |
| `cases/lab-a-links/` | 可直接在浏览器打开的入门项目 |
| `cases/lab-d-persistence/` | 刻意保留一个真实持久化缺陷的诊断练习 |
| `book/public/figures/` | 可编辑 SVG 技术图解 |
| `.github/workflows/deploy.yml` | GitHub Pages 自动发布工作流 |
| `.claude/launch.json` | Desktop 预览服务器的基础配置（运行时可以修正） |
| `STATUS.md` | 真实完成状态，Claude 逐批更新 |

## 设计优先级

**有用的教材正文 > 可复现的真实案例 > 可操作的网站 > 精准图解/真实截图 > 纯装饰素材。**

全站静态：VitePress / Vue / SVG / GitHub Actions / GitHub Pages。普通读者不需要自备服务器，也不在网站上直接运行 Claude Code。

## 我们不做什么

- 不照搬另一套 Codex 教材，把“Codex”批量替换成“Claude”。每章围绕当前 Desktop **Code 标签页**的真实行为。
- 不虚构截图、输出、官方界面名称、版本号；界面会变，实际操作前须在当前 app 中核对。
- 不让 Claude 无限写计划、建立多层门禁或反复改规则来替代交付。
- 不将本包样稿宣称为完整出版物，电子书只有生成并能打开后才允许显示下载入口。

## 官方核验入口

- 桌面版入门：<https://code.claude.com/docs/en/desktop-quickstart>
- Desktop 完整参考：<https://code.claude.com/docs/en/desktop>
- 最佳实践：<https://code.claude.com/docs/en/best-practices>
- 静态站部署：<https://vitepress.dev/guide/deploy>
- Claude 的图像能力说明：<https://support.claude.com/en/articles/9002504-can-claude-produce-images>

本包编制时已经核对以上官方公开资料。**未来执行者仍须按实际版本复核。**
