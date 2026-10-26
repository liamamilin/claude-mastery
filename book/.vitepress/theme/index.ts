import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import LandingHero from './components/LandingHero.vue'
import DecisionLab from './components/DecisionLab.vue'
import MasteryLoop from './components/MasteryLoop.vue'
import './styles.css'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('LandingHero', LandingHero)
    app.component('DecisionLab', DecisionLab)
    app.component('MasteryLoop', MasteryLoop)
  },
} satisfies Theme
