// A deliberately tiny DOM harness, to verify the persistence logic without npm/browser dependencies.
// This is NOT a substitute for actual browser acceptance tests in Claude Desktop.
import { readFileSync } from 'node:fs'
import { runInNewContext } from 'node:vm'
import { resolve } from 'node:path'
import assert from 'node:assert/strict'

function element(name = 'div') {
  return {
    name, children: [], listeners: {}, textContent: '', className: '', style: {},
    append(...children) { this.children.push(...children) },
    appendChild(child) { this.children.push(child); return child },
    replaceChildren(...children) { this.children = [...children] },
    setAttribute(key, value) { this[key] = value },
    addEventListener(key, callback) { this.listeners[key] = callback },
    trigger(key, event = {}) { assert.ok(this.listeners[key], `${this.name} has no ${key}`); this.listeners[key](event) },
    reset() { if (this.elements) for (const field of Object.values(this.elements)) field.value = '' },
  }
}
function makeDom() {
  const nodes = {};
  for (const name of ['#list','#count','#message','#form','#tasks','#info','#task-form','#reset']) nodes[name] = element(name);
  for (const form of [nodes['#form'], nodes['#task-form']]) form.elements = { title: { value: '' }, url: { value: '' }, name: { value: '' } };
  return { nodes, document: { querySelector(selector) { assert.ok(nodes[selector], selector); return nodes[selector] }, createElement: tag => element(tag) } };
}
function makeStore() {
  const data = new Map()
  return { data, storage: { getItem: key => data.has(key) ? data.get(key) : null, setItem: (k,v) => data.set(k,String(v)), removeItem: k => data.delete(k) } }
}
function boot(scriptPath, storage) {
  const {nodes,document} = makeDom();
  const script = readFileSync(resolve(scriptPath), 'utf8');
  runInNewContext(script, { document, localStorage: storage, URL, crypto: undefined, Date, Math, JSON, console }, { filename: scriptPath, timeout: 2500 })
  return nodes
}

const a = 'cases/lab-a-links/app.js'
const d = 'cases/lab-d-persistence/app.js'
const fixed = 'cases/lab-d-persistence/solution/app.js'
const first = makeStore()
let page = boot(a, first.storage)
assert.equal(page['#count'].textContent, '0 条')
page['#form'].elements.title.value = 'Anthropic docs'
page['#form'].elements.url.value = 'https://code.claude.com/docs'
page['#form'].trigger('submit', { preventDefault() {} })
assert.equal(page['#count'].textContent, '1 条')
page = boot(a, first.storage)
assert.equal(page['#count'].textContent, '1 条', 'Lab A must persist new links across reloads')
page['#list'].children[0].children[1].trigger('click')
page = boot(a, first.storage)
assert.equal(page['#count'].textContent, '0 条', 'Lab A must persist removals across reloads')
console.log('PASS Lab A: add → reload → remove → reload')

const bad = makeStore()
page = boot(d, bad.storage)
assert.equal(page['#tasks'].children[0].children[0].textContent, '故障排查实验')
page['#tasks'].children[0].children[1].trigger('click')
assert.equal(page['#tasks'].children[0].textContent, '当前页面没有任务')
page = boot(d, bad.storage)
assert.equal(page['#tasks'].children[0].children[0].textContent, '故障排查实验', 'Lab D should intentionally reproduce persistence bug')
console.log('PASS Lab D starter: removal appears successful, item reappears after reload (intentional bug)')

const good = makeStore()
page = boot(fixed, good.storage)
page['#tasks'].children[0].children[1].trigger('click')
page = boot(fixed, good.storage)
assert.equal(page['#tasks'].children[0].textContent, '当前页面没有任务', 'Lab D solution must persist removal')
console.log('PASS Lab D solution: removal stays removed after reload')
