<template>
  <el-card>
    <template #header>
      <div class="payout-header">
        <div class="payout-title">
          <span class="title">{{ t('dashboard.payoutOverview') }}</span>
          <span class="subtitle">{{ t('dashboard.payoutSubtitle') }}</span>
        </div>
        <el-button size="small" @click="fetchPayoutInfo" :loading="loading" type="success" plain>
          {{ t('common.refresh') }}
        </el-button>
      </div>
    </template>

    <div class="payout-cards" v-if="payoutData">
      <div class="payout-card">
        <div class="card-label">{{ t('dashboard.totalIncome') }}</div>
        <div class="card-value">${{ formatCurrency(payoutData.totalIncomeToDate) }}</div>
      </div>

      <div class="payout-card">
        <div class="card-label">{{ t('dashboard.currentBalance') }}</div>
        <div class="card-value">${{ formatCurrency(payoutData.currentBalance) }}</div>
      </div>

      <div class="payout-card">
        <div class="card-label">{{ t('dashboard.nextPayout') }}</div>
        <div class="card-value">${{ formatCurrency(payoutData.nextPayoutAmount) }}</div>
      </div>

      <div class="payout-card">
        <div class="card-label">{{ t('dashboard.nextPayDay') }}</div>
        <div class="card-value">{{ formatDate(payoutData.nextPayDay) }}</div>
      </div>
    </div>

    <div class="payout-cards loading" v-else-if="loading">
      <div class="payout-card" v-for="i in 4" :key="i">
        <div class="card-label">&nbsp;</div>
        <div class="card-value loading-text">{{ t('common.loading') }}</div>
      </div>
    </div>

    <div class="error-message" v-else-if="error">
      <p>{{ t('dashboard.payoutLoadFailed') }}: {{ error }}</p>
    </div>
  </el-card>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getPayoutInfo } from '@/api/payout'
import type { PayoutVO } from '@/types/api'
import { useI18n } from '@/i18n'

const payoutData = ref<PayoutVO | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)
const { t, locale } = useI18n()

const formatCurrency = (amount: number): string => {
  return amount.toLocaleString(locale.value === 'zh' ? 'zh-CN' : 'en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString(locale.value === 'zh' ? 'zh-CN' : 'en-US', { year: 'numeric', month: '2-digit', day: '2-digit' })
}

const fetchPayoutInfo = async () => {
  try {
    loading.value = true
    error.value = null
    const response = await getPayoutInfo()
    if (response.code === 0 && response.data) {
      payoutData.value = response.data
    } else {
      error.value = response.msg || t('dashboard.payoutFetchFailed')
    }
  } catch (err) {
    error.value = t('common.networkError')
    console.error('Error fetching payout info:', err)
  } finally {
    loading.value = false
  }
}

onMounted(fetchPayoutInfo)
</script>

<style scoped>
.payout-header { display: flex; align-items: center; justify-content: space-between; }
.payout-title { display: flex; flex-direction: column; }
.payout-title .title { font-size: 24px; font-weight: 700; color: var(--color-brand-strong); }
.payout-title .subtitle { font-size: 12px; color: var(--color-muted); }

.payout-cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px; }
.payout-card { background: var(--color-surface); border: 1px solid var(--color-line); border-radius: 10px; padding: 12px; text-align: left; }
.card-label { font-size: 12px; color: var(--color-muted); margin-bottom: 6px; }
.card-value { font-size: 22px; font-weight: 700; color: var(--color-brand-strong); line-height: 1.2; }
.loading-text { color: var(--color-muted); font-size: 16px; }
.error-message { background: var(--color-danger-soft); border: 1px solid var(--color-danger-soft); border-radius: 8px; padding: 16px; margin: 24px 0; color: var(--color-danger); }
</style>
