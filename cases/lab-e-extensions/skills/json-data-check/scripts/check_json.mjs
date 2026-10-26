// 只读检查：能否解析 JSON，并在失败时给出行列号。
import { readFileSync } from 'node:fs';

const file = process.argv[2];
if (!file) { console.error('用法：node check_json.mjs <文件路径>'); process.exit(2); }

let text;
try { text = readFileSync(file, 'utf8'); }
catch (error) { console.error(`无法读取 ${file}：${error.message}`); process.exit(2); }

try {
  const value = JSON.parse(text);
  const kind = Array.isArray(value) ? `数组，${value.length} 项` : typeof value;
  console.log(`OK ${file}：合法 JSON（${kind}）`);
} catch (error) {
  console.error(`ERROR ${file}：${error.name}: ${error.message.split('\n')[0]}`);
  // 常见原因的定位提示：尾逗号（逗号后面紧跟 ] 或 }）。这是启发式检查，不是通用定位。
  const trailing = /,\s*[\]}]/.exec(text);
  if (trailing) {
    const before = text.slice(0, trailing.index).split('\n');
    console.error(`提示：第 ${before.length} 行第 ${before[before.length - 1].length + 1} 列的逗号后面直接是 ] 或 }（疑似尾逗号）。`);
  }
  process.exit(1);
}
