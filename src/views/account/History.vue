<template>
  <div class="account-page">
    <h2>Purchase History</h2>
    
    <!-- Loading state -->
    <div v-if="loading" class="loading-container">
      <p>Loading purchase records...</p>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="error-message">
      <p>Failed to load purchase records: {{ error }}</p>
      <el-button @click="fetchPurchaseRecords" class="retry-btn">Retry</el-button>
    </div>

    <!-- Purchase Records Table -->
    <div v-else class="table-container">
      <table class="purchase-table">
        <thead>
          <tr>
            <th>Timestamp</th>
            <th>User</th>
            <th>Image</th>
            <th>Product</th>
            <th>Status</th>
            <th>Payment Type</th>
            <th>Tax</th>
            <th>Your Share</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="record in purchaseRecords" :key="record.id">
            <td>{{ formatTimestamp(record.createdAt) }}</td>
            <td>{{ formatUser(record.email) }}</td>
            <td>
              <img 
                v-if="getProductImage(record)" 
                :src="getProductImage(record)" 
                :alt="formatProduct(record)"
                class="product-image"
                @error="handleImageError"
              />
              <div v-else class="no-image-placeholder">No Image</div>
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
            <td>{{ formatPaymentMethod(record.paymentMethod) }}</td>
            <td>{{ record.tax > 0 ? formatCurrency(record.tax / 100) : 'N/A' }}</td>
            <td>${{ formatCurrency(record.earnings / 100) }}</td>
          </tr>
        </tbody>
      </table>

      <!-- Pagination -->
      <div class="pagination-container" v-if="pageData.total > 0">
        <div class="pagination-info">
          Showing {{ (pageData.pageNum - 1) * pageData.pageSize + 1 }} to 
          {{ Math.min(pageData.pageNum * pageData.pageSize, pageData.total) }} of 
          {{ pageData.total }} results
        </div>
        <div class="pagination-controls">
          <button 
            @click="changePage(pageData.pageNum - 1)" 
            :disabled="pageData.pageNum <= 1"
            class="page-btn"
          >
            Previous
          </button>
          <span class="page-info">Page {{ pageData.pageNum }} of {{ pageData.pages }}</span>
          <button 
            @click="changePage(pageData.pageNum + 1)" 
            :disabled="pageData.pageNum >= pageData.pages"
            class="page-btn"
          >
            Next
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

const purchaseRecords = ref<PurchaseRecordVO[]>([])
const loading = ref(true)
const error = ref<string | null>(null)
const pageData = ref<PageResponse<PurchaseRecordVO>>({
  pageNum: 1,
  pageSize: 10,
  total: 0,
  pages: 0,
  list: []
})

const formatTimestamp = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  }).replace(/\//g, '-')
}

const formatUser = (email: string): string => {
  if (!email) return 'unknown'
  const namePart = email.split('@')[0]
  return namePart || 'unknown'
}

const formatProduct = (record: PurchaseRecordVO): string => {
  if (record.isBundle && record.bundle) {
    return record.bundle.bundleName
  } else if (record.product) {
    return record.product.name
  }
  return 'Unknown Product'
}

const getStatusClass = (status: number): string => {
  return status === 1 ? 'success' : 'failed'
}

const formatPaymentMethod = (method: string): string => {
  return method.toUpperCase()
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
      email: null,
      appId: null,
      bundleId: null,
      status: null,
      paymentMethod: null,
      inPayout: null
    }
    
    const response = await getPurchaseRecordPageList(queryDto)
    
    if (response.code === 0 && response.data) {
      pageData.value = response.data
      purchaseRecords.value = response.data.list
    } else {
      error.value = response.msg || 'Failed to fetch purchase records'
    }
  } catch (err) {
    error.value = 'Network error occurred'
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