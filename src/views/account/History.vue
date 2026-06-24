<template>
  <div class="account-page">
    <!-- Filters -->
    <div class="filters">
      <input v-model="searchAppId" class="filter-input" :placeholder="t('history.searchAppId')" />
      <input v-model="searchEmail" class="filter-input" :placeholder="t('history.searchEmail')" />
      <select v-model="searchStatus" class="filter-input">
        <option :value="null">{{ t('history.allStatus') }}</option>
        <option :value="1">{{ t('history.success') }}</option>
        <option :value="3">{{ t('history.refund') }}</option>
      </select>
      <button class="filter-btn primary" @click="fetchPurchaseRecords(1)">{{ t('common.search') }}</button>
      <button class="filter-btn" @click="resetFilters">{{ t('common.reset') }}</button>
    </div>
    
    <!-- Loading state -->
    <div v-if="loading" class="loading-container">
      <p>{{ t('history.loading') }}</p>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="error-message">
      <p>{{ t('history.loadFailed') }}: {{ error }}</p>
      <el-button @click="fetchPurchaseRecords" class="retry-btn">{{ t('common.retry') }}</el-button>
    </div>

    <!-- Purchase Records Table -->
    <div v-else class="table-container">
      <table class="purchase-table">
        <thead>
          <tr>
            <th>{{ t('history.timestamp') }}</th>
            <th>{{ t('history.userEmail') }}</th>
            <th class="app-image-column">{{ t('history.appImage') }}</th>
            <th>{{ t('history.product') }}</th>
            <th>{{ t('history.country') }}</th>
            <th>{{ t('history.device') }}</th>
            <th>{{ t('history.status') }}</th>
            <th>{{ t('history.paymentType') }}</th>
            <th>{{ t('history.orderSource') }}</th>
            <th>{{ t('history.tax') }}</th>
            <th>{{ t('history.wristoShare') }}</th>
            <th>{{ t('history.actions') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="record in purchaseRecords" :key="record.id">
            <td :data-label="t('history.timestamp')">{{ formatTimestamp(record.createdAt) }}</td>
            <td :data-label="t('history.userEmail')">
              <span class="email-mask" :title="maskEmail(record.email)">{{ maskEmail(record.email) }}</span>
            </td>
            <td :data-label="t('history.appImage')" class="app-image-column">
              <img 
                v-if="getProductImage(record)" 
                :src="getProductImage(record)" 
                :alt="formatProduct(record)"
                class="product-image"
                @error="handleImageError"
              />
              <div v-else class="no-image-placeholder">{{ t('common.noImage') }}</div>
            </td>
            <td :data-label="t('history.product')">
              <a 
                v-if="getProductUrl(record)" 
                :href="getProductUrl(record)" 
                target="_blank" 
                rel="noopener noreferrer"
                class="product-link"
              >
                {{ formatProduct(record) }}
              </a>
              <span v-else class="product-name">{{ formatProduct(record) }}</span>
            </td>
            <td :data-label="t('history.country')">{{ record.countryCode || '-' }}</td>
            <td :data-label="t('history.device')">
              <span class="device-name" :title="formatDevice(record)">{{ formatDevice(record) }}</span>
            </td>
            <td :data-label="t('history.status')">
              <span :class="['status-badge', getStatusClass(record.status)]">
                {{ record.statusDesc }}
              </span>
            </td>
            <td :data-label="t('history.paymentType')">
              <span class="pay-tag" :style="paymentTagStyle(record.paymentMethod)">
                {{ paymentLabel(record.paymentMethod) }}
              </span>
            </td>
            <td :data-label="t('history.orderSource')">
              <span v-if="record.origin" class="origin-badge" :style="originBadgeStyle(record.origin)">{{ record.origin }}</span>
              <span v-else>-</span>
            </td>
            <td :data-label="t('history.tax')">{{ record.tax > 0 ? formatCurrency(record.tax / 100) : t('common.na') }}</td>
            <td :data-label="t('history.wristoShare')">${{ formatCurrency(record.earnings / 100) }}</td>
            <td :data-label="t('history.actions')">
              <el-button size="small" @click="openDetail(record)">{{ t('common.details') }}</el-button>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Details Dialog -->
      <el-dialog v-model="detailVisible" :title="t('history.orderDetails')" width="min(720px, calc(100vw - 24px))">
        <template v-if="selectedRecord">
          <el-descriptions :column="2" size="small" border>
            <el-descriptions-item :label="t('history.orderId')">{{ selectedRecord.id }}</el-descriptions-item>
            <el-descriptions-item :label="t('history.timestamp')">{{ formatTimestamp(selectedRecord.createdAt) }}</el-descriptions-item>
            <el-descriptions-item label="Email">{{ maskEmail(selectedRecord.email) }}</el-descriptions-item>
            <el-descriptions-item :label="t('history.user')">{{ selectedRecord.user?.username }} (ID: {{ selectedRecord.userId }})</el-descriptions-item>
            <el-descriptions-item :label="t('history.appId')">{{ selectedRecord.appId }}</el-descriptions-item>
            <el-descriptions-item :label="t('history.bundleId')">{{ selectedRecord.bundleId || '-' }}</el-descriptions-item>
            <el-descriptions-item :label="t('history.isBundle')">{{ selectedRecord.isBundle ? t('common.yes') : t('common.no') }}</el-descriptions-item>
            <el-descriptions-item :label="t('history.product')">{{ formatProduct(selectedRecord) }}</el-descriptions-item>
            <el-descriptions-item :label="t('history.payment')">
              <el-tag size="small">{{ paymentLabel(selectedRecord.paymentMethod) }}</el-tag>
            </el-descriptions-item>
            <el-descriptions-item :label="t('history.status')">
              <el-tag :type="getStatusClass(selectedRecord.status) === 'success' ? 'success' : 'danger'" size="small">
                {{ selectedRecord.statusDesc }}
              </el-tag>
            </el-descriptions-item>
            <el-descriptions-item :label="t('history.subtotal')">${{ formatCurrency(selectedRecord.subtotal / 100) }}</el-descriptions-item>
            <el-descriptions-item :label="t('history.tax')">{{ selectedRecord.tax > 0 ? '$' + formatCurrency(selectedRecord.tax / 100) : t('common.na') }}</el-descriptions-item>
            <el-descriptions-item :label="t('history.fee')">${{ formatCurrency(selectedRecord.fee / 100) }}</el-descriptions-item>
            <el-descriptions-item :label="t('history.discount')">${{ formatCurrency(selectedRecord.discount / 100) }}</el-descriptions-item>
            <el-descriptions-item :label="t('history.grandTotal')">${{ formatCurrency(selectedRecord.grandTotal / 100) }}</el-descriptions-item>
            <el-descriptions-item :label="t('history.earnings')">${{ formatCurrency(selectedRecord.earnings / 100) }}</el-descriptions-item>
            <el-descriptions-item :label="t('history.creditUsed')">${{ formatCurrency(selectedRecord.credit / 100) }}</el-descriptions-item>
            <el-descriptions-item :label="t('history.currency')">{{ selectedRecord.currencyCode }}</el-descriptions-item>
            <el-descriptions-item :label="t('history.country')">{{ selectedRecord.countryCode || '-' }}</el-descriptions-item>
            <el-descriptions-item :label="t('history.device')">{{ formatDevice(selectedRecord) }}</el-descriptions-item>
            <el-descriptions-item :label="t('history.origin')">{{ selectedRecord.origin }}</el-descriptions-item>
            <el-descriptions-item :label="t('history.transactionId')">{{ selectedRecord.transactionId }}</el-descriptions-item>
            <el-descriptions-item :label="t('history.customerId')">{{ selectedRecord.customerId }}</el-descriptions-item>
            <el-descriptions-item :label="t('history.addressId')">{{ selectedRecord.addressId }}</el-descriptions-item>
            <el-descriptions-item :label="t('history.inPayout')">{{ selectedRecord.inPayout === 1 ? t('common.yes') : t('common.no') }}</el-descriptions-item>
            <el-descriptions-item :label="t('history.updatedAt')">{{ formatTimestamp(selectedRecord.updatedAt) }}</el-descriptions-item>
          </el-descriptions>

          <el-divider content-position="left">{{ t('history.product') }}</el-divider>
          <div v-if="selectedRecord.product" class="nested-content">
            <img v-if="selectedRecord.product.garminImageUrl" :src="selectedRecord.product.garminImageUrl" alt="Product" class="nested-thumb" />
            <el-descriptions :column="2" size="small">
              <el-descriptions-item :label="t('history.name')">{{ selectedRecord.product.name }}</el-descriptions-item>
              <el-descriptions-item :label="t('history.appId')">{{ selectedRecord.product.appId }}</el-descriptions-item>
              <el-descriptions-item :label="t('history.designId')">{{ selectedRecord.product.designId }}</el-descriptions-item>
              <el-descriptions-item :label="t('history.price')">${{ formatCurrency(selectedRecord.product.price) }}</el-descriptions-item>
              <el-descriptions-item v-if="selectedRecord.product.garminStoreUrl" :label="t('history.store')">
                <a :href="selectedRecord.product.garminStoreUrl" target="_blank" class="product-link">{{ t('common.open') }}</a>
              </el-descriptions-item>
            </el-descriptions>
          </div>
          <div v-else class="empty-sub">{{ t('history.noProductInfo') }}</div>

          <el-divider content-position="left">{{ t('history.bundle') }}</el-divider>
          <div v-if="recordBundles(selectedRecord).length" class="bundle-list-detail">
            <div v-for="bundle in recordBundles(selectedRecord)" :key="bundle.bundleId" class="bundle-detail-item">
              <el-descriptions :column="2" size="small">
                <el-descriptions-item :label="t('history.bundleId')">{{ bundle.bundleId }}</el-descriptions-item>
                <el-descriptions-item :label="t('history.name')">{{ bundle.bundleName }}</el-descriptions-item>
                <el-descriptions-item label="Type">{{ bundle.bundleType || 'custom' }}</el-descriptions-item>
                <el-descriptions-item label="Status">{{ bundle.isActive === 1 ? t('history.success') : '-' }}</el-descriptions-item>
                <el-descriptions-item :label="t('history.desc')" :span="2">
                  <div class="multiline">{{ bundle.bundleDesc }}</div>
                </el-descriptions-item>
                <el-descriptions-item :label="t('history.price')">${{ formatCurrency(bundle.price) }}</el-descriptions-item>
                <el-descriptions-item :label="t('history.owner')">{{ bundle.user?.username || '-' }}</el-descriptions-item>
              </el-descriptions>
            </div>
          </div>
          <div v-else class="empty-sub">{{ t('history.noBundleInfo') }}</div>
        </template>
        <template #footer>
          <span class="dialog-footer">
            <el-button type="primary" @click="detailVisible = false">{{ t('common.close') }}</el-button>
          </span>
        </template>
      </el-dialog>

      <!-- Pagination -->
      <div class="pagination-container" v-if="pageData.total > 0">
        <div class="pagination-info">
          {{ t('history.showing', {
            from: (pageData.pageNum - 1) * pageData.pageSize + 1,
            to: Math.min(pageData.pageNum * pageData.pageSize, pageData.total),
            total: pageData.total
          }) }}
        </div>
        <div class="pagination-controls">
          <button 
            @click="changePage(pageData.pageNum - 1)" 
            :disabled="pageData.pageNum <= 1"
            class="page-btn"
          >
            {{ t('history.previous') }}
          </button>
          <span class="page-info">{{ t('history.pageOf', { page: pageData.pageNum, pages: pageData.pages }) }}</span>
          <button 
            @click="changePage(pageData.pageNum + 1)" 
            :disabled="pageData.pageNum >= pageData.pages"
            class="page-btn"
          >
            {{ t('history.next') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getPurchaseRecordPageList } from '@/api/purchase'
import type { PurchaseRecordVO, PurchaseRecordPageQueryDTO, PageResponse } from '@/types/api'
import { useI18n } from '@/i18n'

const purchaseRecords = ref<PurchaseRecordVO[]>([])
const loading = ref(true)
const error = ref<string | null>(null)
const searchAppId = ref<string>('')
const searchEmail = ref<string>('')
const searchStatus = ref<number | null>(null)
const detailVisible = ref(false)
const selectedRecord = ref<PurchaseRecordVO | null>(null)
const { t, locale } = useI18n()
const pageData = ref<PageResponse<PurchaseRecordVO>>({
  pageNum: 1,
  pageSize: 10,
  total: 0,
  pages: 0,
  list: []
})

const formatTimestamp = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString(locale.value === 'zh' ? 'zh-CN' : 'en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  }).replace(/\//g, '-')
}

const maskEmail = (email?: string | null): string => {
  if (!email) return '-'
  const [localPart, domain] = email.split('@')
  if (!domain) {
    if (email.length <= 4) return `${email.charAt(0)}***`
    return `${email.slice(0, 2)}***${email.slice(-2)}`
  }
  const visibleStart = localPart.slice(0, Math.min(2, localPart.length))
  const visibleEnd = localPart.length > 4 ? localPart.slice(-2) : ''
  return `${visibleStart}***${visibleEnd}@${domain}`
}

const formatProduct = (record: PurchaseRecordVO): string => {
  if (record.isBundle && record.bundle) {
    return record.bundle.bundleName
  } else if (record.product) {
    return record.product.name
  }
  return t('history.unknownProduct')
}

const formatDevice = (record: PurchaseRecordVO | null): string => {
  if (!record) return '-'
  return record.deviceDisplayName || record.partNumber || '-'
}

const recordBundles = (record: PurchaseRecordVO | null) => {
  if (!record) return []
  return record.bundle ? [record.bundle] : []
}

const getStatusClass = (status: number): string => {
  return status === 1 ? 'success' : 'failed'
}

// Payment tag helpers
type PaymentMeta = { label: string; color: string; bg: string; border: string }
const paymentMeta = (method?: string | null): PaymentMeta => {
  const key = (method || '').toLowerCase()
  switch (key) {
    case 'card':
    case 'stripe':
      return { label: 'Card', color: '#635bff', bg: 'rgba(99,91,255,0.1)', border: 'rgba(99,91,255,0.35)' }
    case 'paypal':
      return { label: 'PayPal', color: '#003087', bg: 'rgba(0,48,135,0.08)', border: 'rgba(0,48,135,0.3)' }
    case 'apple_pay':
    case 'applepay':
      return { label: 'Apple Pay', color: '#000000', bg: 'rgba(0,0,0,0.08)', border: 'rgba(0,0,0,0.25)' }
    case 'google_pay':
    case 'googlepay':
      return { label: 'Google Pay', color: '#1a73e8', bg: 'rgba(26,115,232,0.08)', border: 'rgba(26,115,232,0.3)' }
    case 'alipay':
      return { label: 'Alipay', color: '#1677ff', bg: 'rgba(22,119,255,0.08)', border: 'rgba(22,119,255,0.3)' }
    case 'wechat':
    case 'wechat_pay':
      return { label: 'WeChat Pay', color: '#07c160', bg: 'rgba(7,193,96,0.08)', border: 'rgba(7,193,96,0.3)' }
    case 'credit':
      return { label: 'Credit', color: '#6f42c1', bg: 'rgba(111,66,193,0.08)', border: 'rgba(111,66,193,0.3)' }
    default:
      return { label: (method || t('common.unknown')).toUpperCase(), color: 'var(--color-muted)', bg: 'rgba(108,117,125,0.08)', border: 'rgba(108,117,125,0.3)' }
  }
}
const paymentLabel = (method?: string | null): string => paymentMeta(method).label
const paymentTagStyle = (method?: string | null) => {
  const m = paymentMeta(method)
  return {
    color: m.color,
    backgroundColor: m.bg,
    borderColor: m.border,
  } as Record<string, string>
}

const originBadgeStyle = (origin?: string | null) => {
  const key = (origin || '').toLowerCase()
  const styles: Record<string, { color: string; bg: string; border: string }> = {
    store: { color: '#047857', bg: '#ecfdf5', border: '#a7f3d0' },
    store_cart: { color: '#1d4ed8', bg: '#eff6ff', border: '#bfdbfe' },
    shop_code: { color: '#7c3aed', bg: '#f5f3ff', border: '#ddd6fe' },
    promotion: { color: '#b45309', bg: '#fffbeb', border: '#fde68a' },
    webhook: { color: '#be123c', bg: '#fff1f2', border: '#fecdd3' },
    crontab: { color: '#0f766e', bg: '#f0fdfa', border: '#99f6e4' },
    studio: { color: '#4338ca', bg: '#eef2ff', border: '#c7d2fe' },
  }
  const style = styles[key] || { color: '#4b5563', bg: '#f9fafb', border: '#d1d5db' }
  return {
    color: style.color,
    backgroundColor: style.bg,
    borderColor: style.border,
  } as Record<string, string>
}

const formatCurrency = (amount: number): string => {
  return amount.toFixed(2)
}

const getProductImage = (record: PurchaseRecordVO): string | undefined => {
  return record.product?.garminImageUrl
}

const getProductUrl = (record: PurchaseRecordVO): string | undefined => {
  return record.product?.garminStoreUrl
}

const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  img.style.display = 'none'
  const placeholder = img.nextElementSibling as HTMLElement
  if (placeholder) {
    placeholder.style.display = 'block'
  }
}

const fetchPurchaseRecords = async (pageNum: number = 1) => {
  try {
    loading.value = true
    error.value = null
    
    const queryDto: PurchaseRecordPageQueryDTO = {
      pageNum,
      pageSize: 10,
      email: searchEmail.value || null,
      appId: searchAppId.value ? Number(searchAppId.value) : null,
      bundleId: null,
      status: searchStatus.value
    }
    
    const response = await getPurchaseRecordPageList(queryDto)
    
    if (response.code === 0 && response.data) {
      pageData.value = response.data
      purchaseRecords.value = response.data.list
    } else {
      error.value = response.msg || t('history.fetchFailed')
    }
  } catch (err) {
    error.value = t('common.networkError')
    console.error('Error fetching purchase records:', err)
  } finally {
    loading.value = false
  }
}

const changePage = (newPage: number) => {
  if (newPage >= 1 && newPage <= pageData.value.pages) {
    fetchPurchaseRecords(newPage)
  }
}

const openDetail = (record: PurchaseRecordVO) => {
  selectedRecord.value = record
  detailVisible.value = true
}

const resetFilters = () => {
  searchAppId.value = ''
  searchEmail.value = ''
  searchStatus.value = null
  fetchPurchaseRecords(1)
}

onMounted(() => {
  fetchPurchaseRecords()
})
</script>

<style scoped>
.account-page {
  padding: 32px;
  background: var(--color-surface);
  min-height: 300px;
}

.filters { display: flex; gap: 12px; align-items: center; margin-bottom: 12px; flex-wrap: wrap; }
.filter-input { min-height: 38px; padding: 8px 10px; border: 1px solid var(--color-line); border-radius: 6px; width: 220px; }
.filter-btn { min-height: 38px; padding: 8px 12px; border-radius: 6px; border: 1px solid var(--color-line); background: var(--color-surface-soft); cursor: pointer; }
.filter-btn.primary { background: var(--color-brand); color: var(--color-surface); border-color: var(--color-brand); }

.loading-container {
  text-align: center;
  padding: 40px;
  color: var(--color-muted);
}

.error-message {
  background: var(--color-danger-soft);
  border: 1px solid var(--color-danger-soft);
  border-radius: 8px;
  padding: 16px;
  margin: 24px 0;
  color: var(--color-danger);
}

.retry-btn {
  background: var(--color-brand);
  color: var(--color-surface);
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 8px;
}

.retry-btn:hover {
  background: var(--color-brand-strong);
}

.table-container {
  margin-top: 24px;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

.purchase-table {
  width: 100%;
  min-width: 1120px;
  border-collapse: collapse;
  background: var(--color-surface);
  box-shadow: var(--shadow-sm);
  border-radius: 8px;
  overflow: hidden;
}

.purchase-table th {
  background: var(--color-surface-soft);
  padding: 12px 16px;
  font-weight: 600;
  color: var(--color-muted);
  border-bottom: 2px solid var(--color-line);
  font-size: 14px;
}

.purchase-table td {
  padding: 12px 16px;
  border-bottom: 1px solid var(--color-line);
  color: var(--color-ink);
  font-size: 14px;
}

.purchase-table tbody tr:hover {
  background: var(--color-surface-soft);
}

.purchase-table th,
.purchase-table td {
  text-align: center;
  vertical-align: middle;
}

.status-badge {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
}

.status-badge.success {
  background: var(--color-brand-soft);
  color: var(--color-brand-strong);
}

.status-badge.failed {
  background: var(--color-danger-soft);
  color: var(--color-danger);
}

.pay-tag {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 999px;
  border: 1px solid transparent;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.3px;
  text-transform: uppercase;
}

.origin-badge {
  display: inline-block;
  max-width: 112px;
  padding: 4px 10px;
  border: 1px solid transparent;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 700;
  line-height: 1.2;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.email-mask {
  display: inline-block;
  max-width: 180px;
  overflow: hidden;
  font-variant-numeric: tabular-nums;
  text-overflow: ellipsis;
  vertical-align: middle;
  white-space: nowrap;
}

.pagination-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
  padding: 16px 0;
}

.pagination-info {
  color: var(--color-muted);
  font-size: 14px;
}

.pagination-controls {
  display: flex;
  align-items: center;
  gap: 16px;
}

.page-btn {
  background: var(--color-brand);
  color: var(--color-surface);
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.page-btn:hover:not(:disabled) {
  background: var(--color-brand-strong);
}

.page-btn:disabled {
  background: var(--color-muted);
  cursor: not-allowed;
}

.page-info {
  color: var(--color-muted);
  font-size: 14px;
  font-weight: 500;
}

.product-image {
  width: 40px;
  height: 40px;
  min-width: 40px;
  min-height: 40px;
  max-width: 40px;
  max-height: 40px;
  aspect-ratio: 1 / 1;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid var(--color-line);
  display: block;
  flex: 0 0 40px;
  transition: transform 0.2s ease;
}

.product-image:hover {
  transform: scale(1.1);
}

.no-image-placeholder {
  width: 40px;
  height: 40px;
  min-width: 40px;
  min-height: 40px;
  max-width: 40px;
  max-height: 40px;
  aspect-ratio: 1 / 1;
  border-radius: 50%;
  background: var(--color-surface-soft);
  border: 2px solid var(--color-line);
  display: flex;
  flex: 0 0 40px;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  color: var(--color-muted);
  text-align: center;
  line-height: 1;
}

.app-image-column {
  min-width: 72px;
  width: 72px;
  text-align: center;
  white-space: nowrap;
}

td.app-image-column {
  box-sizing: border-box;
}

td.app-image-column .product-image,
td.app-image-column .no-image-placeholder {
  margin: 0 auto;
}

.product-link {
  color: var(--color-brand);
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s ease;
}

.product-link:hover {
  color: var(--color-brand-strong);
  text-decoration: underline;
}

.product-name {
  color: var(--color-ink);
  font-weight: 500;
}

/* Responsive design */
/* Details dialog */
.details-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px 16px;
}
.detail-item {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  padding: 6px 0;
  border-bottom: 1px dashed var(--color-line);
}
.detail-item .k {
  color: var(--color-muted);
}
.detail-item .v {
  color: var(--color-ink);
  font-weight: 500;
  word-break: break-all;
  text-align: right;
}

.nested-section {
  margin-top: 16px;
  padding-top: 8px;
  border-top: 2px solid var(--color-line);
}
.nested-title {
  margin: 0 0 8px 0;
  font-size: 14px;
  color: var(--color-muted);
}
.nested-content {
  display: flex;
  gap: 12px;
  align-items: flex-start;
}
.nested-thumb {
  width: 64px;
  height: 64px;
  object-fit: cover;
  border-radius: 50%;
  border: 1px solid var(--color-line);
}
.nested-fields > div { padding: 2px 0; }

.bundle-products {
  margin-top: 10px;
}
.bundle-list-detail {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.bundle-detail-item {
  padding: 12px;
  border: 1px solid var(--color-line);
  border-radius: 6px;
  background: var(--color-surface-soft);
}
.bp-title {
  font-weight: 600;
  color: var(--color-muted);
  margin-bottom: 6px;
}
.bundle-products ul {
  list-style: none;
  margin: 0;
  padding: 0;
}
.bundle-products li {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 0;
  border-bottom: 1px dashed var(--color-line);
}
.bp-thumb {
  width: 28px;
  height: 28px;
  object-fit: cover;
  border-radius: 6px;
  border: 1px solid var(--color-line);
}
.bp-name { color: var(--color-ink); }

/* preserve newlines and wrapping for multiline text in descriptions */
.multiline {
  white-space: pre-wrap;
  word-break: break-word;
}

@media (max-width: 768px) {
  .account-page {
    padding: 10px;
  }

  .filters {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 8px;
    margin-bottom: 10px;
  }

  .filter-input,
  .filter-btn {
    width: 100%;
    min-width: 0;
    min-height: 36px;
    font-size: 13px;
  }

  .filter-input:nth-child(2) {
    grid-column: 1 / -1;
  }

  .table-container {
    margin-top: 14px;
    overflow-x: visible;
  }

  .purchase-table {
    min-width: 0;
    display: block;
    background: transparent;
    box-shadow: none;
    border-radius: 0;
  }

  .purchase-table thead {
    display: none;
  }

  .purchase-table tbody {
    display: grid;
    gap: 10px;
  }

  .purchase-table tr {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 0;
    border: 1px solid var(--color-line);
    border-radius: 10px;
    background: var(--color-surface);
    box-shadow: var(--shadow-sm);
    overflow: hidden;
  }

  .purchase-table td {
    min-width: 0;
    min-height: 0;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    gap: 4px;
    padding: 9px 10px;
    border-bottom: 1px solid var(--color-line);
    border-right: 1px solid var(--color-line);
    color: var(--color-ink);
    font-size: 13px;
    line-height: 1.35;
    text-align: left;
    overflow-wrap: anywhere;
  }

  .purchase-table td:nth-child(even),
  .purchase-table td:last-child {
    border-right: 0;
  }

  .purchase-table td:nth-last-child(-n + 2) {
    border-bottom: 0;
  }

  .purchase-table td::before {
    content: attr(data-label);
    color: var(--color-muted);
    font-size: 11px;
    font-weight: 800;
    line-height: 1.1;
    text-align: left;
    text-transform: uppercase;
  }

  .purchase-table tbody tr:hover {
    background: var(--color-surface);
  }
  
  .product-image,
  .no-image-placeholder {
    width: 34px;
    height: 34px;
    min-width: 34px;
    min-height: 34px;
    max-width: 34px;
    max-height: 34px;
  }

  .app-image-column {
    width: auto;
    min-width: 0;
    white-space: normal;
  }

  td.app-image-column .product-image,
  td.app-image-column .no-image-placeholder {
    margin: 0;
  }

  .email-mask,
  .device-name,
  .origin-badge {
    max-width: 100%;
    white-space: normal;
  }

  .purchase-table td:nth-child(1),
  .purchase-table td:nth-child(2),
  .purchase-table td:nth-child(4),
  .purchase-table td:nth-child(12) {
    grid-column: 1 / -1;
  }

  .purchase-table td:nth-child(1),
  .purchase-table td:nth-child(4) {
    background: var(--color-surface-soft);
  }

  .purchase-table td:nth-child(12) :deep(.el-button) {
    width: 100%;
    min-height: 34px;
  }

  .nested-content {
    flex-direction: column;
  }

  :deep(.el-descriptions__body .el-descriptions__table) {
    display: block;
  }

  :deep(.el-descriptions__body .el-descriptions__table tbody),
  :deep(.el-descriptions__body .el-descriptions__table tr),
  :deep(.el-descriptions__body .el-descriptions__table th),
  :deep(.el-descriptions__body .el-descriptions__table td) {
    display: block;
    width: 100% !important;
  }
  
  .pagination-container {
    align-items: stretch;
    flex-direction: column;
    gap: 12px;
  }

  .pagination-controls {
    justify-content: space-between;
    gap: 8px;
  }

  .page-btn {
    flex: 1;
    min-height: 38px;
    padding: 8px 10px;
  }

  .page-info {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 86px;
    text-align: center;
  }
}

@media (max-width: 380px) {
  .filters {
    grid-template-columns: 1fr;
  }

  .filter-input:nth-child(2) {
    grid-column: auto;
  }

  .purchase-table tr {
    grid-template-columns: 1fr;
  }

  .purchase-table td,
  .purchase-table td:nth-child(even) {
    border-right: 0;
  }

  .purchase-table td:nth-last-child(2) {
    border-bottom: 1px solid var(--color-line);
  }
}
</style> 
