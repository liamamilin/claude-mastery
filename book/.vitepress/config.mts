import { defineConfig } from 'vitepress'

function resolveBase(): string {
  const configured = process.env.SITE_BASE
  if (configured) {
    if (!configured.startsWith('/') || !configured.endsWith('/')) {
      throw new Error('SITE_BASE 必须以 / 开始和结束，例如 /claude-mastery-lab/')
    }
    return configured
  }
  const githubRepo = process.env.GITHUB_REPOSITORY
  if (!githubRepo) return '/'
  const [owner, repo] = githubRepo.split('/')
  if (!owner || !repo) return '/'
  return repo.toLowerCase() === `${owner}.github.io`.toLowerCase() ? '/' : `/${repo}/`
}

export default defineConfig({
  title: '驾驭 Claude · Claude Mastery Lab',
  description: 'Claude Code Desktop：从第一次操作，到真正驾驭复杂任务。非官方独立教学项目。',
  lang: 'zh-CN',
  base: resolveBase(),
  cleanUrls: false,
  head: [
    ['meta', { name: 'theme-color', content: '#0b1220' }],
    ['meta', { name: 'color-scheme', content: 'light dark' }],
  ],
  themeConfig: {
    siteTitle: '驾驭 Claude',
    nav: [
      { text: '首页', link: '/' },
      { text: '导读', link: '/00-导读' },
      { text: '章节', link: '/chapters/01-理解ClaudeDesktop的Code' },
      { text: '纠偏训练', link: '/chapters/22-停止反复补丁' },
    ],
    sidebar: [
      { text: '从这里开始', items: [{ text: '导读', link: '/00-导读' }] },
      { text: '第一部分 · 桌面工作台', items: [
        { text: '01 · 认识 Claude Desktop Code', link: '/chapters/01-理解ClaudeDesktop的Code' },
        { text: '02 · 安装、登录与第一个本地会话', link: '/chapters/02-安装登录与第一个本地会话' },
        { text: '03 · 发出第一个任务，看见文件变化', link: '/chapters/03-发出第一个任务看见文件变化' },
        { text: '04 · 桌面预览、终端与变更面板', link: '/chapters/04-桌面预览终端与变更面板' },
      ]},
      { text: '第二部分 · 从想法到可执行任务', items: [
        { text: '05 · 需求不清楚，如何探索', link: '/chapters/05-需求不清楚如何带Claude探索' },
        { text: '06 · 把成功定义为可观察的行为', link: '/chapters/06-把成功定义为可观察的行为' },
        { text: '07 · 写好任务说明', link: '/chapters/07-写好任务说明但不替Claude预设所有步骤' },
        { text: '08 · 探索、计划、小样、执行', link: '/chapters/08-探索计划小实验执行之间怎样切换' },
      ]},
      { text: '第三部分 · 理解项目与上下文', items: [
        { text: '09 · 接手不知道怎么运行的项目', link: '/chapters/09-接手不知道怎么运行的项目' },
        { text: '10 · 用附件、@文件、截图和日志给足证据', link: '/chapters/10-用附件文件截图和日志给足证据' },
        { text: '11 · CLAUDE.md、规则与记忆', link: '/chapters/11-CLAUDE-md规则与记忆怎样分工' },
        { text: '12 · 跨会话续写', link: '/chapters/12-跨会话续写让下一次会话接得上' },
      ]},
      { text: '第四部分 · 控制执行与版本', items: [
        { text: '13 · 权限模式与自主性', link: '/chapters/13-权限模式怎样设置合适的自主性' },
        { text: '14 · 看进度、打断与纠偏', link: '/chapters/14-看进度打断与纠偏' },
        { text: '15 · Git、diff、commit 与恢复', link: '/chapters/15-Git-diff-commit与安全恢复' },
        { text: '16 · 并行会话与 Worktree', link: '/chapters/16-并行会话与Worktree隔离' },
      ]},
      { text: '第五部分 · 验证、审查与交付', items: [
        { text: '17 · 桌面浏览器预览与自动验证', link: '/chapters/17-桌面浏览器预览与自动验证' },
        { text: '18 · 测试金字塔', link: '/chapters/18-测试金字塔启动不等于可用' },
        { text: '19 · 可视化 diff、代码审查与 PR', link: '/chapters/19-可视化diff代码审查与PR' },
        { text: '20 · 发布与交付', link: '/chapters/20-发布与交付别人能用才算完成' },
      ]},
      { text: '第七部分 · 扩展 Claude 的能力', items: [
        { text: '25 · Skills', link: '/chapters/25-Skills把有效方法变成可复用能力' },
        { text: '26 · Connectors、MCP 与 Plugins', link: '/chapters/26-Connectors-MCP与Plugins' },
        { text: '27 · Hooks', link: '/chapters/27-Hooks哪些步骤值得确定性自动执行' },
        { text: '28 · Subagents', link: '/chapters/28-Subagents分工与消耗' },
      ]},
      { text: '第六部分 · 错误、补丁与纠偏', items: [
        { text: '21 · 先判断问题发生在哪一层', link: '/chapters/21-先判断问题发生在哪一层' },
        { text: '22 · 停止反复补丁', link: '/chapters/22-停止反复补丁' },
        { text: '23 · 桌面环境与工具连接故障', link: '/chapters/23-桌面环境问题与工具连接故障' },
        { text: '24 · 回退、换方案与止损', link: '/chapters/24-回退换方案降范围与止损' },
      ]},
    ],
    outline: { level: [2, 3], label: '本页目录' },
    docFooter: { prev: '上一节', next: '下一节' },
    returnToTopLabel: '回到顶部',
    sidebarMenuLabel: '目录',
    search: { provider: 'local', options: { translations: {
      button: { buttonText: '搜索文章', buttonAriaLabel: '搜索文章' },
      modal: { noResultsText: '没有找到相关内容', resetButtonTitle: '清空搜索', footer: { selectText: '选择', navigateText: '切换', closeText: '关闭' } },
    } } },
  },
})
