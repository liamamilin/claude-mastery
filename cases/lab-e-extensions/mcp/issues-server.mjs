// 最小 MCP 服务器（stdio，零依赖）：只读暴露 Lab B 的任务数据。
// 协议：每行一个 JSON-RPC 消息。仅实现 initialize / tools/list / tools/call，足够教学演示。
import { readFileSync } from 'node:fs';
import { createInterface } from 'node:readline';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const dataPath = resolve(here, '../../lab-b-issueboard/data/issues.json');

const tools = [{
  name: 'list_issues',
  description: '列出 IssueBoard 的任务，可按状态过滤（open / in-progress / done）。只读。',
  inputSchema: { type: 'object', properties: { status: { type: 'string', enum: ['open', 'in-progress', 'done'] } } },
}];

function reply(id, result) { process.stdout.write(JSON.stringify({ jsonrpc: '2.0', id, result }) + '\n'); }
function fail(id, code, message) { process.stdout.write(JSON.stringify({ jsonrpc: '2.0', id, error: { code, message } }) + '\n'); }

createInterface({ input: process.stdin }).on('line', line => {
  if (!line.trim()) return;
  let message;
  try { message = JSON.parse(line); } catch { return fail(null, -32700, 'Parse error'); }
  const { id, method, params } = message;
  if (id === undefined) return; // 通知（如 notifications/initialized）无需回复
  if (method === 'initialize') {
    return reply(id, { protocolVersion: params?.protocolVersion ?? '2025-03-26', capabilities: { tools: {} }, serverInfo: { name: 'lab-b-issues', version: '0.1.0' } });
  }
  if (method === 'tools/list') return reply(id, { tools });
  if (method === 'tools/call') {
    if (params?.name !== 'list_issues') return fail(id, -32602, `Unknown tool: ${params?.name}`);
    let issues;
    try { issues = JSON.parse(readFileSync(dataPath, 'utf8')); }
    catch (error) { return reply(id, { isError: true, content: [{ type: 'text', text: `数据文件无法读取或解析：${error.message}` }] }); }
    const status = params.arguments?.status;
    const shown = status ? issues.filter(item => item.status === status) : issues;
    return reply(id, { content: [{ type: 'text', text: JSON.stringify(shown, null, 2) }] });
  }
  return fail(id, -32601, `Method not found: ${method}`);
});
