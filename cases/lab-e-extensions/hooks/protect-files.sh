#!/bin/bash
# 在 Edit / Write 之前运行：禁止修改受保护的文件。退出码 2 = 阻止，并把 stderr 反馈给 Claude。
# 没有 jq 就无法判断路径：保守起见阻止，而不是静默放行。
command -v jq >/dev/null 2>&1 || { echo "Blocked: 未找到 jq，无法检查文件路径。请先安装 jq。" >&2; exit 2; }

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
