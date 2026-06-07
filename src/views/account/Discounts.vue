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
  background: #fff;
  min-height: 300px;
}
</style> 
