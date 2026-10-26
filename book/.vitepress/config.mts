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
      ]},
      { text: '第六部分 · 纠偏（先行示范）', items: [
        { text: '22 · 停止反复补丁', link: '/chapters/22-停止反复补丁' },
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
