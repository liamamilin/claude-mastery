<script setup lang="ts">
import { computed, ref } from 'vue'

const responses = [
  { code: 'A', label: '再修改一次删除按钮的样式与事件绑定', title: '这一步没有解释刷新后的现象', explanation: '按钮点击后条目已经从当前画面消失，说明至少有一部分点击处理生效。继续改 CSS 或点击区域不能解释“刷新又出现”。除非你观察到点击根本未触发，否则它不是当前最有价值的调查。', good: false },
  { code: 'B', label: '先查删除后的存储写入，以及刷新时读入的位置', title: '这是一项有区分力的调查', explanation: '当前页面消失而刷新后恢复，提示“页面内状态”和“持久化状态”不一致。顺着删除→保存→重新加载的因果链检查，能快速确认或排除这个假设，然后做最小修复。', good: true },
  { code: 'C', label: '直接删除整个功能，重新搭建项目', title: '成本和不确定性都太高', explanation: '全面重写可能碰巧掩盖故障，但没有证据说明旧架构必须推倒。更好的做法是先重现，再用最小实验定位问题；必要时才讨论换实现。', good: false },
]
const selected = ref<string | null>(null)
const result = computed(() => responses.find(item => item.code === selected.value))
</script>

<template>
  <section class="mastery-lab" aria-label="诊断故障互动练习">
    <div class="mastery-lab-header"><span>DIAGNOSIS / 01</span><span class="mastery-lab-time">无需登录 · 本地模拟</span></div>
    <div class="mastery-lab-content">
      <div class="mastery-lab-story"><p class="mastery-label">事件记录</p><div class="mastery-event">已点击“删除” → 列表项消失</div><div class="mastery-event mastery-event-problem">刷新页面 → 列表项重新出现</div><p>Claude 已经两次调整按钮。现在你应该怎样让它继续？</p></div>
      <div class="mastery-choices" role="group" aria-label="下一步行动">
        <button v-for="item in responses" :key="item.code" class="mastery-choice" :class="{ 'is-picked': selected === item.code }" type="button" :aria-pressed="selected === item.code" @click="selected = item.code"><strong>{{ item.code }}</strong><span>{{ item.label }}</span></button>
      </div>
      <div v-if="result" class="mastery-answer" :class="{ 'is-good': result.good }" role="status" aria-live="polite"><div class="mastery-answer-label">{{ result.good ? '更有价值的下一步' : '先查证再行动' }}</div><h3>{{ result.title }}</h3><p>{{ result.explanation }}</p><button type="button" class="mastery-retry" @click="selected = null">重新选择 ↻</button></div>
      <p v-else class="mastery-lab-note">请选择一个行动。每个选项都有具体解释；本练习不执行真实 Claude Code 命令。</p>
    </div>
  </section>
</template>
