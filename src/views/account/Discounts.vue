<template>
  <div class="account-page">
    <h2>{{ t('discounts.title') }}</h2>
    <p>{{ t('discounts.empty') }}</p>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from '@/i18n'

const { t } = useI18n()
</script>

<style scoped>
.account-page {
  padding: 32px;
  background: var(--color-surface);
  border: 1px solid var(--color-line);
  border-radius: var(--radius-sm);
  box-shadow: var(--shadow-sm);
  min-height: 300px;
}
</style> 
