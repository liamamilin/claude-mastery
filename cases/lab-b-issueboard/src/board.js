// 纯逻辑：不碰 DOM，方便用 node 直接测试。
export const STATUSES = ['open', 'in-progress', 'done'];

export function groupByStatus(issues) {
  const groups = Object.fromEntries(STATUSES.map(s => [s, []]));
  for (const issue of issues) {
    if (groups[issue.status]) groups[issue.status].push(issue);
  }
  return groups;
}

export function countOpen(issues) {
  return issues.filter(i => i.status !== 'done').length;
}
