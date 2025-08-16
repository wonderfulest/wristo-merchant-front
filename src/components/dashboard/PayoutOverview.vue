<template>
  <el-card>
    <template #header>
      <div class="payout-header">
        <div class="payout-title">
          <span class="title">Payout Overview</span>
          <span class="subtitle">Your latest earnings and balances</span>
        </div>
        <el-button size="small" @click="fetchPayoutInfo" :loading="loading" type="success" plain>
          Refresh
        </el-button>
      </div>
    </template>

    <div class="payout-cards" v-if="payoutData">
      <div class="payout-card">
        <div class="card-label">TOTAL INCOME TO DATE</div>
        <div class="card-value">${{ formatCurrency(payoutData.totalIncomeToDate) }}</div>
      </div>

      <div class="payout-card">
        <div class="card-label">CURRENT BALANCE</div>
        <div class="card-value">${{ formatCurrency(payoutData.currentBalance) }}</div>
      </div>

      <div class="payout-card">
        <div class="card-label">NEXT PAYOUT AMOUNT</div>
        <div class="card-value">${{ formatCurrency(payoutData.nextPayoutAmount) }}</div>
      </div>

      <div class="payout-card">
        <div class="card-label">NEXT PAY DAY</div>
        <div class="card-value">{{ formatDate(payoutData.nextPayDay) }}</div>
      </div>
    </div>

    <div class="payout-cards loading" v-else-if="loading">
      <div class="payout-card" v-for="i in 4" :key="i">
        <div class="card-label">&nbsp;</div>
        <div class="card-value loading-text">Loading...</div>
      </div>
    </div>

    <div class="error-message" v-else-if="error">
      <p>Failed to load payout information: {{ error }}</p>
    </div>
  </el-card>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getPayoutInfo } from '@/api/payout'
import type { PayoutVO } from '@/types/api'

const payoutData = ref<PayoutVO | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)

const formatCurrency = (amount: number): string => {
  return amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' })
}

const fetchPayoutInfo = async () => {
  try {
    loading.value = true
    error.value = null
    const response = await getPayoutInfo()
    if (response.code === 0 && response.data) {
      payoutData.value = response.data
    } else {
      error.value = response.msg || 'Failed to fetch payout information'
    }
  } catch (err) {
    error.value = 'Network error occurred'
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
.payout-title .title { font-size: 24px; font-weight: 700; color: #1b4332; }
.payout-title .subtitle { font-size: 12px; color: #6c757d; }

.payout-cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 20px; }
.payout-card { background: linear-gradient(180deg, #ffffff 0%, #f8fbf9 100%); border: 1px solid #e6f4ee; border-radius: 12px; padding: 18px 16px; text-align: center; box-shadow: 0 1px 2px rgba(0,0,0,0.04); }
.card-label { display: inline-block; font-size: 11px; font-weight: 700; color: #19b36b; background: #e9f7f1; border: 1px solid #ccefe0; border-radius: 999px; text-transform: uppercase; letter-spacing: 0.6px; padding: 4px 10px; margin-bottom: 10px; }
.card-value { font-size: 26px; font-weight: 800; color: #1b4332; line-height: 1.2; }
.loading-text { color: #6c757d; font-size: 16px; }
.error-message { background: #f8d7da; border: 1px solid #f5c6cb; border-radius: 8px; padding: 16px; margin: 24px 0; color: #721c24; }
</style>
