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

  <!-- 应用销售总计（分页） -->
  <div class="dashboard-content">
    <h3 class="section-title">应用销售总计</h3>

    <div v-if="summaryError" class="error-message">
      <p>获取应用销售总计失败：{{ summaryError }}</p>
    </div>

    <el-table
      v-loading="summaryLoading"
      :data="summaryList"
      border
      style="width: 100%"
      empty-text="No data"
    >
      <el-table-column label="应用" min-width="240">
        <template #default="{ row }">
          <div class="app-cell">
            <img v-if="row.app?.garminImageUrl" :src="row.app.garminImageUrl" alt="" class="app-thumb" />
            <div class="app-info">
              <div class="app-name">{{ row.app?.name || 'App #' + row.appId }}</div>
              <div class="app-sub">ID: {{ row.appId }}</div>
            </div>
          </div>
        </template>
      </el-table-column>

      <el-table-column prop="salesCount" label="销量" width="120" align="right" />
      <el-table-column label="总金额" width="160" align="right">
        <template #default="{ row }">
          ${{ formatCurrency(row.totalAmount) }}
        </template>
      </el-table-column>
      <el-table-column prop="bundleTriggerCount" label="触发套餐次数" width="160" align="right" />
    </el-table>

    <div class="table-footer">
      <el-pagination
        background
        layout="total, sizes, prev, pager, next, jumper"
        :total="summaryTotal"
        :page-size="summaryPageSize"
        :current-page="summaryPageNum"
        :page-sizes="[10, 20, 50]"
        @current-change="handleSummaryCurrentChange"
        @size-change="handleSummarySizeChange"
      />
    </div>
  </div>

</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getPayoutInfo } from '@/api/payout'
import { getAppSalesSummaryPage } from '@/api/purchase'
import type { PayoutVO, AppSalesSummaryVO, AppSalesSummaryPageQueryDTO } from '@/types/api'

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
  fetchSummaryPage()
})

// ===== App Sales Summary state & methods =====
const summaryList = ref<AppSalesSummaryVO[]>([])
const summaryLoading = ref(false)
const summaryError = ref<string | null>(null)
const summaryPageNum = ref(1)
const summaryPageSize = ref(10)
const summaryTotal = ref(0)

const fetchSummaryPage = async () => {
  try {
    summaryLoading.value = true
    summaryError.value = null
    const dto: AppSalesSummaryPageQueryDTO = {
      pageNum: summaryPageNum.value,
      pageSize: summaryPageSize.value
    }
    const res = await getAppSalesSummaryPage(dto)
    if (res.code === 0 && res.data) {
      summaryList.value = res.data.list || []
      summaryTotal.value = res.data.total || 0
    } else {
      summaryError.value = res.msg || 'Failed to fetch app sales summary'
    }
  } catch (e) {
    summaryError.value = 'Network error occurred'
    console.error('Error fetching app sales summary:', e)
  } finally {
    summaryLoading.value = false
  }
}

const handleSummaryCurrentChange = (page: number) => {
  summaryPageNum.value = page
  fetchSummaryPage()
}

const handleSummarySizeChange = (size: number) => {
  summaryPageSize.value = size
  summaryPageNum.value = 1
  fetchSummaryPage()
}
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

.section-title {
  font-size: 18px;
  font-weight: 700;
  color: #212529;
  margin: 16px 0;
}

.app-cell {
  display: flex;
  align-items: center;
  gap: 12px;
}
.app-thumb {
  width: 40px;
  height: 40px;
  border-radius: 6px;
  object-fit: cover;
  border: 1px solid #e9ecef;
}
.app-info {
  display: flex;
  flex-direction: column;
}
.app-name {
  font-weight: 600;
  color: #212529;
}
.app-sub {
  font-size: 12px;
  color: #6c757d;
}
.table-footer {
  display: flex;
  justify-content: flex-end;
  padding: 12px 0;
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