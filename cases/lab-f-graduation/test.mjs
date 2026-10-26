// 教师用：期望正确行为。起始版本应当失败（见 teacher-notes.md）。
import assert from 'node:assert/strict';
import { monthlyCount, totalPages } from './stats.js';

const books = [
  { title: 'A', pages: '100', finished: '2026-10-05' },
  { title: 'B', pages: '200', finished: '2026-10-31' },
  { title: 'C', pages: '50', finished: '2026-09-30' },
];
let failed = 0;
function check(name, fn) {
  try { fn(); console.log('PASS', name); } catch (error) { failed++; console.log('FAIL', name, '-', error.message.split('\n')[0]); }
}
check('总页数', () => assert.equal(totalPages(books), 350));
check('2026 年 10 月应读 2 本', () => assert.equal(monthlyCount(books, 2026, 10), 2));
check('2026 年 9 月应读 1 本', () => assert.equal(monthlyCount(books, 2026, 9), 1));
check('月初当天的书归属本月（与时区无关）', () => assert.equal(monthlyCount([{ title: 'D', pages: '1', finished: '2026-10-01' }], 2026, 10), 1));
process.exit(failed ? 1 : 0);
