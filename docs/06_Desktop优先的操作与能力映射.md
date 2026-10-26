# 06｜Desktop Code 优先：每一步发生在哪里

## 三个容易混淆的入口

| 入口 | 适合 | 本书定位 |
|---|---|---|
| Claude Desktop **Chat** | 普通问答、探索和沟通 | 仅用于对照，不承担仓库实施教学 |
| Claude Desktop **Cowork** | 可委派的研究、文件与更长期非代码任务 | 知道与 Code 的区别；不是本书主路径 |
| Claude Desktop **Code** | 查看和修改项目、运行命令、审查 diff、预览应用 | **全书默认操作界面** |

## 典型 Desktop 学习路径

```text
打开 Claude Desktop
  → Code 标签页
  → 选择运行环境（本地优先）
  → 选择项目文件夹
  → 选择权限模式、模型（依据实际可用）
  → 发送一个可检查的任务
  → 观察执行记录 / 文件修改 / diff
  → 通过集成终端运行 / Browser pane 预览
  → 主动纠偏、记录结论与下一步
```

## 常见能力与证据

| 能力 | 入口 / 行为（以官方当前版为参照） | 如何验证 | 不可用时 |
|---|---|---|---|
| 传递上下文 | 提示区 `@文件名` 或附件 | Claude 指到实际文件与行/内容 | 输入文件路径、粘贴小片段、选择正确会话目录 |
| 改文件 | Code 会话执行 | Diff/文件系统变化 | 检查权限模式与目标目录 |
| 执行命令 | Integrated Terminal 或 Claude 工具 | 命令真实输出、退出状态 | 检查 PATH、开发依赖和环境 |
| 预览网页 | Browser pane + dev server | 页面可打开、能操作、无关键报错 | 浏览器手工打开 localhost；记录工具限制 |
| 比较变更 | Changes / diff | 修改范围符合预期 | 用 `git diff` 查看 |
| 工作树隔离 | Git 仓库开启 Worktree | 不同 worktree/branch 不相互覆盖 | 先单会话完成并提交，之后才练并行 |
| 项目约定 | `CLAUDE.md` | 开新会话仍依据规则行动 | 检查文件位置和是否实际加载 |
| Skills | `.claude/skills/.../SKILL.md` 或界面入口 | 能在本会话被调用并发挥作用 | 先手动执行同样流程 |
| 外部工具 | Connectors/MCP/Plugins | 明确的授权和真实工具回应 | 用离线样例，不要求订阅付费服务 |
| 子代理 | 支持时通过 subagent 功能 | 单独调查与总结有实质价值 | 主会话串行处理 |
| 云端/SSH | 环境选择器 | 确定文件位置和功能差异 | 默认 Local，先掌握基础 |
| Computer use | 实际支持时手动授权 | 真实截图/点击/应用状态 | 用预览浏览器或人的操作替代 |
| Design/Artifacts | 版本支持时探索 | 得到可查看的设计/作品 | HTML+CSS+SVG 实现，确保源码可版本管理 |

## 操作层级标注（每章强制执行）

- **[Desktop Code]** ：桌面 Code 会话中的动作。
- **[Desktop Browser]** ：Code 的预览/浏览器面板。
- **[Desktop Terminal]** ：Code 的集成终端。
- **[系统文件管理器]** ：macOS Finder / Windows File Explorer 等。
- **[浏览器 / GitHub]** ：普通浏览器的 GitHub 网站操作。
- **[CLI 可选]** ：只有需要时才补充终端 Claude Code 指令。
- **[教材站点练习]** ：GitHub Pages 上的模拟训练，**不会**真实执行 Claude Code。

## 教学示例的环境分支

### Local

默认路径。适合文件编辑、启动网站、浏览器预览、截图和交互验收。教材首个纵向切片用 Local，避免读者被 SSH/云端配置卡住。

### Cloud

视计划、组织授权与账号设置而定。不是用户本机磁盘副本；讲清远程仓库和本地文件操作差异，不假定 Desktop 内置浏览器能访问所有云端内容。

### SSH

有远程开发机时扩展。**不作为全书前置。** 预览访问、文件编辑、工具发现、权限和凭据可能与 Local 不同。提供跳过这一章的学习路线。

### Windows / macOS / Linux (beta)

不要在一张截图里承诺三种系统的所有按钮/快捷键都一样。主案例可用 macOS 实操做基线，关键步骤附 Windows 操作差异；Linux beta 的适用功能需另做验证或明确未测。
