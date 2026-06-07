<template>
  <div class="mch-products-table">
    <el-table :data="products" style="width: 100%" v-loading="loading">
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
      userId: userStore.userInfo?.id
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

onMounted(() => {
  loadProducts()
})
</script>

<style scoped>
.mch-products-table {
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
}

.pagination-bar {
  margin-top: 12px;
  display: flex;
  justify-content: flex-end;
}
</style>
