<template>
  <!-- Payout Information Cards -->
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

  <!-- Loading state -->
  <div class="payout-cards loading" v-else-if="loading">
    <div class="payout-card">
      <div class="card-label">TOTAL INCOME TO DATE</div>
      <div class="card-value loading-text">Loading...</div>
    </div>
    
    <div class="payout-card">
      <div class="card-label">CURRENT BALANCE</div>
      <div class="card-value loading-text">Loading...</div>
    </div>
    
    <div class="payout-card">
      <div class="card-label">NEXT PAYOUT AMOUNT</div>
      <div class="card-value loading-text">Loading...</div>
    </div>
    
    <div class="payout-card">
      <div class="card-label">NEXT PAY DAY</div>
      <div class="card-value loading-text">Loading...</div>
    </div>
  </div>

  <!-- Error state -->
  <div class="error-message" v-else-if="error">
    <p>Failed to load payout information: {{ error }}</p>
  </div>

</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getPayoutInfo } from '@/api/payout'
import type { PayoutVO } from '@/types/api'

const payoutData = ref<PayoutVO | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)

const formatCurrency = (amount: number): string => {
  return amount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
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

onMounted(() => {
  fetchPayoutInfo()
})
</script>

<style scoped>
.account-page {
  padding: 32px;
  background: #fff;
  min-height: 300px;
}

.payout-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 20px;
  margin: 24px 0;
}

.payout-card {
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 20px;
  text-align: center;
  transition: box-shadow 0.2s ease;
}

.payout-card:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.card-label {
  font-size: 12px;
  font-weight: 600;
  color: #6c757d;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 8px;
}

.card-value {
  font-size: 24px;
  font-weight: 700;
  color: #212529;
  line-height: 1.2;
}

.loading-text {
  color: #6c757d;
  font-size: 16px;
  font-weight: 400;
}

.error-message {
  background: #f8d7da;
  border: 1px solid #f5c6cb;
  border-radius: 8px;
  padding: 16px;
  margin: 24px 0;
  color: #721c24;
}

.dashboard-content {
  margin-top: 32px;
}

/* Responsive design */
@media (max-width: 768px) {
  .payout-cards {
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 16px;
  }
  
  .payout-card {
    padding: 16px;
  }
  
  .card-value {
    font-size: 20px;
  }
}

@media (max-width: 480px) {
  .payout-cards {
    grid-template-columns: 1fr;
  }
}
</style> 