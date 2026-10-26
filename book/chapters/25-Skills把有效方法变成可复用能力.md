# 第 25 章｜Skills：把有效方法变成可复用能力

> 本章终点：你把第 10 章“先检查数据文件是否合法”这套**已经证明有效**的做法，写成一个真正的项目 Skill；你能区分 Skill、CLAUDE.md 与普通提示词；你知道怎样**确认它真的被载入并起作用**，而不是写了就当它在工作。

## 1. 什么时候值得做成 Skill

回想第 10 章：数据加载异常时，先查 `200 OK`、再解析 JSON，才定位到尾逗号。如果下次又遇到类似症状，你得再讲一遍。

把一个**已被验证有效、会重复使用**的流程变成 Skill，Claude 就能在需要时自己调用它。三个判断条件：

1. **重复**：你预计会再做至少三次；
2. **稳定**：做法已经被证明有效（不要把没跑通的流程固化）；
3. **不是规则**：它是一套“做法”，不是一句常驻的“约定”。

> 一次性的事，写进提示词；长期成立的约定，写进 CLAUDE.md（第 11 章）；**按需使用的一套做法**，才是 Skill。

## 2. Skill 是什么、放在哪里

官方 Skills 文档（2026-10-26）：

- Skill 是一个目录，里面必须有 `SKILL.md`；
- 位置：个人 `~/.claude/skills/<名字>/SKILL.md`（所有项目可用）；项目 `.claude/skills/<名字>/SKILL.md`（该仓库内可用，可提交共享）；插件里的 skill 以 `/插件名:技能名` 调用；
- **所有 frontmatter 字段都是可选的，只有 `description` 被推荐。** 常用字段：`name`（默认用目录名）、`description`、`when_to_use`、`argument-hint`、`disable-model-invocation`、`user-invocable`、`allowed-tools`；
- 调用方式：你输入 `/skill名`（可带参数），或者 Claude 在你的请求与 `description` 匹配时**自动载入**；设置 `disable-model-invocation: true` 可关闭自动载入；
- 完整内容只在被调用时才载入，一旦载入会留在上下文里，所以**每一行都是持续的上下文开销**；
- `SKILL.md` 建议不超过 **500 行**，细节放进同目录的辅助文件；脚本可以放在 `scripts/`，用 `${CLAUDE_SKILL_DIR}` 引用；
- 参数用 `$ARGUMENTS`；如果文本里没有放置占位符，Claude Code 会在内容末尾追加 `ARGUMENTS: <值>`。

在 Desktop 里，官方快速入门说明：输入 `/` 或点击 **+** → **Slash commands** 可以浏览内置命令、自定义 skill 与插件 skill。

## 3. 动手：做 `json-data-check`

资料包 `cases/lab-e-extensions/skills/json-data-check/` 已有一份可用的实现。**先读它，再复制**，而不是盲目使用。

```text
json-data-check/
├── SKILL.md
└── scripts/
    └── check_json.mjs
```

### 读一读 SKILL.md 的关键部分

- `description` 以**用户会说的话**为触发词：“数据文件加载失败、页面显示 0 条数据、JSON 报错、尾逗号”；它决定了 Claude 什么时候考虑载入这个 skill；
- 步骤是**做法**，不是长篇知识；
- 明确规定：**只读，不自动修复**——这是一条边界，比“怎么做”更重要。

### 先验证脚本本身

在 `cases/lab-e-extensions` 目录运行（真实结果，2026-10-26）：

```sh
node test.mjs
```

其中与 Skill 相关的一行输出：

```text
PASS skill script: 合法文件 OK，尾逗号文件报告行列号提示
```

直接对尾逗号文件运行脚本得到：

```text
ERROR .../scenarios/trailing-comma/issues.json：SyntaxError: Unexpected token ']', ..."": "小周"},
提示：第 6 行第 97 列的逗号后面直接是 ] 或 }（疑似尾逗号）。
```

脚本只会识别**尾逗号**这一类问题的位置，其余 JSON 错误只给出解析器原话——**这是刻意写进 SKILL.md 的诚实边界**，没有假装它能定位所有错误。

> 作者的一次修正：最初设想脚本从错误信息里提取 `position N` 来算行列号，实测 Node 22 的错误信息没有这段，测试失败了。于是改成针对尾逗号的明确检查。**先让测试告诉你假设是否成立。**

### 安装到你的练习副本

把 `json-data-check` 目录复制到 `lab-b/.claude/skills/`。

## 4. 确认它真的被载入

写了不等于在工作。三步检验：

1. **看得见吗？** 在 `lab-b` 新开会话，输入 `/`，在列表里找 `json-data-check`；
2. **手动调用**：`/json-data-check data/issues.json`。观察 Claude 是否运行了脚本并汇报；
3. **自动触发**：用 trailing-comma 数据，然后只说“页面显示‘共 0 个任务’，没有提示。先别改代码，看看数据文件有没有问题”，观察 Claude 是否主动用了这个 skill。

对每一步记录：**是 / 否 / 不确定**。如果第 1 步看不到，先查目录位置与文件名（必须叫 `SKILL.md`，且 frontmatter 的 `---` 必须是文件第一行）。

### 一次真实观察：项目 skill 确实会被发现

本书项目自己就有一个项目 skill：`.claude/skills/chapter-craft/SKILL.md`（写章节用）。在作者写本书的会话中，这个 skill 出现在可用 skill 列表里，并且被调用成功——这是“放在 `.claude/skills/` 下的项目 skill 会被发现”的真实例子。**这只证明了发现机制，不证明你的 skill 内容有效**，所以上面的三步检验仍然要做。

## 5. 常见失败

| 症状 | 可能原因 | 检查 |
|---|---|---|
| `/` 里没有这个 skill | 位置不对；`SKILL.md` 命名错；会话在 skill 创建前开启 | 路径、大小写、新开一个会话 |
| 手动能用，自动不触发 | `description` 没有覆盖你说话的方式 | 用你真实的措辞改写 `description` |
| 自动触发了不该触发的场景 | `description` 太宽泛 | 收窄；或加 `disable-model-invocation: true` 让它只手动调用 |
| 触发了但没按步骤做 | 步骤写成了抽象建议 | 把关键步骤写成具体动作与命令 |
| 越来越长 | 把知识都塞进了 SKILL.md | 拆到辅助文件，只留导航 |

**会产生副作用的 skill（发消息、部署、改文件）**，官方建议用 `disable-model-invocation: true`，只让你手动触发。

## 6. 独立练习

为第 17 章的“窄屏检查”写一个 skill 草稿：它应该只说明**做法**（在 375px 宽度量 `scrollWidth`，与窗口宽度对比），写明边界（只读，不修改样式）。**先自己判断它值不值得做成 skill**：你会重复用吗？做法稳定吗？

## 7. 掌握检查

1. Skill、CLAUDE.md、普通提示词，各适合放什么？
2. `description` 在 Skill 里起什么作用？
3. 写完 Skill 之后，你用哪三步检验它真的在工作？

**下一步**：第 26 章：让 Claude 连接外部工具——Connectors、MCP 与 Plugins。

---

## 事实注记

- 核对日期：**2026-10-26**。依据：官方 [Skills 文档](https://code.claude.com/docs/en/skills)（位置、frontmatter 字段、调用方式、500 行建议、`${CLAUDE_SKILL_DIR}`、参数）与 [桌面入门](https://code.claude.com/docs/en/desktop-quickstart)（`/` 与 **+** → **Slash commands**）。
- `node test.mjs` 的输出为作者实测；**作者没有在 Claude Desktop 内实测 `json-data-check` 被发现和自动触发**。
