# 第 27 章｜Hooks：哪些步骤值得确定性自动执行

> 本章终点：你能判断一个想自动化的步骤**该不该做成 Hook**；你读懂一个“阻止修改受保护文件”的 Hook，并亲手验证它在三种输入下的退出码；你清楚 Hook 是**会在你的电脑上执行命令**的东西，启用前必须读懂。

## 1. 为什么 CLAUDE.md 不够

第 11 章说过：CLAUDE.md 是“上下文，不是强制配置”。你写“不要修改 `data/issues.json`”，Claude **大概率**会遵守，但不是**一定**。

官方对 Hook 的定义是：**用户定义的 shell 命令，Claude Code 在生命周期的特定节点运行它们，让某些动作“总是发生”，而不是依赖模型选择去做。** 它也可以是基于提示或基于代理的 Hook，用于需要判断的场景——本章只讲确定性的命令型 Hook。

> **决定性的区别：** CLAUDE.md 是建议，Hook 是机制。

## 2. 值得做成 Hook 的步骤

问三个问题：

| 问题 | 要“是” |
|---|---|
| 这个动作**必须每次都发生**（或每次都被阻止），没有例外吗？ | ✔ |
| 它能用**确定的规则**判断，而不是需要理解语义吗？ | ✔ |
| 它**稳定**到你不会经常改规则吗？ | ✔ |

好例子：

- 编辑文件后自动格式化；
- 阻止修改 `.env`、锁文件、`.git/`；
- 在上下文压缩后重新注入关键提醒；
- 在 Claude 等待输入时发桌面通知。

不好的例子：

- “确保代码风格好”——需要判断；
- 你自己还没跑通的流程——先手动做到稳定；
- 会联网或不可逆的动作（部署、发消息）——风险大，宜手动。

> 官方最佳实践的提示：在某些情况下，如果 Claude 已经不需要某条 CLAUDE.md 指令就能做对，应删除它，**或者把它转成 Hook**。

## 3. 官方的结构

Hook 配置在 settings 文件里：`~/.claude/settings.json`（你的所有项目）、`.claude/settings.json`（项目，可提交）等。最基本的形状（来自官方指南，2026-10-26）：

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          { "type": "command", "command": "\"$CLAUDE_PROJECT_DIR\"/.claude/hooks/protect-files.sh" }
        ]
      }
    ]
  }
}
```

- **事件（event）**：什么时候触发。官方事件包括 `PreToolUse`（工具调用前）、`PostToolUse`（成功后）、`UserPromptSubmit`、`SessionStart`、`Notification` 等；
- **matcher**：过滤条件。`Edit|Write` 表示只在编辑文件的工具上触发；**越窄越好**——官方警告空 matcher 配合某些事件会影响所有场景；
- **命令（command）**：要执行的程序。它从**标准输入**收到一段 JSON，里面有 `tool_input.file_path` 等字段；
- **退出码**：官方示例里 `exit 2` 表示**阻止**，脚本写到标准错误的内容会作为反馈返回给 Claude，让它调整做法；`exit 0` 表示放行。

官方文档说在 Claude Code 提示符里输入 `/hooks` 可以浏览已配置的 Hook。**这个命令在 Desktop 的界面里是否同样可用，作者未实测。**

## 4. 动手：读懂并验证“保护文件”Hook

资料包 `cases/lab-e-extensions/hooks/protect-files.sh`：

```bash
#!/bin/bash
command -v jq >/dev/null 2>&1 || { echo "Blocked: 未找到 jq……" >&2; exit 2; }   # 缺 jq 就阻止
INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')
FILE_PATH="${FILE_PATH//\\//}"

PROTECTED_PATTERNS=("data/issues.json" ".env" "package-lock.json" ".git/")

for pattern in "${PROTECTED_PATTERNS[@]}"; do
  if [[ "$FILE_PATH" == *"$pattern"* ]]; then
    echo "Blocked: $FILE_PATH 匹配受保护模式 '$pattern'。如确需修改，请让用户亲自确认。" >&2
    exit 2
  fi
done
exit 0
```

它依赖 `jq`（解析 JSON 的小工具）。它是官方示例的变体，加了本案例的受保护路径，以及缺少 `jq` 时的保守阻止（见第 6 节）。

### 读它回答三个问题

1. 它**读**什么？——标准输入的 JSON；
2. 它**改**什么？——不改任何文件；
3. 它**什么时候放行**？——路径不匹配任何受保护模式。

### 验证（不需要 Claude）

在 `cases/lab-e-extensions` 运行 `node test.mjs`。与 Hook 相关的断言与作者 2026-10-26 的实测结果：

| 输入的 `file_path` | 退出码 |
|---|---|
| `/proj/data/issues.json` | **2**（阻止） |
| `/proj/package-lock.json` | **2**（阻止） |
| `/proj/src/main.js` | **0**（放行） |
| `/proj/.env` | stderr 含 `Blocked` |
| 环境里没有 `jq`（`PATH=/bin`） | **2**（保守阻止） |

```text
PASS hook script: 受保护文件退出码 2，普通文件退出码 0
```

**这只证明脚本逻辑正确。** 它是否在 Claude 的编辑前被触发，取决于你的配置、版本与会话。

### 在练习副本里启用

1. 复制 `protect-files.sh` 到 `lab-b/.claude/hooks/`，`chmod +x`（官方说明：Hook 脚本在 macOS/Linux 上需要可执行权限）；
2. 把 `hooks/settings.example.json` 的内容写入 `lab-b/.claude/settings.json`；
3. 新开会话，做**触发实验**：

   > 请在 `data/issues.json` 末尾加一条新任务。

4. 观察：编辑是否被阻止？Claude 是否收到并转述了 `Blocked:` 的反馈？是否改而去做了别的（比如绕过去修改别的文件）？

**一个值得警惕的点：Hook 只管它匹配的工具。** 如果 Claude 改用 shell 命令（比如 `sed -i`）去改同一文件，`Edit|Write` 的 matcher 不会拦住。官方在文档中也提供了不同事件和工具匹配的更多选项，要真正“保护”一个文件需要综合权限规则等手段（见官方权限文档）。**不要因为配置了一个 Hook，就以为这个文件绝对安全。**

## 5. 安全：Hook 就是在你电脑上运行的代码

- Hook 以**你的权限**执行命令。恶意的 Hook 可以读你的文件、联网、删东西；
- **项目里提交的 Hook**会对克隆它的人生效。启用别人仓库里的 `.claude/settings.json` 之前，**读一遍里面的 hooks**；
- 同理，Plugin 可能自带 Hook（第 26 章）；
- 对 Hook 脚本：不要把外部输入直接拼进 shell 命令；用 `jq -r` 取字段后**加引号**使用。

## 6. 失败分支

| 症状 | 检查 |
|---|---|
| Hook 完全没触发 | 文件位置、JSON 语法、matcher 是否匹配工具名、脚本是否可执行；新开会话 |
| 触发了，但没阻止 | 退出码是不是 2；阻止信息是否写到了 stderr |
| 把正常工作也挡住了 | 模式太宽（比如 `.env` 也匹配 `.envrc` 或 `my.environment.md`）；缩小模式 |
| `jq: command not found` | 安装 `jq`。作者实测：**最初版本的脚本在缺 `jq` 时报错后仍退出码 0——静默放行**。已改为缺 `jq` 就退出码 2 阻止（“失败时保守”），并加进了 `test.mjs` |

最后一行是真实发现：**保护类脚本要“失败即阻止”**。官方示例依赖 `jq`；一个守卫在自己出故障时放行，等于没有守卫。

## 7. 独立练习

为第 17 章的窄屏检查设计一个 `PostToolUse` Hook：每次 Claude 编辑 `styles.css` 后，提示一条文字“请在 375px 宽度复查”。先回答：它满足第 2 节的三个问题吗？（提示：它不需要判断，但“提醒”真的比“自动检查”更适合 Hook 吗？）

## 8. 掌握检查

1. CLAUDE.md 与 Hook 的根本区别是什么？
2. 三个问题里，哪一个会让你放弃把某个步骤做成 Hook？
3. 为什么配置了“保护文件”的 Hook，也不能说文件绝对安全？

**下一步**：第 28 章：子代理——什么时候把任务分出去，什么时候不值得。

---

## 事实注记

- 核对日期：**2026-10-26**。依据：官方 [Hooks 指南](https://code.claude.com/docs/en/hooks-guide)（配置位置、PreToolUse 示例、exit 2 阻止、matcher、可执行权限、`/hooks`）与 [最佳实践](https://code.claude.com/docs/en/best-practices)（Hook 确定、CLAUDE.md 建议）。官方指南全文约 6.4 万字，作者读了其中示例与事件列表部分。
- `protect-files.sh` 的三种输入下的退出码为作者 2026-10-26 在 macOS（`jq 1.7.1`）实测。**作者没有在 Claude Desktop 内实测该 Hook 被触发。**
