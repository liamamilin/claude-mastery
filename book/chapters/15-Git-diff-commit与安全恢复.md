# 第 15 章｜Git、diff、commit 与安全恢复

> 本章终点：你在一个小项目里完成“提交基线 → 让 Claude 修改 → 看 diff → 决定保留或恢复”的完整循环，亲手用三种方式撤回修改，并知道**每种方式能撤回什么、不能撤回什么**。

## 1. 为什么前面反复提“可逆”

第 13 章说选权限模式要看**可逆性**。可逆性不是一种心态，而是一个具体的东西：**你有没有一个已知良好的版本可以回去。**

Git 是记录项目版本的工具。**提交（commit）** 是给当前所有文件拍的一张“存档照片”，带一句说明。有了它，Claude 的改动就是“与存档的差异”，随时可以对比，也随时可以回去。

> 首次出现 `git diff`：它显示“当前文件”与“上一次存档”之间的差异。Desktop 的 **Changes** 面板就是它的图形版本，你可以先只用面板。

## 2. 准备：给练习项目建一个基线

官方说明 Desktop 的会话隔离（第 16 章）需要安装 Git；先检查：

**[Desktop Terminal]**（`Ctrl+\``）：

```sh
git --version
```

作者环境输出 `git version 2.54.0 (Apple Git-157)`（macOS）。你的版本号会不同；只要有输出就行。没有输出，请从 <https://git-scm.com/downloads> 安装。

把 Lab A 复制到 `lab-a-git`，在该目录执行：

```sh
git init -b main
git add -A
git commit -m "基线：Lab A 初始状态"
```

`git init` 把这个目录变成一个 Git 项目；`git add -A` 选中所有文件；`git commit` 拍下存档。

> 如果 Git 提示需要设置用户名和邮箱，按提示执行 `git config --global user.name "你的名字"` 与 `git config --global user.email "你的邮箱"`。**这是你自己的身份信息，请自己输入，不要让 Claude 代填。**

确认干净：

```sh
git status --short
```

没有任何输出，说明工作区与存档一致。

## 3. 让 Claude 改一点，然后读 diff

**[Desktop Code]** 新会话（Manual），目录 `lab-a-git`：

> 把主标题 “LinkShelf” 改成 “我的收藏架”，只改这一处。

批准后，看三个地方：

1. **Changes** 面板：`+1 -1`。
2. 终端里：

   ```sh
   git status --short
   git diff
   ```

作者在本章对应实验里的真实输出：

```text
 M index.html
 index.html | 2 +-
 1 file changed, 1 insertion(+), 1 deletion(-)
```

`git status --short` 里的 `M` 表示“已修改”。`git diff` 会展示被删的行（`-`）和新增的行（`+`）。你应该看到：只有主标题所在的那一行不同。

**如果 diff 里出现了不属于任务的行，那是比“结果对不对”更早的警告。**

## 4. 三种“撤回”，分清能撤什么

### 方式一：在 Manual 下拒绝 / 不接受

最轻的方式：变更没批准，文件没动，什么也不用恢复。（第 3 章）

### 方式二：丢弃未提交的修改

已批准，但你反悔了：

```sh
git restore index.html
git status --short
```

作者实测：`git restore index.html` 之后，`git status --short` 没有任何输出——文件回到基线。

> ⚠ **`git restore` 会永久丢弃该文件里尚未提交的改动。** 没有后悔药。执行前确认丢弃的就是你想丢弃的。想“暂存起来先别丢”，用 `git stash`（本章不展开）。

### 方式三：回退已提交的改动——`revert`

假设你已经把一个坏改动提交了。**不要抹掉历史，而是新增一个“反向提交”：**

```sh
git revert --no-edit HEAD
```

`HEAD` 指“最新的提交”。作者实测的日志：

```text
2a5af4a Revert "title: 收藏架"
f3b3cbb title: 收藏架
ecee034 wt change
0657c3b init lab a
```

`revert` 保留了完整历史：坏提交仍在，旁边多了一个撤销它的提交。这在多人协作或已经分享出去的历史上**最安全**。

> 看到过 `git reset --hard`？它会把历史和文件一起改回去，**会丢失提交之后的所有工作**。除非你完全清楚后果，否则不要让 Claude 或自己执行它；让 Claude 做任何会丢弃工作的 git 操作之前，在 Manual 模式下逐条阅读命令。

## 5. 什么时候提交

经验规则：**每当一个小目标被验证成立，就提交一次。** 提交的粒度是“一个你愿意回到的状态”。

让 Claude 帮你写提交信息很自然，但有两条纪律：

1. **提交前先读 diff**——它只应包含任务相关的改动；
2. 提交信息要描述**为什么**，而不仅是“修改了文件”。

**[Desktop Code]** 提示：

> 请查看当前的 git diff，确认只包含标题修改，然后用一句中文写明修改原因并提交。**提交前先把 diff 摘要告诉我。**

在 Manual 模式下，`git commit` 命令会先给你批准。别在没读 diff 的情况下批准。

## 6. 读 diff 的三个问题

1. **范围**：改的文件是不是我预期的那几个？
2. **大小**：改动行数是不是与任务相称？
3. **意外**：有没有我没要求、也看不懂的行（新依赖、被删除的函数、改动的存储格式）？

任何一个答案是“不确定”，就让 Claude 解释那一行，而不是提交。

## 7. 失败分支：合并冲突

当两处改动同时改了同一行，Git 无法自动决定保留哪一个，这叫**冲突**。作者实测：在一个分支把标题改成“书签”，另一个分支改成“收藏架”，合并时得到

```text
Auto-merging index.html
CONFLICT (content): Merge conflict in index.html
Automatic merge failed; fix conflicts and then commit the result.
```

这时 `index.html` 里会出现标记：

```text
<<<<<<< HEAD
（当前分支的版本）
=======
（被合并分支的版本）
>>>>>>> exp/title
```

**冲突并不意味着出错，而是需要你做判断。** 两条出路：

- **放弃这次合并**：`git merge --abort`，回到合并前的状态。作者实测，中止后 `git status --short` 为空；
- **解决冲突**：选定要保留的内容，删除标记，提交。让 Claude 帮你可以，但**你要选**保留哪一个，因为这是产品决定而不是技术问题。

## 8. Desktop 里的相关功能

官方 Desktop 参考中与本章相关的有：

- **Changes** 视图：逐文件查看，点击行评论，`Cmd+Enter` 提交所有评论；
- **`/code-review`**：在提示框运行，发现项会以 **Code review** 卡片显示，带有 **Walk through in diff** 与 **Apply fixes** 按钮（第 19 章）；
- 创建 PR 与 CI 监控依赖 GitHub CLI（`gh`）和 GitHub 登录。**本书不会要求你为本章配置它们。**

## 9. 独立练习

1. 让 Claude 把“删除”按钮文字改为“移除”，用 `git diff` 检查它是否同时改了 `aria-label`。
2. 先用 `git restore` 撤回，再让它重做并提交，最后用 `git revert` 撤回那一次提交。用 `git log --oneline` 写下三个阶段的历史各是什么样。

## 10. 掌握检查

1. `git restore` 与 `git revert` 分别撤销什么？哪个更危险？
2. 为什么提交前要先读 diff？
3. 合并冲突发生时，有哪两条出路？

**下一步**：第 16 章：同时开两个会话做不同的事，怎样避免它们互相踩脚？

---

## 事实注记

- 核对日期：**2026-10-26**。依据：官方 [Desktop 参考](https://code.claude.com/docs/en/desktop)（Changes 视图、`/code-review` 卡片、Git 需求、`gh` 依赖）。
- 本章 Git 输出（`git --version`、`status`、`diff --stat`、`restore`、`merge` 冲突、`merge --abort`、`revert`、`log`）均为作者在 2026-10-26 于 macOS、Git 2.54.0 的临时目录中对 Lab A 的**真实运行结果**；提交 SHA 每次不同。
- 本章没有演示 `git stash`、`git reset` 与远程仓库操作。
