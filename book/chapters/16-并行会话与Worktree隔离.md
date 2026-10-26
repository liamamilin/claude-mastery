# 第 16 章｜并行会话与 Worktree 隔离

> 本章终点：你能判断一组任务该**串行**还是**并行**；你用命令行亲手创建并删除一个 worktree，看到“两份工作目录、一个仓库”的真实样子；你知道 Desktop 的 **Worktree** 开关做什么、归档时会发生什么。

## 1. 想同时做两件事

你想让 Claude 给 LinkShelf 加搜索，同时让另一个会话改样式。若两个会话在**同一个文件夹**里工作：

- 它们的改动混在同一个工作区，你看到的 diff 分不清哪些属于哪项任务；
- 两边可能同时改同一个文件，互相覆盖；
- 一个任务失败，想丢掉时会连另一个的成果一起丢。

**Worktree** 解决的是这个问题。用一个更直白的说法：**同一个项目的另一处独立工作目录。** 两处目录共享同一份版本历史，但各有各的文件和各自的分支，互不干扰。

## 2. 在命令行里亲眼看一次

先不用 Desktop，用 Git 直接看，这样你理解开关背后的东西。以下命令是作者在第 15 章的练习仓库里**真实运行**的（`main` 分支上已有一次提交）。

```sh
git worktree add ../lab-a-wt -b exp/search
git worktree list
git branch
```

`git worktree add` 在上一级创建了新目录 `lab-a-wt`，并为它新建了分支 `exp/search`。作者实测输出（路径为作者的临时目录）：

```text
.../scratchpad/g     0657c3b [main]
.../scratchpad/g-wt  0657c3b [exp/search]
+ exp/search
* main
```

**两行路径，两个分支。** `*` 是当前所在分支，`+` 表示该分支在另一个 worktree 中被检出。

### 它们真的互相隔离

在新的 worktree 里修改并提交：

```sh
cd ../lab-a-wt
echo x >> README.md
git commit -am "wt change"
git log --oneline --all --graph
```

作者实测的结果：

```text
* ecee034 wt change
* 0657c3b init lab a
```

回到 `main` 所在目录，运行 `git status --short`：**没有任何输出，`README.md` 未被改动。** `exp/search` 里的提交没有出现在 `main` 的工作文件里。

### 把成果合回去

确认 `exp/search` 上的成果满意后，在 `main` 目录执行：

```sh
git merge exp/search
```

作者实测：因为 `main` 之后没有新提交，是 **Fast-forward**（直接前进），README 的改动进入了 `main`。

如果两边改了同一行，就是第 15 章的冲突。**这是并行的真正代价**：隔离让你不在过程中互相干扰，但合并时仍要面对差异。

### 清理

```sh
git worktree remove ../lab-a-wt
git branch -d exp/search
```

作者实测：目录里有未提交修改时，`git worktree remove` 会拒绝并报 `fatal: '.' contains modified or untracked files, use --force to delete it`——这是保护；`--force` 会丢弃那些修改。`git branch -d exp/search` 在分支已合并后成功：`Deleted branch exp/search`。

## 3. Desktop 里的 Worktree 开关

官方 Desktop 参考（2026-10-26）：

- 控件名称是 **Worktree**，位于**项目文件夹控件**中，位置在输入框下方那一排；**默认关闭**。旧布局里是分支名旁的 worktree 复选框；
- 隔离需要安装 Git（`git --version` 检查）；
- worktree 默认放在 `<项目根>/.claude/worktrees/`；本地会话可在 **Settings > Claude Code** 修改 **Worktree location**；
- 同一处设置里有 **Branch prefix**：Desktop 会把它加在每个 worktree 分支名之前；
- 如果项目根有 `.worktreeinclude` 文件，它列出的、被 Git 忽略的文件（例如 `.env`）会复制到新 worktree。**不要把含真实密钥的文件放进去，除非你清楚后果。**

### 归档时会发生什么（重要）

官方说明：

- 归档带 worktree 的会话时，如果有**未提交的修改**，Desktop 会询问；选择 **Archive anyway** 会**丢弃**它们；想保留，先取消并提交；
- 否则 worktree 会留在磁盘上，对本地会话，Desktop 约在**归档或最近一次打开之后 30 天**移除它；想保留成果，从 **Archived** 标签打开会话并 **Unarchive**。

**纪律：结束一个 worktree 会话之前，先提交你想保留的东西。**

## 4. 并行会话在界面里长什么样

- 点 **+ New**（`Cmd+N` / `Ctrl+N`）开新会话；`Ctrl+Tab` / `Ctrl+Shift+Tab` 切换；
- 想并排看：按住 **Option**（macOS）或 **Alt**（Windows）点击会话，或右键选 **Open in > Split view**；
- 想用独立窗口：按住 `Cmd`/`Ctrl` 点击，或 **Open in > New window**；
- 用 **Group and sort** 图标按需整理侧栏。

## 5. 串行还是并行：判断表

| 问题 | 是 → | 否 → |
|---|---|---|
| 两个任务会改同一个文件吗？ | 串行，或各开 worktree 并预期合并冲突 | 可并行 |
| 你能同时好好审阅两份 diff 吗？ | 可并行 | 串行（你才是瓶颈） |
| 其中一个是纯调查、不改文件吗？ | 随时并行（用 Plan） | — |
| 项目没有 Git 吗？ | 先做第 15 章 | — |
| 两个任务相互依赖吗？ | 串行 | 可并行 |

> 并行不是为了“更快”，是为了**把互不相干的工作隔开**。如果你自己无法同时审阅，并行只会让错误堆积得更快。

## 6. 动手（命令行 + Desktop）

1. 用第 15 章的 `lab-a-git`。
2. **[Desktop Code]** 新建会话，文件夹选 `lab-a-git`，打开 **Worktree** 开关，权限 Manual。任务：

   > 在 `app.js` 增加按标题搜索（最小版本）。

3. 同时再开一个会话，**不**开 Worktree，任务：

   > 只调查：说明 `styles.css` 里卡片样式怎样定义。不要修改文件。

4. 观察：第一个会话的改动在哪里（看 Changes）？主目录里有没有出现这些修改？
5. 满意后，在第一个会话里提交；回主目录用 `git branch` 与 `git log --oneline --all` 查看分支。合并后用浏览器确认搜索功能；**这一步在 Desktop 里的精确按钮因版本而异，作者未实测，请记录你的实际操作。**

## 7. 失败分支：并行里的混淆

- **改了错的目录**：在主目录工作却以为在 worktree。看会话顶部显示的路径与分支；
- **成果找不到**：归档并被清理后，只剩已提交的分支。提交过就能从分支找回；没提交就没了；
- **合并冲突很多**：说明两个任务不该并行。放弃合并，改成串行重做较小的那个。

## 8. 独立练习

为下列三组任务各写“串行 / 并行 / 并行+worktree”并解释：

1. 给 Lab A 加搜索 + 给 Lab A 加标签（都改 `app.js` 和数据结构）；
2. 给 Lab A 改样式 + 给 Lab B 加优先级过滤（不同项目）；
3. 调查 Lab B 的数据流 + 修改 Lab B 的 `main.js`。

## 9. 掌握检查

1. worktree 与“复制一份文件夹”有什么区别？
2. 归档一个带 worktree 的会话前，必须做什么？
3. 什么情况下不该并行？

**下一步**：第五部分，第 17 章：桌面浏览器预览与自动验证。

---

## 事实注记

- 核对日期：**2026-10-26**。依据：官方 [Desktop 参考](https://code.claude.com/docs/en/desktop)（Worktree 开关、默认关闭、存放位置、Branch prefix、`.worktreeinclude`、归档行为、并行会话快捷键）。
- 命令行 `git worktree add/list`、分支隔离、`merge` 快进均为作者在 2026-10-26（macOS，Git 2.54.0）的**真实运行**；`worktree remove` 的拒绝保护与 `branch -d` 也已实测；Desktop 内合并按钮**未实测**。
