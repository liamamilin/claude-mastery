# 11｜GitHub Pages 发布：没有服务器也能做出精美教学网站

## 固定目标和技术取舍

- **托管**：GitHub Pages（公开仓库用于免费静态发布；具体 GitHub 计划限制以当前官方说明为准）。
- **生成**：VitePress + Vue + 自定义 CSS/SVG，负责 Markdown、导航、搜索、交互式训练。
- **自动构建**：GitHub Actions；发布构建产物 `book/.vitepress/dist`。
- **唯一人工维护的正文**：`book/00-导读.md`、`book/chapters/*.md`；网页以这些文件直接生成，未来 PDF/EPUB 也从相同源稿输出。
- **不用的东西**：公网常驻服务器、用户系统、服务器数据库、在线执行 Claude Code 的 API、付费部署平台。

## 目录建议（本包脚手架已具备主要骨架）

```text
./
├── START_HERE.md
├── CLAUDE.md
├── docs/                        # 写作与技术规格
├── book/
│   ├── index.md                 # 品牌首页
│   ├── 00-导读.md
│   ├── chapters/*.md            # 唯一正文源
│   ├── .vitepress/
│   │   ├── config.mts
│   │   └── theme/
│   │       ├── index.ts
│   │       ├── styles.css
│   │       └── components/*.vue
│   └── public/figures/*.svg
├── cases/                       # 可运行实验源码
├── .claude/launch.json          # Code Desktop dev server 预览配置
├── .github/workflows/deploy.yml
├── package.json                # npm scripts
├── package-lock.json           # 首次 npm install 后生成并提交
└── STATUS.md
```

## 必须真正解决的 base

项目仓库 `https://github.com/<owner>/claude-mastery-lab` 的 Pages 地址通常是：

`https://<owner>.github.io/claude-mastery-lab/`

因此构建时 `base` 为 `/claude-mastery-lab/`，不能一直用 `/`。本包示例 `book/.vitepress/config.mts` 在 GitHub Actions 下读取 `GITHUB_REPOSITORY` 自动得到仓库名；可用 `SITE_BASE` 显式覆盖。若发布为用户主页 `<owner>.github.io`、组织主页或独立域名，需将 base 调整为 `/` 或实际路径。

- 网站和 Vue 组件应使用框架的相对路径或 `withBase()`，不要在 CSS 和组件里硬编码 `/assets/`。
- 静态资源放在 `book/public/`，图片、下载地址都需做子路径测试。
- 仅 `npm run dev` 正常并不能说明 Pages 子路径部署正常；必须在目标 base 构建并预览。

## 开发、验证与发布命令

```sh
node --version            # VitePress 目前要求 Node 22+，执行时以官网为准
npm install               # 初次安装并生成 package-lock.json
npm run dev               # VitePress 本地预览
npm run build             # 构建 book/.vitepress/dist
npm run preview           # 预览构建产物
SITE_BASE=/claude-mastery-lab/ npm run build  # macOS / Linux 测试子路径
```

Windows PowerShell 环境变量示例：

```powershell
$env:SITE_BASE='/claude-mastery-lab/'
npm run build
Remove-Item Env:SITE_BASE
```

`npm ci` 只能在 `package-lock.json` 存在并且与 `package.json` 一致时工作；**首次由 Claude 实际执行 `npm install` 并提交锁文件**。本资料包不是 CI 已通过的证明。

## GitHub Actions

本包 `.github/workflows/deploy.yml` 实现：checkout → setup-node → `npm ci` → `npm run build` → upload-pages-artifact → deploy-pages。启用步骤：

1. 由用户授权或自己创建 GitHub 仓库；推送前检查无 `.env`、token、私有文件、个人信息或未经授权截图。
2. GitHub → Repository Settings → Pages → Build and deployment → **Source: GitHub Actions**。
3. 在 main 分支 push（**只在获得用户明确授权后**），观察 Actions 日志和 Pages 地址。
4. 用普通浏览器打开项目子路径，检查章节、图片、搜索、练习、下载链接、移动端。

在 GitHub 上公开 `git push` 是明确的对外发布操作；Claude 不应代替用户默默执行。

## 本地与线上验收必须分开

**本地**：能安装、构建、预览，关键按钮能操作；32章中每个导航链接有真实正文；故障练习能重置；Lab A/D 能运行。

**线上**：成功打开 Pages URL、图片/JS路径正确、搜索和交互可用、深链接刷新正常、无私密文件泄露。

## 可选电子书

PDF/EPUB 在写好正文后离线生成，再作为静态资源发布；构建不要求在线 PDF 服务。生成时抽查章节顺序、中文字体、目录、代码溢出和图中文字。只有真实存在并打开通过的文件才显示下载入口。

官方部署说明：<https://vitepress.dev/guide/deploy>
