// 教师参考解决版：删除后调用 persist()。
const STORE_KEY = 'claude_mastery_persistence_bug_v1';
const initialTasks = [{ id: 'seed', name: '故障排查实验' }];
const tasksEl = document.querySelector('#tasks');
const infoEl = document.querySelector('#info');
const form = document.querySelector('#task-form');
function readTasks() {
  try {
    const saved = localStorage.getItem(STORE_KEY);
    const data = saved ? JSON.parse(saved) : initialTasks;
    return Array.isArray(data) ? data : [...initialTasks];
  } catch (_error) { infoEl.textContent = '本地存储不可用，请换用 localhost 同源地址预览。'; return [...initialTasks]; }
}
let tasks = readTasks();
function persist() {
  try { localStorage.setItem(STORE_KEY, JSON.stringify(tasks)); return true; }
  catch (_error) { infoEl.textContent = '写入本地存储失败。'; return false; }
}
function render() {
  tasksEl.replaceChildren();
  for (const task of tasks) {
    const row = document.createElement('li');
    const title = document.createElement('span'); title.textContent = task.name;
    const del = document.createElement('button');
    del.type = 'button'; del.textContent = '删除';
    del.addEventListener('click', () => removeTask(task.id));
    row.append(title, del); tasksEl.appendChild(row);
  }
  if (tasks.length === 0) {
    const li = document.createElement('li'); li.textContent = '当前页面没有任务'; tasksEl.appendChild(li);
  }
}
function removeTask(id) {
  tasks = tasks.filter(task => task.id !== id);
  persist();
  render();
  infoEl.textContent = '删除已保存。刷新后该任务不再恢复。';
}
form.addEventListener('submit', event => {
  event.preventDefault();
  const name = form.elements.name.value.trim(); if (!name) return;
  tasks.push({ id: `${Date.now()}-${Math.random()}`, name });
  persist(); render(); form.reset(); infoEl.textContent = '已新增并保存。';
});
document.querySelector('#reset').addEventListener('click', () => {
  tasks = [...initialTasks]; persist(); render(); infoEl.textContent = '已恢复练习初始状态。';
});
render();
// 确保第一轮删除有“旧数据”供刷新读取：初始状态保存一次。
if (tasks.length) {
  try { if (!localStorage.getItem(STORE_KEY)) persist(); }
  catch (_error) { infoEl.textContent = '无法访问本地存储，请尝试 localhost 预览。'; }
}
