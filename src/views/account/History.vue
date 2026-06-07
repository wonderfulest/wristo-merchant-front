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
            <th>{{ t('history.appImage') }}</th>
            <th>{{ t('history.product') }}</th>
            <th>{{ t('history.status') }}</th>
            <th>{{ t('history.paymentType') }}</th>
            <th>{{ t('history.tax') }}</th>
            <th>{{ t('history.wristoShare') }}</th>
            <th>{{ t('history.actions') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="record in purchaseRecords" :key="record.id">
            <td>{{ formatTimestamp(record.createdAt) }}</td>
            <td>{{ record.email }}</td>
            <td>
              <img 
                v-if="getProductImage(record)" 
                :src="getProductImage(record)" 
                :alt="formatProduct(record)"
                class="product-image"
                @error="handleImageError"
              />
              <div v-else class="no-image-placeholder">{{ t('common.noImage') }}</div>
            </td>
            <td>
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
            <td>
              <span :class="['status-badge', getStatusClass(record.status)]">
                {{ record.statusDesc }}
              </span>
            </td>
            <td>
              <span class="pay-tag" :style="paymentTagStyle(record.paymentMethod)">
                {{ paymentLabel(record.paymentMethod) }}
              </span>
            </td>
            <td>{{ record.tax > 0 ? formatCurrency(record.tax / 100) : t('common.na') }}</td>
            <td>${{ formatCurrency(record.earnings / 100) }}</td>
            <td>
              <el-button size="small" @click="openDetail(record)">{{ t('common.details') }}</el-button>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Details Dialog -->
      <el-dialog v-model="detailVisible" :title="t('history.orderDetails')" width="720px">
        <template v-if="selectedRecord">
          <el-descriptions :column="2" size="small" border>
            <el-descriptions-item :label="t('history.orderId')">{{ selectedRecord.id }}</el-descriptions-item>
            <el-descriptions-item :label="t('history.timestamp')">{{ formatTimestamp(selectedRecord.createdAt) }}</el-descriptions-item>
            <el-descriptions-item label="Email">{{ selectedRecord.email }}</el-descriptions-item>
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
            <el-descriptions-item :label="t('history.country')">{{ selectedRecord.countryCode }}</el-descriptions-item>
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
          <template v-if="selectedRecord.bundle">
            <el-descriptions :column="2" size="small">
              <el-descriptions-item :label="t('history.bundleId')">{{ selectedRecord.bundle.bundleId }}</el-descriptions-item>
              <el-descriptions-item :label="t('history.name')">{{ selectedRecord.bundle.bundleName }}</el-descriptions-item>
              <el-descriptions-item :label="t('history.desc')" :span="2">
                <div class="multiline">{{ selectedRecord.bundle.bundleDesc }}</div>
              </el-descriptions-item>
              <el-descriptions-item :label="t('history.price')">${{ formatCurrency(selectedRecord.bundle.price) }}</el-descriptions-item>
              <el-descriptions-item :label="t('history.owner')">{{ selectedRecord.bundle.user?.username || '-' }}</el-descriptions-item>
            </el-descriptions>
            <div v-if="selectedRecord.bundle.products && selectedRecord.bundle.products.length" class="bundle-products">
              <div class="bp-title">{{ t('history.productsInBundle') }}</div>
              <ul>
                <li v-for="(p, idx) in selectedRecord.bundle.products" :key="p.appId + '-' + idx">
                  <img v-if="p.garminImageUrl" :src="p.garminImageUrl" :alt="p.name" class="bp-thumb" />
                  <span class="bp-name">{{ p.name }} ({{ p.appId }})</span>
                  <a v-if="p.garminStoreUrl" :href="p.garminStoreUrl" target="_blank" class="product-link">{{ t('common.open') }}</a>
                </li>
              </ul>
            </div>
          </template>
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

// removed masked username helper; we display full email per requirement

const formatProduct = (record: PurchaseRecordVO): string => {
  if (record.isBundle && record.bundle) {
    return record.bundle.bundleName
  } else if (record.product) {
    return record.product.name
  }
  return t('history.unknownProduct')
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
      return { label: (method || t('common.unknown')).toUpperCase(), color: '#6c757d', bg: 'rgba(108,117,125,0.08)', border: 'rgba(108,117,125,0.3)' }
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
  background: #fff;
  min-height: 300px;
}

.filters { display: flex; gap: 12px; align-items: center; margin-bottom: 12px; flex-wrap: wrap; }
.filter-input { padding: 8px 10px; border: 1px solid #dee2e6; border-radius: 6px; width: 220px; }
.filter-btn { padding: 8px 12px; border-radius: 6px; border: 1px solid #ced4da; background: #f8f9fa; cursor: pointer; }
.filter-btn.primary { background: #0d6efd; color: #fff; border-color: #0d6efd; }

.loading-container {
  text-align: center;
  padding: 40px;
  color: #666;
}

.error-message {
  background: #f8d7da;
  border: 1px solid #f5c6cb;
  border-radius: 8px;
  padding: 16px;
  margin: 24px 0;
  color: #721c24;
}

.retry-btn {
  background: #007bff;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 8px;
}

.retry-btn:hover {
  background: #0056b3;
}

.table-container {
  margin-top: 24px;
  overflow-x: auto;
}

.purchase-table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  overflow: hidden;
}

.purchase-table th {
  background: #f8f9fa;
  padding: 12px 16px;
  font-weight: 600;
  color: #495057;
  border-bottom: 2px solid #dee2e6;
  font-size: 14px;
}

.purchase-table td {
  padding: 12px 16px;
  border-bottom: 1px solid #dee2e6;
  color: #212529;
  font-size: 14px;
}

.purchase-table tbody tr:hover {
  background: #f8f9fa;
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
  background: #d4edda;
  color: #155724;
}

.status-badge.failed {
  background: #f8d7da;
  color: #721c24;
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

.pagination-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
  padding: 16px 0;
}

.pagination-info {
  color: #6c757d;
  font-size: 14px;
}

.pagination-controls {
  display: flex;
  align-items: center;
  gap: 16px;
}

.page-btn {
  background: #007bff;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.page-btn:hover:not(:disabled) {
  background: #0056b3;
}

.page-btn:disabled {
  background: #6c757d;
  cursor: not-allowed;
}

.page-info {
  color: #495057;
  font-size: 14px;
  font-weight: 500;
}

.product-image {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #e9ecef;
  transition: transform 0.2s ease;
}

.product-image:hover {
  transform: scale(1.1);
}

.no-image-placeholder {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #f8f9fa;
  border: 2px solid #e9ecef;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  color: #6c757d;
  text-align: center;
  line-height: 1;
}

.product-link {
  color: #007bff;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s ease;
}

.product-link:hover {
  color: #0056b3;
  text-decoration: underline;
}

.product-name {
  color: #212529;
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
  border-bottom: 1px dashed #e9ecef;
}
.detail-item .k {
  color: #6c757d;
}
.detail-item .v {
  color: #212529;
  font-weight: 500;
  word-break: break-all;
  text-align: right;
}

.nested-section {
  margin-top: 16px;
  padding-top: 8px;
  border-top: 2px solid #f1f3f5;
}
.nested-title {
  margin: 0 0 8px 0;
  font-size: 14px;
  color: #495057;
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
  border-radius: 8px;
  border: 1px solid #e9ecef;
}
.nested-fields > div { padding: 2px 0; }

.bundle-products {
  margin-top: 10px;
}
.bp-title {
  font-weight: 600;
  color: #495057;
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
  border-bottom: 1px dashed #e9ecef;
}
.bp-thumb {
  width: 28px;
  height: 28px;
  object-fit: cover;
  border-radius: 6px;
  border: 1px solid #e9ecef;
}
.bp-name { color: #212529; }

/* preserve newlines and wrapping for multiline text in descriptions */
.multiline {
  white-space: pre-wrap;
  word-break: break-word;
}

@media (max-width: 768px) {
  .purchase-table {
    font-size: 12px;
  }
  
  .purchase-table th,
  .purchase-table td {
    padding: 8px 12px;
  }
  
  .product-image,
  .no-image-placeholder {
    width: 32px;
    height: 32px;
  }
  
  .pagination-container {
    flex-direction: column;
    gap: 12px;
  }
}
</style> 
