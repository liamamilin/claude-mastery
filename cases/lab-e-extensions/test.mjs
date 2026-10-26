// 验证案例 E 的三个可运行部分：Skill 脚本、Hook 脚本、MCP 服务器。
// 注意：这些测试只证明“脚本本身按预期工作”，不证明 Claude Desktop 会加载或触发它们。
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const here = fileURLToPath(new URL('.', import.meta.url));
const run = (cmd, args, input) => spawnSync(cmd, args, { input, encoding: 'utf8' });

// 1. Skill 脚本
const good = run('node', [`${here}skills/json-data-check/scripts/check_json.mjs`, `${here}../lab-b-issueboard/data/issues.json`]);
assert.equal(good.status, 0); assert.match(good.stdout, /合法 JSON（数组，5 项）/);
const bad = run('node', [`${here}skills/json-data-check/scripts/check_json.mjs`, `${here}../lab-b-issueboard/scenarios/trailing-comma/issues.json`]);
assert.equal(bad.status, 1); assert.match(bad.stderr, /SyntaxError/); assert.match(bad.stderr, /提示：第 6 行第 \d+ 列的逗号后面直接是/);
console.log('PASS skill script: 合法文件 OK，尾逗号文件报告行列号提示');

// 2. Hook 脚本
const hook = path => run('bash', [`${here}hooks/protect-files.sh`], JSON.stringify({ tool_name: 'Edit', tool_input: { file_path: path } }));
assert.equal(hook('/proj/data/issues.json').status, 2);
assert.equal(hook('/proj/package-lock.json').status, 2);
assert.equal(hook('/proj/src/main.js').status, 0);
assert.match(hook('/proj/.env').stderr, /Blocked/);
// 缺少 jq 时必须保守阻止（fail closed），而不是静默放行
const noJq = spawnSync('/bin/bash', [`${here}hooks/protect-files.sh`], { input: '{}', encoding: 'utf8', env: { PATH: '/bin' } });
assert.equal(noJq.status, 2); assert.match(noJq.stderr, /未找到 jq/);
console.log('PASS hook script: 受保护文件退出码 2，普通文件退出码 0，缺 jq 时阻止');

// 3. MCP 服务器
const messages = [
  { jsonrpc: '2.0', id: 1, method: 'initialize', params: { protocolVersion: '2025-03-26', capabilities: {}, clientInfo: { name: 't', version: '0' } } },
  { jsonrpc: '2.0', method: 'notifications/initialized' },
  { jsonrpc: '2.0', id: 2, method: 'tools/list' },
  { jsonrpc: '2.0', id: 3, method: 'tools/call', params: { name: 'list_issues', arguments: { status: 'done' } } },
  { jsonrpc: '2.0', id: 4, method: 'tools/call', params: { name: 'nope' } },
].map(m => JSON.stringify(m)).join('\n') + '\n';
const out = run('node', [`${here}mcp/issues-server.mjs`], messages).stdout.trim().split('\n').map(JSON.parse);
assert.equal(out.length, 4);
assert.equal(out[0].result.serverInfo.name, 'lab-b-issues');
assert.equal(out[1].result.tools[0].name, 'list_issues');
assert.deepEqual(JSON.parse(out[2].result.content[0].text).map(i => i.id), [3]);
assert.equal(out[3].error.code, -32602);
console.log('PASS mcp server: initialize / tools/list / tools/call / 未知工具报错');
