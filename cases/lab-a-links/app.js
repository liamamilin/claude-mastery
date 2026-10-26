// Lab A 正常版：一条收藏的生命周期为 新增→保存→刷新→删除→保存。
const STORE_KEY = 'claude_mastery_links_v1';
const listElement = document.querySelector('#list');
const countElement = document.querySelector('#count');
const messageElement = document.querySelector('#message');
const form = document.querySelector('#form');

let storageOkay = true;
function readLinks() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch (_error) {
    storageOkay = false;
    return [];
  }
}
let links = readLinks();

function persist() {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(links));
    return true;
  } catch (_error) {
    storageOkay = false;
    return false;
  }
}
function showMessage(message) { messageElement.textContent = message; }
function normalizedUrl(value) {
  const url = new URL(value);
  if (!['http:', 'https:'].includes(url.protocol)) throw new Error('只允许 http 或 https 网址');
  return url.href;
}
function render() {
  listElement.replaceChildren();
  countElement.textContent = `${links.length} 条`;
  if (links.length === 0) {
    const empty = document.createElement('li');
    empty.className = 'empty';
    empty.textContent = '暂时没有收藏。添加一条网址试试看。';
    listElement.appendChild(empty);
  }
  for (const item of links) {
    const li = document.createElement('li'); li.className = 'entry';
    const wrapper = document.createElement('div');
    const link = document.createElement('a');
    link.href = item.url; link.textContent = item.title;
    link.target = '_blank'; link.rel = 'noopener noreferrer';
    const location = document.createElement('small'); location.textContent = item.url;
    wrapper.append(link, location);
    const remove = document.createElement('button');
    remove.type = 'button'; remove.textContent = '删除';
    remove.setAttribute('aria-label', `删除收藏：${item.title}`);
    remove.addEventListener('click', () => {
      links = links.filter(linkItem => linkItem.id !== item.id);
      if (persist()) showMessage('已删除并保存。'); else showMessage('存储不可用；刷新后可能恢复。');
      render();
    });
    li.append(wrapper, remove); listElement.append(li);
  }
}
form.addEventListener('submit', (event) => {
  event.preventDefault();
  const title = form.elements.title.value.trim();
  const value = form.elements.url.value.trim();
  if (!title) { showMessage('请填写收藏标题。'); return; }
  let url;
  try { url = normalizedUrl(value); } catch (_error) { showMessage('请输入包含 http:// 或 https:// 的有效网址。'); return; }
  links.unshift({ id: (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`), title, url });
  if (persist()) showMessage('收藏已保存。'); else showMessage('本地存储不可用，当前页面中的数据刷新后可能丢失。');
  form.reset(); render();
});
render();
if (!storageOkay) showMessage('此浏览器或页面来源可能不支持本地存储。请尝试 localhost 预览。');
