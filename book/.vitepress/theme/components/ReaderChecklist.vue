<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'

const props = defineProps<{ id: string; title: string; items: string[] }>()
const key = `mastery-checklist:${props.id}`
const checked = ref<boolean[]>(props.items.map(() => false))
const stored = ref(true)

onMounted(() => {
  try {
    const raw = localStorage.getItem(key)
    if (raw) {
      const arr = JSON.parse(raw)
      if (Array.isArray(arr)) checked.value = props.items.map((_, i) => arr[i] === true)
    }
  } catch { stored.value = false }
})

function persist() {
  try { localStorage.setItem(key, JSON.stringify(checked.value)) } catch { stored.value = false }
}
function toggle(i: number) { checked.value[i] = !checked.value[i]; persist() }
function clear() {
  checked.value = props.items.map(() => false)
  try { localStorage.removeItem(key) } catch { stored.value = false }
}
const done = computed(() => checked.value.filter(Boolean).length)
</script>

<template>
  <section class="rc" :aria-label="title">
    <h4 class="rc-title">{{ title }}</h4>
    <ul class="rc-list">
      <li v-for="(item, i) in items" :key="i">
        <label>
          <input type="checkbox" :checked="checked[i]" @change="toggle(i)" />
          <span>{{ item }}</span>
        </label>
      </li>
    </ul>
    <p class="rc-meta">
      已勾选 {{ done }} / {{ items.length }}。<strong>这是你的自报，不是自动测试</strong>，不会上传，只保存在本浏览器。
      <span v-if="!stored">（此浏览器禁止了本地存储，刷新后会清空。）</span>
      <button type="button" class="rc-clear" @click="clear">清空记录</button>
    </p>
  </section>
</template>

<style scoped>
.rc { border: 1px solid var(--vp-c-divider); border-radius: 8px; padding: 14px 16px; margin: 16px 0; }
.rc-title { margin: 0 0 8px; }
.rc-list { list-style: none; padding: 0; margin: 0; }
.rc-list li { margin: 6px 0; }
.rc-list label { display: flex; gap: 10px; align-items: flex-start; cursor: pointer; }
.rc-list input { margin-top: 5px; min-width: 16px; min-height: 16px; }
.rc-meta { font-size: 13px; color: var(--vp-c-text-2); margin: 10px 0 0; }
.rc-clear { margin-left: 8px; padding: 2px 10px; border: 1px solid var(--vp-c-divider); border-radius: 4px; background: transparent; color: inherit; cursor: pointer; }
</style>
