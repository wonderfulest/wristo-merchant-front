<template>
  <div class="lang-switcher" role="navigation" :aria-label="t('language.selector')">
    <button class="current" type="button" :aria-expanded="isOpen" @click="isOpen = !isOpen">
      <el-icon><Connection /></el-icon>
      <span>{{ getLanguageLabel(currentLocale) }}</span>
      <el-icon :class="{ rotated: isOpen }"><ArrowDown /></el-icon>
    </button>
    <div class="buttons" :class="{ open: isOpen }">
      <button
        v-for="locale in supportedLocales"
        :key="locale"
        class="option"
        :class="{ active: locale === currentLocale }"
        type="button"
        @click="switchLanguage(locale)"
      >
        {{ getLanguageLabel(locale) }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowDown, Connection } from '@element-plus/icons-vue'
import { useI18n } from '@/i18n'
import { addLocaleToPath, normalizeLocale, SUPPORTED_LOCALES, stripLocaleFromPath, useLocaleStore } from '@/store/locale'

const route = useRoute()
const router = useRouter()
const localeStore = useLocaleStore()
const { t } = useI18n()
const isOpen = ref(false)
const supportedLocales = SUPPORTED_LOCALES
const languageLabels: Record<string, string> = {
  de: 'Deutsch',
  en: 'English',
  es: 'Español',
  fr: 'Français',
  it: 'Italiano',
  zh: '中文',
}

const currentLocale = computed(() => {
  const p = route.params.lang
  const fromParam = Array.isArray(p) ? p[0] : (typeof p === 'string' ? p : undefined)
  const q = route.query.lang
  const fromQuery = Array.isArray(q) ? (q[0] ?? undefined) : (typeof q === 'string' && q ? q : undefined)
  return normalizeLocale(fromParam || fromQuery || localeStore.currentLocale)
})

function switchLanguage(targetLang: string) {
  const nextLocale = normalizeLocale(targetLang)
  localeStore.setLocale(nextLocale)
  isOpen.value = false
  router.push(addLocaleToPath(stripLocaleFromPath(route.fullPath), nextLocale))
}

function getLanguageLabel(locale: string) {
  const normalized = normalizeLocale(locale)
  return languageLabels[normalized] || languageLabels.en
}
</script>

<style scoped lang="scss">
@import '@/assets/styles/variables.scss';

.lang-switcher {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.buttons {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  z-index: 50;
  display: none;
  min-width: 164px;
  max-height: min(420px, calc(100vh - 96px));
  overflow-y: auto;
  padding: 8px;
  border: 1px solid rgba(15, 23, 42, 0.08);
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.96);
  box-shadow: 0 18px 42px rgba(15, 23, 42, 0.14);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
}

.buttons.open {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.current,
.option {
  appearance: none;
  border: 1px solid transparent;
  color: #334155;
  background: transparent;
  font-family: inherit;
  font-weight: 750;
  cursor: pointer;
  transition: all 0.2s ease;
}

.current {
  min-height: 40px;
  padding: 0 10px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  white-space: nowrap;
}

.current:hover,
.current:focus-visible {
  color: $color-brand-strong;
  background: $color-brand-soft;
  outline: none;
}

.current .el-icon {
  transition: transform 0.2s ease;
}

.current .el-icon.rotated {
  transform: rotate(180deg);
}

.option {
  width: 100%;
  min-height: 34px;
  padding: 0 10px;
  border-radius: 8px;
  text-align: left;
  white-space: nowrap;
}

.option:hover,
.option.active {
  color: $color-brand-strong;
  background: rgba(15, 107, 104, 0.08);
}

@media (max-width: 640px) {
  .lang-switcher {
    width: 100%;
    justify-content: stretch;
  }

  .current {
    width: 100%;
    min-height: 44px;
    justify-content: center;
    border-radius: 16px;
    background: rgba(255, 255, 255, 0.72);
    border-color: rgba(15, 23, 42, 0.06);
  }

  .buttons {
    position: static;
    width: 100%;
    max-height: min(360px, calc(100vh - 180px));
    margin-top: 8px;
    box-shadow: none;
    background: rgba(238, 245, 243, 0.82);
  }
}
</style>
