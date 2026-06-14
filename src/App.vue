<script setup lang="ts">
import { computed } from 'vue'
import { ElConfigProvider } from 'element-plus'
import de from 'element-plus/dist/locale/de.mjs'
import en from 'element-plus/dist/locale/en.mjs'
import es from 'element-plus/dist/locale/es.mjs'
import fr from 'element-plus/dist/locale/fr.mjs'
import it from 'element-plus/dist/locale/it.mjs'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import { useRoute } from 'vue-router'
import Layout from '@/layout/Layout.vue'
import { stripLocaleFromPath, useLocaleStore, type SupportedLocale } from '@/store/locale'

const route = useRoute()
const localeStore = useLocaleStore()
const elementLocales = { de, en, es, fr, it, zh: zhCn } satisfies Record<SupportedLocale, typeof en>
const elementLocale = computed(() => elementLocales[localeStore.currentLocale] || en)
const routePath = computed(() => stripLocaleFromPath(route.path))
</script>

<template>
  <el-config-provider :locale="elementLocale">
    <component :is="['/auth/callback'].includes(routePath) ? 'router-view' : Layout" />
  </el-config-provider>
</template>
