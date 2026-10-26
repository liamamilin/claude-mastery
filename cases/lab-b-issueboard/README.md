# Lab B｜IssueBoard：接手一个“不知道怎么运行”的项目

一个小型任务看板，数据在 `data/issues.json`，逻辑在 `src/board.js`，界面在 `src/main.js`。**没有 package.json，没有说明怎么运行。** 这是刻意的：第 9 章训练你让 Claude 先调查、写出事实简报，再动手。

## 需求（只有这一句）

> 给任务增加“优先级”过滤。

## 已知事实（给教师，学员请先自己调查）

- 页面通过 `fetch` 读取 JSON，所以在多数浏览器里**双击打开（file://）大概率加载失败**（作者未能在 file:// 下实测，请读者自己观察），应使用本地 http 服务（例如 `python3 -m http.server 48125`）。
- 数据里有一条旧任务**没有 `priority` 字段**（id 4）。优先级过滤必须决定如何对待它——这是刻意保留的边界情况。
- `board.js` 是纯逻辑，可用 `node ../../scripts/test_cases.mjs` 之外的方式单独测试；参考验收见下。

## 验收（第 9、10 章使用）

1. 旧功能不变：三列、数量、未完成计数、负责人显示。
2. 选择“高”只显示 id 1 与 5；选择“全部”显示全部 5 个。
3. 没有 `priority` 的任务有明确且一致的归类（本课程约定归为“普通”）。
4. 没有无关文件被修改；`data/issues.json` 不被改动。

## 故障场景：trailing-comma（第 10 章使用）

`scenarios/trailing-comma/issues.json` 是一份**末尾多了一个逗号**的数据文件。在你的**练习副本**里用它覆盖 `data/issues.json`，页面会显示“共 0 个任务，未完成 0 个”，**没有任何错误提示**。

作者在 Browser 中实测（2026-10-26）：该请求 `GET /data/issues.json` 返回 `200 OK`；在页面里执行 `JSON.parse` 得到
`SyntaxError: Unexpected token ']' ... is not valid JSON`。页面本身的 `load()` 捕获了错误并写入提示，但紧接着 `render([])` 又覆盖了提示文字——这是一个**真实存在的次生缺陷**（错误提示被吞掉），不是为了教学而额外加的。请勿在资料包原件里修复它。
