<template>
  <div class="mch-products-table">
    <div class="product-table-toolbar">
      <el-input
        v-model="searchKeyword"
        class="product-search-input"
        :placeholder="t('products.searchPlaceholder')"
        clearable
        @keyup.enter="handleSearch"
        @clear="handleSearch"
      />
      <el-button type="primary" @click="handleSearch">{{ t('common.search') }}</el-button>
    </div>
    <el-table class="desktop-product-table" :data="products" style="width: 100%" v-loading="loading">
      <el-table-column prop="appId" label="ID" width="80" />
      <el-table-column :label="t('products.productInfo')" min-width="280">
        <template #default="{ row }">
          <AppProductInfo :product="row" :thumb-size="56" />
        </template>
      </el-table-column>
      <el-table-column :label="t('products.category')" min-width="200">
        <template #default="{ row }">
          <span style="display: flex; flex-wrap: wrap; align-items: center; gap: 4px;">
            <el-tag
              v-for="cat in row.categories || []"
              :key="cat.id"
              style="margin-right: 2px; margin-bottom: 2px;"
            >
              {{ cat.name }}
            </el-tag>
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="download" :label="t('products.downloads')" width="90">
        <template #default="{ row }">
          {{ row.download ?? '-' }}
        </template>
      </el-table-column>
      <el-table-column prop="purchase" :label="t('products.purchases')" width="90">
        <template #default="{ row }">
          {{ row.purchase ?? '-' }}
        </template>
      </el-table-column>
      <el-table-column prop="price" :label="t('history.price')" width="80">
        <template #default="{ row }">
          ${{ row.price }}
        </template>
      </el-table-column>
      <el-table-column prop="trialLasts" :label="t('products.trialLasts')" width="100">
        <template #default="{ row }">
          {{ row.trialLasts }} {{ t('products.hours') }}
        </template>
      </el-table-column>
      <el-table-column prop="createdAt" :label="t('products.createdAt')" width="140">
        <template #default="{ row }">
          {{ formatDate(row.createdAt) }}
        </template>
      </el-table-column>
      <el-table-column :label="t('products.operation')" width="120" fixed="right">
        <template #default="{ row }">
          <el-button type="primary" link @click="emit('edit', row)">{{ t('products.edit') }}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="mobile-product-list" v-loading="loading">
      <button
        v-for="product in products"
        :key="product.appId"
        type="button"
        class="mobile-product-card"
        @click="emit('edit', product)"
      >
        <div class="mobile-product-main">
          <AppProductInfo :product="product" :thumb-size="50" />
          <span class="mobile-edit-link">{{ t('products.edit') }}</span>
        </div>
        <div class="mobile-product-meta">
          <span>ID {{ product.appId }}</span>
          <span>${{ product.price }}</span>
          <span>{{ formatDate(product.createdAt) || '-' }}</span>
        </div>
        <div class="mobile-product-stats">
          <span>{{ t('products.downloads') }}: {{ product.download ?? '-' }}</span>
          <span>{{ t('products.purchases') }}: {{ product.purchase ?? '-' }}</span>
          <span>{{ t('products.trialLasts') }}: {{ product.trialLasts }} {{ t('products.hours') }}</span>
        </div>
        <div v-if="product.categories?.length" class="mobile-product-tags">
          <el-tag v-for="cat in product.categories" :key="cat.id" size="small">
            {{ cat.name }}
          </el-tag>
        </div>
      </button>
      <div v-if="!loading && products.length === 0" class="mobile-empty">
        {{ t('common.noData') }}
      </div>
    </div>
    <div class="pagination-bar">
      <el-pagination
        v-model:current-page="pageNum"
        v-model:page-size="pageSize"
        :total="total"
        :page-sizes="pageSizes"
        layout="total, sizes, prev, pager, next"
        @size-change="handleSizeChange"
        @current-change="handlePageChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import AppProductInfo from '@/components/common/AppProductInfo.vue'
import { fetchProductPage, type Product, type ProductPageData, type ProductPageQuery } from '@/api/products'
import { useUserStore } from '@/store/user'
import { useI18n } from '@/i18n'

const products = ref<Product[]>([])
const loading = ref(false)
const pageNum = ref(1)
const pageSize = ref(10)
const total = ref(0)
const searchKeyword = ref('')
const pageSizes = [10, 20, 50, 100]
const userStore = useUserStore()
const { t } = useI18n()

const emit = defineEmits<{
  (e: 'edit', product: Product): void
}>()

const formatDate = (value?: string) => {
  if (!value) return ''
  // 后端通常返回 ISO 字符串，简单截取日期部分即可
  return value.substring(0, 10)
}

const loadProducts = async () => {
  loading.value = true
  try {
    const params: ProductPageQuery = {
      pageNum: pageNum.value,
      pageSize: pageSize.value,
      orderBy: 'created_at:desc',
      userId: userStore.userInfo?.id,
      name: searchKeyword.value.trim() || undefined
    }
    const res = await fetchProductPage(params)
    if (res.code === 0 && res.data) {
      const data = res.data as ProductPageData
      products.value = data.list
      total.value = data.total
    } else {
      ElMessage.error(res.msg || t('products.fetchProductsFailed'))
    }
  } catch (e) {
    ElMessage.error(t('products.fetchProductsFailed'))
  } finally {
    loading.value = false
  }
}

const handlePageChange = (val: number) => {
  pageNum.value = val
  loadProducts()
}

const handleSizeChange = (val: number) => {
  pageSize.value = val
  pageNum.value = 1
  loadProducts()
}

const handleSearch = () => {
  pageNum.value = 1
  loadProducts()
}

onMounted(() => {
  loadProducts()
})
</script>

<style scoped>
.mch-products-table {
  background: var(--color-surface);
  border: 1px solid var(--color-line);
  border-radius: var(--radius-sm);
  box-shadow: var(--shadow-sm);
  padding: 12px;
}

.product-table-toolbar {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-bottom: 12px;
}

.product-search-input {
  width: 280px;
}

.pagination-bar {
  margin-top: 12px;
  display: flex;
  justify-content: flex-end;
}

.mobile-product-list {
  display: none;
}

@media (max-width: 640px) {
  .mch-products-table {
    padding: 8px;
  }

  .product-table-toolbar {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    align-items: center;
    gap: 8px;
    margin-bottom: 10px;
  }

  .product-search-input {
    width: 100%;
  }

  .product-table-toolbar :deep(.el-button) {
    min-width: 78px;
    padding: 8px 12px;
  }

  .desktop-product-table {
    display: none;
  }

  .mobile-product-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .mobile-product-card {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 8px;
    border: 1px solid var(--color-line);
    border-radius: var(--radius-sm);
    background: var(--color-surface);
    padding: 10px;
    color: var(--color-ink);
    font: inherit;
    text-align: left;
    cursor: pointer;
  }

  .mobile-product-main {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    gap: 8px;
    align-items: center;
  }

  .mobile-edit-link {
    color: var(--color-brand);
    font-size: 13px;
    font-weight: 800;
  }

  .mobile-product-meta,
  .mobile-product-stats {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 6px;
    color: var(--color-muted);
    font-size: 12px;
    line-height: 1.4;
  }

  .mobile-product-meta span,
  .mobile-product-stats span {
    min-width: 0;
    padding: 5px 7px;
    border-radius: 7px;
    background: var(--color-surface-soft);
    overflow-wrap: anywhere;
  }

  .mobile-product-stats {
    padding-top: 0;
    border-top: 0;
  }

  .mobile-product-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }

  .mobile-empty {
    padding: 24px 12px;
    border: 1px dashed var(--color-line);
    border-radius: var(--radius-sm);
    color: var(--color-muted);
    text-align: center;
  }

  .pagination-bar {
    justify-content: center;
  }
}

@media (max-width: 380px) {
  .product-table-toolbar {
    grid-template-columns: 1fr;
  }

  .mobile-product-meta,
  .mobile-product-stats {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>
