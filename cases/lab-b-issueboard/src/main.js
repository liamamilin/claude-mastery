import { groupByStatus, countOpen, STATUSES } from './board.js';

const LABELS = { open: '待处理', 'in-progress': '进行中', done: '已完成' };
const board = document.querySelector('#board');
const summary = document.querySelector('#summary');

async function load() {
  try {
    const response = await fetch('data/issues.json');
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (error) {
    summary.textContent = '数据加载失败：' + error.message + '。请通过本地 http 服务打开本页，而不是双击文件。';
    return [];
  }
}

function render(issues) {
  const groups = groupByStatus(issues);
  summary.textContent = `共 ${issues.length} 个任务，未完成 ${countOpen(issues)} 个`;
  board.replaceChildren();
  for (const status of STATUSES) {
    const column = document.createElement('section');
    column.className = 'column';
    const heading = document.createElement('h2');
    heading.textContent = `${LABELS[status]}（${groups[status].length}）`;
    column.append(heading);
    for (const issue of groups[status]) {
      const card = document.createElement('article');
      card.className = 'card';
      const title = document.createElement('strong');
      title.textContent = issue.title;
      const meta = document.createElement('small');
      meta.textContent = `负责人：${issue.assignee ?? '未分配'}`;
      card.append(title, meta);
      column.append(card);
    }
    board.append(column);
  }
}

load().then(render);
