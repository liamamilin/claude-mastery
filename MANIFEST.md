# 完整文件清单与验证边界

生成日期：2026-10-26

本包是《驾驭 Claude》教学网站的**开发与写书起点**：32章任务合同，完整示范章节2章，网站脚手架、可运行实验与部署配置。未声称32章已经写完。

## 已验证

- 文件结构、编号、JSON、SVG、书内相对链接：通过。
- Lab A / Lab D / Lab D 解答的 Node 状态逻辑测试：通过。
- 案例 JavaScript 与 HTML 样稿中的脚本语法：通过。
- GitHub Actions 工作流 YAML：可解析。

## 尚未验证

- 真实 Claude Desktop 会话、截图和操作界面（需在用户本机验收）。
- VitePress `npm install` 与 `npm run build`（当前环境未完成 npm 依赖安装；首次执行需生成 package-lock.json）。
- 浏览器桌面与手机真实交互：当前执行环境阻止 Chromium 访问 file:// 和 localhost；需由 Claude 接手后验收。
- GitHub Pages 线上部署与 PDF/EPUB 生成：尚未实施。

## 文件

- `.claude/launch.json`（224 B）
- `.claude/skills/chapter-craft/SKILL.md`（1,097 B）
- `.github/workflows/deploy.yml`（1,057 B）
- `.gitignore`（129 B）
- `CLAUDE.md`（1,983 B）
- `README.md`（1,787 B）
- `START_HERE.md`（3,723 B）
- `STATUS.md`（1,835 B）
- `book/.vitepress/config.mts`（2,177 B）
- `book/.vitepress/theme/components/DecisionLab.vue`（2,865 B）
- `book/.vitepress/theme/components/LandingHero.vue`（6,424 B）
- `book/.vitepress/theme/components/MasteryLoop.vue`（451 B）
- `book/.vitepress/theme/index.ts`（497 B）
- `book/.vitepress/theme/styles.css`（11,850 B）
- `book/00-导读.md`（2,822 B）
- `book/chapters/01-理解ClaudeDesktop的Code.md`（7,116 B）
- `book/chapters/22-停止反复补丁.md`（7,132 B）
- `book/index.md`（769 B）
- `book/public/figures/mastery-loop.svg`（2,894 B）
- `cases/lab-a-links/README.md`（1,458 B）
- `cases/lab-a-links/app.js`（3,193 B）
- `cases/lab-a-links/index.html`（1,290 B）
- `cases/lab-a-links/styles.css`（1,880 B）
- `cases/lab-d-persistence/README.md`（1,329 B）
- `cases/lab-d-persistence/app.js`（2,505 B）
- `cases/lab-d-persistence/index.html`（1,075 B）
- `cases/lab-d-persistence/solution/README.md`（583 B）
- `cases/lab-d-persistence/solution/app.js`（2,381 B）
- `cases/lab-d-persistence/styles.css`（1,646 B）
- `docs/01_本书定位与学习终点.md`（2,982 B）
- `docs/02_完整目录与逐章任务.md`（18,847 B）
- `docs/03_能力地图与案例分布.md`（2,304 B）
- `docs/04_六类贯穿案例与实验契约.md`（4,287 B）
- `docs/05_官方资料与版本核查.md`（5,586 B）
- `docs/06_Desktop优先的操作与能力映射.md`（4,060 B）
- `docs/07_章节正文写作标准.md`（3,252 B）
- `docs/08_网站产品规格与信息架构.md`（3,653 B）
- `docs/09_视觉系统_图解与真实截图.md`（3,939 B）
- `docs/10_交互练习与毕业考核.md`（3,024 B）
- `docs/11_技术架构与GitHubPages部署.md`（4,684 B）
- `docs/12_验证_证据和反复失败时的处理.md`（2,714 B）
- `docs/13_制作顺序与发布里程碑.md`（2,410 B）
- `docs/14_直接交给Claude的启动指令.md`（4,507 B）
- `package.json`（516 B）
- `reference-preview/README.md`（455 B）
- `reference-preview/index.html`（8,769 B）
- `scripts/test_cases.mjs`（3,754 B）
- `scripts/validate_package.py`（2,867 B）
