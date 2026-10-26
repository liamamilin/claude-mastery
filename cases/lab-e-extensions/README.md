# Lab E｜能力扩展包：Skill、Hook、MCP、子代理

四个小件，围绕 Lab B（IssueBoard）。`node test.mjs` 可验证其中**脚本本身**的行为。

| 目录 | 是什么 | 用在哪一章 |
|---|---|---|
| `skills/json-data-check/` | 一个 Skill：检查 JSON 数据文件是否合法 | 第 25 章 |
| `hooks/` | 一个 PreToolUse Hook：阻止修改受保护文件 | 第 27 章 |
| `mcp/issues-server.mjs` | 一个零依赖的 stdio MCP 服务器：只读暴露任务数据 | 第 26 章 |
| `agents/issue-board-reviewer.md` | 一个只读审阅子代理 | 第 28 章 |

## 已验证 / 未验证

- ✅ `node test.mjs`（2026-10-26）：Skill 脚本对合法文件报 OK、对尾逗号文件报错并提示第 6 行；Hook 脚本对 `data/issues.json`、`package-lock.json`、`.env` 退出码 2，对普通文件 0，缺 `jq` 时也退出码 2（fail closed）；MCP 服务器正确响应 initialize、tools/list、tools/call 与未知工具。
- ❌ **未验证**：Claude Desktop 是否按预期**发现并加载**这个 Skill、**触发**这个 Hook、**连接**这个 MCP 服务器、**委派**给这个子代理。这些需要读者在自己的 Desktop 里完成并记录；本包不假装已经验证。

## 使用方式（复制到你的练习副本 `lab-b` 里）

```text
lab-b/.claude/skills/json-data-check/     ← 复制 skills/json-data-check/
lab-b/.claude/hooks/protect-files.sh      ← 复制 hooks/protect-files.sh（并 chmod +x）
lab-b/.claude/settings.json               ← 参考 hooks/settings.example.json
lab-b/.claude/agents/issue-board-reviewer.md
```

Hook 依赖 `jq`（`brew install jq` / `apt-get install jq`）。MCP 服务器的注册方式见第 26 章。
