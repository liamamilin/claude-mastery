<script setup lang="ts">
import { computed, ref } from 'vue'

const questions = [
  { key: 'clear', title: '需求是否已经明确？', options: [{ v: 'yes', t: '明确：我能一句话说清要什么' }, { v: 'no', t: '模糊：我只有一个大概想法' }] },
  { key: 'known', title: '关键做法是否有把握？', options: [{ v: 'yes', t: '有把握：类似的事已经做过' }, { v: 'no', t: '没把握：涉及不熟悉的技术或代码' }] },
  { key: 'check', title: '有没有可靠的验收方式？', options: [{ v: 'yes', t: '有：我知道点什么、看到什么算对' }, { v: 'no', t: '没有：只能凭感觉' }] },
  { key: 'fails', title: '同一问题已连续失败几次？', options: [{ v: '0', t: '0–1 次' }, { v: '2', t: '2 次或更多' }] },
] as const

const answers = ref<Record<string, string>>({ clear: '', known: '', check: '', fails: '' })
const ready = computed(() => Object.values(answers.value).every(Boolean))
const copied = ref(false)

const advice = computed(() => {
  const a = answers.value
  if (!ready.value) return null
  if (a.fails === '2')
    return { name: '先调查根因，不再补丁', why: '连续两次失败后，继续在同一段对话里修补，只会让上下文里堆满失败的尝试。需要换成“收集证据、检验假设”。', mode: 'Plan 或 Manual（禁止改文件）', prompt: '请暂停修改。先告诉我：已知的事实是什么；哪些只是推测；用哪一个最小的检查可以区分这些推测。检查之前不要改任何文件。', chapter: '第 22 章' }
  if (a.clear === 'no')
    return { name: '先探索，不要实施', why: '需求还不清楚时，最有价值的产物是几个可比较的方向，而不是代码。', mode: 'Plan（或 Manual 并明确禁止改文件）', prompt: '请先看现有文件，不要改任何文件。给我三个互相有区别的小方向，各写清楚解决什么问题、影响哪些文件、我如何在浏览器里看出做成了；最后说你推荐哪个。', chapter: '第 05 章' }
  if (a.known === 'no')
    return { name: '先做一个小样验证做法', why: '不确定关键做法时，先花很小的代价验证它行得通，比直接做完整功能更安全。', mode: 'Manual，限定在一个临时目录或分支', prompt: '我不确定这个做法是否可行。请只做一个最小的验证样例，放在单独的目录，不要改现有功能；做完告诉我它证明了什么、没证明什么。', chapter: '第 05、08 章' }
  if (a.check === 'no')
    return { name: '先把验收方式写出来', why: '没有验收方式时，“完成”只能靠 Claude 的自我汇报。先把成功写成可观察的行为，再动手。', mode: 'Plan，写完清单后再切换', prompt: '在动手之前，请帮我把这个任务的成功标准写成“做某个动作 → 看到某个结果”的清单，包括失败时应出现的反馈；写完等我确认。', chapter: '第 06 章' }
  return { name: '直接执行', why: '需求明确、做法有把握、验收方式清楚，而且还没有失败记录——规划只会增加开销。如果你能一句话描述这次 diff，就不必先做计划。', mode: 'Manual 或 Accept edits', prompt: '请完成这个任务：（目标）。约束：（只写确有理由的硬约束）。完成后告诉我改了哪些文件、你验证了什么、哪些需要我在浏览器里验证。', chapter: '第 07 章' }
})

async function copyPrompt() {
  if (!advice.value) return
  try { await navigator.clipboard.writeText(advice.value.prompt); copied.value = true; setTimeout(() => (copied.value = false), 1800) } catch { copied.value = false }
}
function reset() { answers.value = { clear: '', known: '', check: '', fails: '' } }
</script>

<template>
  <section class="mastery-lab" aria-label="执行方式选择器">
    <div class="mastery-lab-header"><span>LAB 02 / 执行方式选择器</span><span class="mastery-lab-time">纯前端 · 不运行 Claude</span></div>
    <div class="mastery-lab-content">
      <fieldset v-for="q in questions" :key="q.key" class="mp-q">
        <legend>{{ q.title }}</legend>
        <div class="mp-opts">
          <button v-for="o in q.options" :key="o.v" type="button" class="mastery-choice" :class="{ 'is-picked': answers[q.key] === o.v }" :aria-pressed="answers[q.key] === o.v" @click="answers[q.key] = o.v"><span>{{ o.t }}</span></button>
        </div>
      </fieldset>
      <div v-if="advice" class="mastery-answer is-good" role="status" aria-live="polite">
        <div class="mastery-answer-label">建议：{{ advice.name }}</div>
        <p>{{ advice.why }}</p>
        <p><strong>建议权限模式：</strong>{{ advice.mode }}　<strong>对应章节：</strong>{{ advice.chapter }}</p>
        <p><strong>可复制到 [Desktop Code] 提示框：</strong></p>
        <blockquote class="mp-prompt">{{ advice.prompt }}</blockquote>
        <button type="button" class="mastery-retry" @click="copyPrompt">{{ copied ? '已复制 ✓' : '复制提示词' }}</button>
        <button type="button" class="mastery-retry" @click="reset">重新选择 ↻</button>
      </div>
      <p v-else class="mastery-lab-note">回答全部四个问题，查看建议。这是一个教学用的经验规则，不是唯一正确答案。</p>
    </div>
  </section>
</template>

<style scoped>
.mp-q { border: 0; padding: 0; margin: 0 0 18px; }
.mp-q legend { font-weight: 600; margin-bottom: 8px; }
.mp-opts { display: grid; gap: 8px; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); }
.mp-prompt { margin: 8px 0 12px; padding: 10px 14px; border-left: 3px solid #e8ad66; white-space: pre-wrap; }
</style>
