const LABELS = { all: '全部', doing: '进行中', done: '已完成', todo: '未开始' };
const grid = document.querySelector('#grid');
const statusEl = document.querySelector('#status');
const params = new URLSearchParams(location.search);
let filter = 'all';

function loadData() {
  if (params.has('error')) throw new Error('模拟的加载失败');
  return params.has('empty') ? [] : window.COURSE_DATA;
}

function render() {
  let data;
  try { data = loadData(); } catch (error) {
    grid.replaceChildren();
    statusEl.textContent = '数据加载失败：' + error.message;
    return;
  }
  const shown = data.filter(item => filter === 'all' || item.status === filter);
  grid.replaceChildren();
  if (shown.length === 0) {
    statusEl.textContent = data.length === 0 ? '暂无数据。' : `没有“${LABELS[filter]}”的项目。`;
    return;
  }
  statusEl.textContent = `显示 ${shown.length} / ${data.length} 项`;
  for (const item of shown) {
    const card = document.createElement('article');
    card.className = 'card';
    const title = document.createElement('h2');
    title.textContent = item.name;
    const bar = document.createElement('div');
    bar.className = 'bar';
    const fill = document.createElement('span');
    fill.style.width = `${Math.round((item.done / item.total) * 100)}%`;
    bar.append(fill);
    const meta = document.createElement('div');
    meta.className = 'meta';
    const count = document.createElement('span');
    count.textContent = `${item.done} / ${item.total} 章`;
    const label = document.createElement('span');
    label.textContent = LABELS[item.status];
    meta.append(count, label);
    card.append(title, bar, meta);
    grid.append(card);
  }
}

for (const button of document.querySelectorAll('.filters button')) {
  button.addEventListener('click', () => {
    filter = button.dataset.filter;
    for (const other of document.querySelectorAll('.filters button')) other.setAttribute('aria-pressed', String(other === button));
    render();
  });
}
render();
