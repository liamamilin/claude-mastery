import { monthlyCount, totalPages } from './stats.js';

const KEY = 'reading_log_v1';
const form = document.querySelector('#form');
const list = document.querySelector('#list');
const summary = document.querySelector('#summary');

function load() {
  try { return JSON.parse(localStorage.getItem(KEY)) ?? []; } catch { return []; }
}
let books = load();

function save() { localStorage.setItem(KEY, JSON.stringify(books)); }

function render() {
  const now = new Date();
  summary.textContent = `共 ${books.length} 本，${totalPages(books)} 页；本月已读 ${monthlyCount(books, now.getFullYear(), now.getMonth() + 1)} 本`;
  list.replaceChildren();
  for (const book of books) {
    const li = document.createElement('li');
    li.textContent = `${book.title}（${book.pages} 页，${book.finished}）`;
    list.append(li);
  }
}

form.addEventListener('submit', event => {
  event.preventDefault();
  const title = form.elements.title.value.trim();
  const pages = form.elements.pages.value;
  const finished = form.elements.finished.value;
  books.push({ title, pages, finished });
  save();
  render();
  form.reset();
});

render();
