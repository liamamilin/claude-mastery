# 驾驭 Claude · Claude Mastery Lab

**Claude Code Desktop 实战教材与 GitHub Pages 教学网站的开发资料包。**

> 非官方独立教育项目，和 Anthropic 无隶属关系。当前是**写书规格 + 两章示范正文 + 站点脚手架 + 两个实验源码**，并非32章已完成的成书。

## 交给 Claude 开始做

阅读 [`START_HERE.md`](./START_HERE.md) 与 [`docs/14_直接交给Claude的启动指令.md`](./docs/14_直接交给Claude的启动指令.md)，然后在 Claude Desktop **Code** 标签页里打开项目目录执行。默认开发环境为 Local。

```sh
npm install                 # 先安装依赖并生成 package-lock.json
npm run dev                 # 本地查看书站
npm run build               # 生成纯静态网站
npm run preview             # 检查生成结果
node scripts/test_cases.mjs # 不依赖 npm 包的案例状态逻辑测试
python3 scripts/validate_package.py # 包结构与文稿链接检查
```

## 发布

网站最终部署到 GitHub Pages，不需要自建服务器或后台数据库；仓库项目页的子路径由构建配置处理。**公开部署须项目所有者授权。**

详细发布步骤见 [`docs/11_技术架构与GitHubPages部署.md`](./docs/11_技术架构与GitHubPages部署.md)。

## 目前可看什么

- `reference-preview/index.html`：无需 npm 的首页视觉方向演示，非正式网站。
- `book/chapters/01-理解ClaudeDesktop的Code.md`：第一章完整教学样稿。
- `book/chapters/22-停止反复补丁.md`：第二十二章完整教学样稿。
- `cases/lab-a-links/index.html`：真正可使用的静态收藏工具。
- `cases/lab-d-persistence/index.html`：故意保留删除持久化缺陷的纠偏练习。

实际完成状态详见 [`STATUS.md`](./STATUS.md)。
