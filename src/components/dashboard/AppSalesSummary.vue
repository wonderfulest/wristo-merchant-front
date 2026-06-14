<template>
  <div class="dashboard-content">
    <h3 class="section-title">{{ t('dashboard.appSalesSummary') }}</h3>

    <div v-if="summaryError" class="error-message">
      <p>{{ t('dashboard.appSalesSummaryFailed') }}: {{ summaryError }}</p>
    </div>

    <el-table v-loading="summaryLoading" :data="summaryList" border style="width: 100%" :empty-text="t('common.noData')">
      <el-table-column :label="t('dashboard.app')" min-width="240">
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
      <el-table-column prop="downloadCount" :label="t('dashboard.downloadCount')" width="120" align="right" />
      <el-table-column prop="salesCount" :label="t('dashboard.salesCount')" width="120" align="right" />
      <el-table-column :label="t('dashboard.totalAmount')" width="160" align="right">
        <template #default="{ row }">
          ${{ formatCurrency(row.totalAmount) }}
        </template>
      </el-table-column>
      <el-table-column prop="bundleTriggerCount" :label="t('dashboard.bundleTriggerCount')" width="160" align="right" />
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
import { getAppSalesSummaryPage } from '@/api/purchase'
import type { AppSalesSummaryVO, AppSalesSummaryPageQueryDTO } from '@/types/api'
import { useI18n } from '@/i18n'

const summaryList = ref<AppSalesSummaryVO[]>([])
const summaryLoading = ref(false)
const summaryError = ref<string | null>(null)
const summaryPageNum = ref(1)
const summaryPageSize = ref(10)
const summaryTotal = ref(0)
const { t, locale } = useI18n()

const formatCurrency = (amount: number): string => {
  return amount.toLocaleString(locale.value === 'zh' ? 'zh-CN' : 'en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

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
      summaryError.value = res.msg || t('dashboard.summaryFetchFailed')
    }
  } catch (e) {
    summaryError.value = t('common.networkError')
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

onMounted(fetchSummaryPage)
</script>

<style scoped>
.dashboard-content { margin-top: 32px; }
.section-title { font-size: 18px; font-weight: 700; color: var(--color-ink); margin: 16px 0; }
.app-cell { display: flex; align-items: center; gap: 12px; }
.app-thumb { width: 40px; height: 40px; border-radius: 6px; object-fit: cover; border: 1px solid var(--color-line); }
.app-info { display: flex; flex-direction: column; }
.app-name { font-weight: 600; color: var(--color-ink); }
.app-sub { font-size: 12px; color: var(--color-muted); }
.table-footer { display: flex; justify-content: flex-end; padding: 12px 0; }
.error-message { background: var(--color-danger-soft); border: 1px solid var(--color-danger-soft); border-radius: 8px; padding: 16px; margin: 24px 0; color: var(--color-danger); }
</style>
