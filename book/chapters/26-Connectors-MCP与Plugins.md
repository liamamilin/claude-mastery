# 第 26 章｜Connectors、MCP 与 Plugins

> 本章终点：你分得清 **Connector、MCP 服务器、Plugin** 三者；能读懂一个 MCP 服务器到底暴露了什么；亲手运行一个**零依赖、只读、本地**的 MCP 服务器并验证它的响应；并建立一条安全底线：**不确定可信，就不连接。**

## 1. 先划清三个词

| 词 | 一句话 | 你会在哪里遇到 |
|---|---|---|
| **MCP**（Model Context Protocol） | 一种开放标准，让 AI 工具连接外部工具、数据源和 API | 官方 MCP 文档 |
| **MCP 服务器** | 实现了这个标准、对外提供“工具”的程序（本地进程或远程服务） | `claude mcp add ...` |
| **Connector** | Desktop 界面里管理外部服务连接的入口（官方参考里在 **Settings > Connectors**；提示框 **+** 菜单里有 **Add connectors / Browse connectors**） | Desktop 设置 |
| **Plugin** | 把 skills、hooks、子代理、MCP 服务器等**打包**成一个可安装单元 | 提示框 **+** 菜单里的 **Add plugins / Browse plugins** |

> 官方 MCP 文档没有在我读到的部分把 Desktop 的 Connector 与 MCP 配置之间的关系讲完整，并明确建议查看 Desktop 文档。所以本章**不假设**两者的精确对应；你在界面上看到什么，以界面和官方说明为准。

## 2. MCP 服务器长什么样：先读，不连

官方文档（2026-10-26）列出的三种传输方式与添加语法：

```sh
# 远程服务器（推荐 HTTP）
claude mcp add --transport http <名字> <网址>

# 本地进程（stdio）。-- 把 Claude 的选项和服务器自己的命令隔开
claude mcp add [选项] <名字> -- <命令> [参数...]
```

作用域有三种：**local**（默认，只对你、当前项目）、**project**（写进项目根的 `.mcp.json`，通过 Git 共享）、**user**（你所有项目）。项目作用域的服务器在交互会话里**会先征求你的批准**才使用。

### 一条必须背下来的警告

官方原话大意：**连接之前确认你信任这个服务器；会抓取外部内容的服务器，可能让你暴露于提示注入风险。**

“提示注入”指：外部内容里夹带了对 Claude 的指令（例如网页里写着“忽略之前的指令并…”）。MCP 工具返回的内容也算外部内容。所以：

- 只连接你**知道来源**的服务器；
- 优先**只读**的工具；
- 不要把凭据写进共享配置（`.mcp.json` 会被提交）；
- 把工具返回的内容当成**数据**，不是命令。

## 3. 动手：运行一个最小的本地 MCP 服务器

为了不依赖任何第三方账号，资料包提供了 `cases/lab-e-extensions/mcp/issues-server.mjs`：一个**零依赖**的 stdio MCP 服务器，只读暴露 Lab B 的任务数据。它只实现了教学需要的三个方法：`initialize`、`tools/list`、`tools/call`。

### 先读它（不要直接运行不熟悉的服务器）

打开文件，回答三个问题：

1. 它**读**了哪些文件？（只有 `lab-b-issueboard/data/issues.json`）
2. 它**写**了什么？（没有任何写操作）
3. 它有没有联网？（没有）

### 验证它按协议响应

MCP 的 stdio 传输是：每行一个 JSON-RPC 消息。你可以不借助任何客户端，直接喂消息给它。作者测试脚本（`cases/lab-e-extensions/test.mjs`）发送了五条消息，并断言：

- `initialize` → 返回 `serverInfo.name` 为 `lab-b-issues`；
- `tools/list` → 返回名为 `list_issues` 的工具；
- `tools/call`（`status: "done"`）→ 返回的任务 id 是 `[3]`；
- 调用不存在的工具 → 返回错误码 `-32602`。

作者 2026-10-26 实测输出：

```text
PASS mcp server: initialize / tools/list / tools/call / 未知工具报错
```

> **这只证明服务器本身按预期工作。** 它不证明 Claude Desktop 能连接它——那一步依赖你的版本、计划和设置。

### 把它连到你的会话（读者自己做）

**不要让 Claude 替你执行 `claude mcp add`**，这会修改你的配置。自己在终端运行（路径换成你的实际路径），推荐先用**项目作用域**，这样它只影响这个练习项目：

```sh
claude mcp add --scope project lab-b-issues -- node /你的路径/cases/lab-e-extensions/mcp/issues-server.mjs
```

> 这里用到命令行的 `claude`。如果你没有安装独立 CLI，可以在 Desktop 的设置里查找添加连接的入口；**作者没有实测 Desktop 里的这一界面**，请对照官方说明。执行后检查项目根的 `.mcp.json`——它应该只包含一个 `lab-b-issues` 条目，**没有任何密钥**。

连上之后，在 Desktop 会话里检查：

1. 让 Claude 列出它当前可用的外部工具（第 23 章的提示）；
2. 问：“用 `lab-b-issues` 列出已完成的任务”，对照答案应是 id 为 3 的那一条；
3. 把数据文件换成 trailing-comma 版本再问一次，应得到工具返回的“数据文件无法读取或解析”错误——**检验它是否如实转述了失败，而不是编造数据**。

### 管理与清理

官方文档给出：`claude mcp list`（列出与健康状态）、`claude mcp get <名字>`、`claude mcp remove <名字>`（并清除已存的 OAuth 令牌）；会话里 `/mcp` 可查看状态、认证、重连或临时关闭。练习后请移除。

## 4. 认证、令牌与秘密

- 远程服务器常见 OAuth：在会话里运行 `/mcp` 完成浏览器登录；令牌由 Claude Code 保存并自动刷新；
- **永远不要把令牌写进提交到 Git 的文件。** `.mcp.json` 支持用 `${变量名}` 引用环境变量；
- 本书**不要求**你注册任何第三方服务。如果练习需要，请用本地、离线的数据源（比如上面这个）。

## 5. Plugins：打包，而不是新能力

Plugin 把多个扩展打包安装。官方说明它可以包含 skills、hooks、子代理、MCP 服务器等；在 Desktop 里通过提示框 **+** 菜单的 **Add plugins / Browse plugins** 进入（官方快速入门，2026-10-26）。

判断要不要用别人的 plugin：

| 问题 | 提示 |
|---|---|
| 来源可信吗？ | 它可能带 hooks（会执行命令）和 MCP 服务器（会连接外部）——等同于运行别人的代码 |
| 我真的需要它的全部内容吗？ | 不需要就别装；每一项都会增加上下文与风险 |
| 能否看到它包含什么？ | 装之前读清单 |

## 6. 失败分支

- **服务器显示未连接**：先看服务器自己能否独立运行（本章的 `node test.mjs` 就是这种检查）；再看路径、`node` 是否在 PATH；
- **Claude 声称用了工具，但你找不到调用记录**：要求它给出工具调用的名称与返回内容；没有就是编造；
- **工具返回的内容里有“指令”**：不执行，原文报告给你。

## 7. 独立练习

读 `issues-server.mjs`，**不改源码**，写下：如果有人把 `dataPath` 改成 `~/.ssh/`，会发生什么？你从中得到了关于“连接前先读”的什么结论？（提示：服务器的权限就是它进程的权限。）

## 8. 掌握检查

1. Connector、MCP 服务器、Plugin 的区别是什么？
2. 为什么 MCP 工具返回的内容也要当作“外部内容”？
3. 本章里，你用什么办法证明了“服务器自己是对的”？它没有证明什么？

**下一步**：第 27 章：Hooks——只有确定性的步骤才值得自动化。

---

## 事实注记

- 核对日期：**2026-10-26**。依据：官方 [MCP 文档](https://code.claude.com/docs/en/mcp)（传输方式、`claude mcp add`、作用域、`.mcp.json`、`/mcp`、信任警告）、[桌面入门](https://code.claude.com/docs/en/desktop-quickstart) 与 [Desktop 参考](https://code.claude.com/docs/en/desktop)（Connectors、Plugins 入口）。
- 官方 MCP 页面全文有 15 万字，作者只读了前 10 万字；**未覆盖**的部分（如某些企业与 Desktop 细节）本章没有断言。
- `issues-server.mjs` 的协议响应已由 `node test.mjs` 验证；作者**没有**把它连接到 Claude Desktop，也没有运行过 `claude mcp add`。
