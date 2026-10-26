#!/usr/bin/env python3
"""Static package checks only; no network or VitePress/npm build. Run from repo root."""
from pathlib import Path
import json
import re
import sys
from xml.etree import ElementTree

root=Path(__file__).resolve().parents[1]
errors=[]
def require(p):
    path=root/p
    if not path.exists(): errors.append(f'missing file: {p}')
    return path
critical=['START_HERE.md','CLAUDE.md','docs/02_完整目录与逐章任务.md','docs/14_直接交给Claude的启动指令.md','book/index.md','book/00-导读.md','book/chapters/01-理解ClaudeDesktop的Code.md','book/chapters/22-停止反复补丁.md','book/.vitepress/config.mts','.github/workflows/deploy.yml','book/.vitepress/theme/components/DecisionLab.vue','book/public/figures/mastery-loop.svg','cases/lab-a-links/index.html','cases/lab-d-persistence/app.js','cases/lab-d-persistence/solution/app.js','package.json']
for p in critical: require(p)
jsonfiles=['package.json','.claude/launch.json']
for p in jsonfiles:
    path=require(p)
    if path.exists():
        try: json.loads(path.read_text(encoding='utf-8'))
        except Exception as e: errors.append(f'invalid JSON {p}: {e}')
svg=root/'book/public/figures/mastery-loop.svg'
if svg.exists():
    try: ElementTree.parse(svg)
    except Exception as e: errors.append(f'invalid SVG: {e}')
chapter_txt=(root/'docs/02_完整目录与逐章任务.md').read_text(encoding='utf8')
chapter_numbers=[int(i) for i in re.findall(r'^### 第 (\d{2}) 章',chapter_txt,flags=re.M)]
if chapter_numbers!=list(range(1,33)): errors.append(f'course requires 1–32; got {chapter_numbers}')
# Ensure all Markdown links within the book to non-external relative pages exist.
for source in (root/'book').rglob('*.md'):
    text=source.read_text(encoding='utf8')
    for target in re.findall(r'\]\(([^)]+)\)',text):
        if target.startswith(('http:','https:','#','/','mailto:')): continue
        target=target.split('#')[0]
        if not target: continue
        dest=source.parent/target
        if not dest.exists(): errors.append(f'broken book markdown link in {source.relative_to(root)}: {target}')
workflow=(root/'.github/workflows/deploy.yml').read_text(encoding='utf8')
for fragment in ['npm ci','npm run build','book/.vitepress/dist','actions/deploy-pages']:
    if fragment not in workflow: errors.append('workflow missing '+fragment)
js_bad=(root/'cases/lab-d-persistence/app.js').read_text(encoding='utf8')
js_fixed=(root/'cases/lab-d-persistence/solution/app.js').read_text(encoding='utf8')
if js_bad==js_fixed: errors.append('intentional bug and solution unexpectedly identical')
if errors:
    for e in errors: print('FAIL', e)
    sys.exit(1)
print('PASS package structure, 32 chapter contracts, JSON, SVG, book links, deploy markers')
print('NOTE: This does not prove npm build, browser UI, account features or GitHub Pages deployment.')
