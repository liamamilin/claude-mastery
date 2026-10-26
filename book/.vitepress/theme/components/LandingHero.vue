<script setup lang="ts">
import { ref } from 'vue'
import { withBase } from 'vitepress'

const stages = [
  { k: '01', title: '意图', subtitle: '目标还模糊？先探索。', desc: '从“想做得更好”出发，弄清楚真正希望发生什么改变。' },
  { k: '02', title: '事实', subtitle: '先看现状。', desc: '查目录、约束、权限和真实运行记录，区分事实与推测。' },
  { k: '03', title: '路线', subtitle: '让工作有方向。', desc: '选择调查、计划、小实验或直接实施，而不是一律先堆流程。' },
  { k: '04', title: '执行', subtitle: '把任务落进文件。', desc: '通过 Claude Desktop Code 对项目进行真实修改。' },
  { k: '05', title: '证据', subtitle: '打开它，运行它。', desc: '通过 diff、预览、日志和测试核对真实结果。' },
  { k: '06', title: '调整', subtitle: '发现走偏就纠偏。', desc: '修假设、回退或换路线；不重复增加无效补丁。' },
  { k: '07', title: '交付', subtitle: '完成并能接续。', desc: '留下可用成果、限制说明和下一次能够继续的状态。' },
]
const active = ref(0)
</script>

<template>
  <div class="mastery-home">
    <section class="mastery-hero" aria-labelledby="mastery-title">
      <div class="mastery-glow mastery-glow-a" aria-hidden="true"></div>
      <div class="mastery-glow mastery-glow-b" aria-hidden="true"></div>
      <div class="mastery-hero-copy">
        <div class="mastery-eyebrow"><span class="mastery-dot" aria-hidden="true"></span> CLAUDE MASTERY LAB · 桌面实战学院</div>
        <h1 id="mastery-title">驾驭 Claude<span class="mastery-punct">.</span></h1>
        <p class="mastery-hero-statement">不只会提问，<br /><em>更能掌控完成。</em></p>
        <p class="mastery-hero-summary">从第一次打开 Claude Code Desktop，到组织复杂项目、识别错误假设、验证真正的交付。学会与 AI 协作，更学会在关键时刻接管方向。</p>
        <div class="mastery-actions">
          <a class="mastery-cta" :href="withBase('/00-导读')">开始学习 <span aria-hidden="true">↗</span></a>
          <a class="mastery-secondary" :href="withBase('/chapters/22-停止反复补丁')">体验纠偏训练 <span aria-hidden="true">→</span></a>
        </div>
        <p class="mastery-status">8 大部分 · 32 章课程路线 · <strong>当前示范正文 2 章</strong> · 非官方独立教育项目</p>
      </div>
      <div class="mastery-hero-art" aria-hidden="true">
        <div class="mastery-orbit mastery-orbit-outer"></div>
        <div class="mastery-orbit mastery-orbit-inner"></div>
        <div class="mastery-core"><span>YOU</span><small>IN CONTROL</small></div>
        <div class="mastery-marker mastery-marker-a"><span>01</span>明确目标</div>
        <div class="mastery-marker mastery-marker-b"><span>02</span>验证事实</div>
        <div class="mastery-marker mastery-marker-c"><span>03</span>掌控结果</div>
        <div class="mastery-art-label">UNDERSTAND <span>→</span> DECIDE <span>→</span> DELIVER</div>
      </div>
    </section>
    <section class="mastery-journey" aria-labelledby="journey-heading">
      <div class="mastery-section-head"><span>01 / THE METHOD</span><h2 id="journey-heading">一条能够循环迭代的工作闭环</h2><p>真正的能力不是让 Claude 一直执行，而是知道它现在需要什么信息、下一步应该做什么。</p></div>
      <div class="mastery-steps" role="group" aria-label="七步工作闭环">
        <button v-for="(stage, i) in stages" :key="stage.k" type="button" class="mastery-step" :class="{ 'is-current': active === i }" :aria-pressed="active === i" @click="active = i"><small>{{ stage.k }}</small><strong>{{ stage.title }}</strong></button>
      </div>
      <div class="mastery-insight" aria-live="polite"><span class="mastery-insight-tag">CURRENT FOCUS / {{ stages[active].k }}</span><div><h3>{{ stages[active].subtitle }}</h3><p>{{ stages[active].desc }}</p></div></div>
    </section>
    <section class="mastery-course" aria-labelledby="course-heading">
      <div class="mastery-section-head"><span>02 / THE CURRICULUM</span><h2 id="course-heading">从使用工具，到驾驭任务</h2><p>以下为完整课程规划。当前已开放第 01–12 章与第 22 章，其余章节会在真实撰写与验证后逐步上线。</p></div>
      <div class="mastery-grid">
        <article class="mastery-course-card"><span>PART 01 · 已开放 4 章</span><h3>认识桌面工作台</h3><p>从 Code 标签页开始，看见文件、预览、终端与改动。</p><a :href="withBase('/chapters/01-理解ClaudeDesktop的Code')">阅读第 01–04 章 →</a></article>
        <article class="mastery-course-card"><span>PART 02 · 已开放 4 章</span><h3>从想法到可执行任务</h3><p>模糊目标、完成标准、指令与执行策略。</p><a :href="withBase('/chapters/05-需求不清楚如何带Claude探索')">阅读第 05–08 章 →</a></article>
        <article class="mastery-course-card"><span>PART 03 · 已开放 4 章</span><h3>理解项目与上下文</h3><p>陌生仓库、文件证据、CLAUDE.md 与跨会话。</p><a :href="withBase('/chapters/09-接手不知道怎么运行的项目')">阅读第 09–12 章 →</a></article>
        <article class="mastery-course-card"><span>PART 04 · 课程规划</span><h3>执行与版本控制</h3><p>权限、介入、Git、Worktree 与并行。</p><small>章节 13–16 · 正在编写</small></article>
        <article class="mastery-course-card"><span>PART 05 · 课程规划</span><h3>验证、审查与交付</h3><p>Browser 预览、测试、diff、PR 和发布。</p><small>章节 17–20 · 正在编写</small></article>
        <article class="mastery-course-card mastery-card-feature"><span>PART 06 · 先行示范</span><h3>停止无效补丁</h3><p>学会找证据、查假设、最小修复和回归验证。</p><a :href="withBase('/chapters/22-停止反复补丁')">阅读第 22 章 →</a></article>
        <article class="mastery-course-card"><span>PART 07 · 课程规划</span><h3>扩展 Claude 能力</h3><p>Skills、Connectors / MCP、Hooks、Subagents。</p><small>章节 25–28 · 正在编写</small></article>
        <article class="mastery-course-card"><span>PART 08 · 课程规划</span><h3>复杂项目与毕业挑战</h3><p>多环境长期协作，从未知项目走向交付。</p><small>章节 29–32 · 正在编写</small></article>
      </div>
    </section>
  </div>
</template>
