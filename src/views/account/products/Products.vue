<template>
  <div class="account-products-page">
    <el-drawer v-model="drawerVisible" direction="ltr" size="480px" :with-header="false">
      <ProductDrawer ref="addProductDrawerRef" :product="editProduct" @close="closeDrawer" />
    </el-drawer>
    <el-drawer v-model="bundleDrawerVisible" direction="ltr" size="480px" :with-header="false">
      <BundleDrawer ref="bundleDrawerRef" :bundle="editBundle" @close="closeBundleDrawer" />
    </el-drawer>
    <div class="products-header">
      <div class="products-header-left">
        <!-- <el-button type="success" class="add-new-btn" @click="() => openProductDrawer()">NEW PRODUCT<el-icon><i class="el-icon-arrow-down" /></el-icon></el-button> -->
        <el-button type="success" class="add-new-btn" @click="() => openBundleDrawer()">
          <el-icon><Plus /></el-icon>
          {{ t('products.newBundle') }}
        </el-button>
      </div>
      <!-- <div class="products-header-actions">
        <el-button type="success" plain>GENERATE SHOP</el-button>
        <el-button type="success" plain>UNLOCK APP</el-button>
      </div> -->
    </div>
    <div class="products-section">
      <div class="section-title-row">
        <div class="section-heading">
          <h2 class="section-title">{{ t('products.bundles') }}</h2>
          <div class="section-subtitle">{{ t('products.bundleListSubtitle') }}</div>
        </div>
        <el-checkbox v-model="showInactiveBundles" @change="handleShowInactiveBundlesChange">{{ t('products.showInactiveBundles') }}</el-checkbox>
      </div>
      <div class="bundle-list">
        <el-card class="bundle-card" v-for="item in bundles" :key="item.bundleId" shadow="never" @click="() => openBundleDrawer(item)">
          <div class="bundle-card-content">
            <div class="bundle-info">
              <div class="bundle-title-row">
                <div class="bundle-title">{{ item.bundleName }}</div>
                <el-tag
                  class="bundle-type-tag"
                  :type="bundleTypeTag(item.bundleType)"
                  effect="light"
                  round
                >
                  {{ bundleTypeLabel(item.bundleType) }}
                </el-tag>
              </div>
              <div class="bundle-desc">{{ item.bundleDesc || t('products.noBundleDesc') }}</div>
              <div class="bundle-footnote">
                <span>ID {{ item.bundleId }}</span>
                <span>{{ t('products.createdAt') }} {{ formatDate(item.createdAt) }}</span>
                <span v-if="item.parentBundleId">{{ t('products.parentBundle') }} #{{ item.parentBundleId }}</span>
              </div>
            </div>
            <div class="bundle-metrics">
              <div class="bundle-metric">
                <span class="metric-label">{{ t('products.bundleType') }}</span>
                <span class="metric-value">{{ bundleTypeLabel(item.bundleType) }}</span>
              </div>
              <div class="bundle-metric">
                <span class="metric-label">{{ t('products.bundleApps') }}</span>
                <span class="metric-value">{{ t('products.productCount', { count: item.products?.length || 0 }) }}</span>
              </div>
              <div class="bundle-metric">
                <span class="metric-label">{{ t('bundle.price') }}</span>
                <span class="metric-value">${{ formatPrice(item.price) }}</span>
              </div>
            </div>
            <div class="bundle-actions">
              <div class="bundle-status-switch" @click.stop>
                <el-switch
                  :model-value="item.isActive === 1"
                  :loading="updatingBundleIds.has(item.bundleId)"
                  inline-prompt
                  :active-text="t('products.active')"
                  :inactive-text="t('products.inactive')"
                  @change="(value: string | number | boolean) => handleBundleActiveChange(item, value)"
                />
              </div>
              <el-button class="view-content-btn" @click.stop="openBundleDrawer(item)">
                <el-icon><View /></el-icon>
                {{ t('products.viewContent') }}
              </el-button>
            </div>
          </div>
        </el-card>
      </div>
    </div>
    <div class="products-section">
      <div class="section-title-row">
        <div class="section-heading">
          <h2 class="section-title">{{ t('products.apps') }}</h2>
        </div>
      </div>
      <ProductTable @edit="openProductDrawer" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Plus, View } from '@element-plus/icons-vue'
import { getProduct, type Product } from '@/api/products'
import { fetchBundles, type Bundle, getBundle, updateBundleActive } from '@/api/bundles'
import { ElMessage } from 'element-plus'
import ProductDrawer from './ProductDrawer.vue'
import BundleDrawer from './BundleDrawer.vue'
import type { ApiResponse } from '@/types/api'
import ProductTable from './ProductTable.vue'
import { useI18n } from '@/i18n'

const bundles = ref<Bundle[]>([])
const { t } = useI18n()

const drawerVisible = ref(false)
const addProductDrawerRef = ref()
const editProduct = ref<Product | null>(null)

const bundleDrawerVisible = ref(false)
const bundleDrawerRef = ref()
const editBundle = ref<Bundle | null>(null)
const showInactiveBundles = ref(false)
const updatingBundleIds = ref(new Set<number>())

const bundleTypeLabel = (type?: string) => {
  if (type === 'account') return t('products.bundleTypeAccount')
  if (type === 'global') return t('products.bundleTypeGlobal')
  return t('products.bundleTypeCustom')
}

const bundleTypeTag = (type?: string) => {
  if (type === 'account') return 'warning'
  if (type === 'global') return 'danger'
  return 'info'
}

const formatPrice = (value?: number) => {
  if (value === undefined || value === null) return '0.00'
  return Number(value).toFixed(2)
}

const formatDate = (value?: string) => {
  if (!value) return '-'
  return value.substring(0, 10)
}

const setBundleUpdating = (bundleId: number, updating: boolean) => {
  const next = new Set(updatingBundleIds.value)
  if (updating) {
    next.add(bundleId)
  } else {
    next.delete(bundleId)
  }
  updatingBundleIds.value = next
}

const handleBundleActiveChange = async (bundle: Bundle, value: string | number | boolean) => {
  if (updatingBundleIds.value.has(bundle.bundleId)) return
  const isActive = value === true || value === 1 || value === '1'
  setBundleUpdating(bundle.bundleId, true)
  try {
    const res = await updateBundleActive(bundle.bundleId, isActive ? 1 : 0)
    if (res.code === 0) {
      bundle.isActive = isActive ? 1 : 0
      ElMessage.success(t('products.updateSuccess'))
    } else {
      ElMessage.error(res.msg || t('products.updateFailed'))
    }
  } catch (e) {
    ElMessage.error(t('products.updateFailed'))
  } finally {
    setBundleUpdating(bundle.bundleId, false)
    getBundles()
  }
}

const handleShowInactiveBundlesChange = () => {
  console.log('handleShowInactiveBundlesChange', showInactiveBundles.value)
  getBundles()
}

const openProductDrawer = async (product?: Product) => {
  drawerVisible.value = true
  if (product) {
    const res: ApiResponse<Product> = await getProduct(product.appId)
    if (res.code === 0 && res.data) {
      editProduct.value = res.data
      addProductDrawerRef.value?.setForm(res.data)
    } else {
      editProduct.value = product
      addProductDrawerRef.value?.setForm(product)
    }
  } else {
    editProduct.value = null
    addProductDrawerRef.value?.resetForm()
  }
}

const openBundleDrawer = async (bundle?: Bundle) => {
  bundleDrawerVisible.value = true
  if (bundle) {
    const res: ApiResponse<Bundle> = await getBundle(bundle.bundleId)
    if (res.code === 0 && res.data) {
      editBundle.value = res.data
      bundleDrawerRef.value?.setForm(res.data)
    } else {
      editBundle.value = bundle
      bundleDrawerRef.value?.setForm(bundle)
    }
  } else {
    editBundle.value = null
    bundleDrawerRef.value?.resetForm()
  }
}

const closeDrawer = () => { 
  drawerVisible.value = false
}

const getBundles = async () => {
  try {
    const res: ApiResponse<Bundle[]> = await fetchBundles(showInactiveBundles.value ? null : 1)
    if (res.code === 0 && res.data) {
      bundles.value = res.data
    } else {
      ElMessage.error(res.msg || t('products.fetchBundlesFailed'))
    }
  } catch (e) {
    ElMessage.error(t('products.fetchBundlesFailed'))
  }
}

const closeBundleDrawer = () => {
  bundleDrawerVisible.value = false
  getBundles()
}

onMounted(() => {
  getBundles()
})
</script>

<style scoped>
:deep(.el-card__body) {
  padding: 0 !important;
}
.account-products-page {
  min-height: 100%;
  background: transparent;
  padding: 8px 0 40px;
}
.drawer-content {
  padding: 32px 32px 0 32px;
}
.products-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  width: 90%;
  margin-left: auto;
  margin-right: auto;
}
.products-header-left {
  display: flex;
  gap: 24px;
}
.add-new-btn {
  min-width: 140px;
  min-height: 40px;
  border-color: var(--color-brand);
  background: var(--color-brand);
  font-weight: 700;
  letter-spacing: 0;
}
.products-header-actions {
  display: flex;
  gap: 24px;
}
.products-section {
  width: 90%;
  margin: 0 auto 28px auto;
}
.section-title-row {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 16px;
}
.section-heading {
  min-width: 0;
  text-align: left;
}
.section-title {
  display: block;
  margin: 0;
  color: var(--color-ink);
  font-size: 22px;
  font-weight: 800;
  line-height: 1.25;
  text-align: left;
}
.section-subtitle {
  margin-top: 6px;
  color: var(--color-muted);
  font-size: 14px;
  line-height: 1.45;
}
.bundle-list, .product-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.bundle-card, .product-card {
  border: 1px solid var(--color-line);
  border-radius: var(--radius-sm);
  box-shadow: var(--shadow-sm);
  transition: border-color 160ms ease, box-shadow 160ms ease, transform 160ms ease;
}
.bundle-card {
  cursor: pointer;
}
.bundle-card:hover {
  border-color: rgba(15, 107, 104, 0.28);
  box-shadow: var(--shadow-md);
  transform: translateY(-1px);
}
.bundle-card-content, .product-card-content {
  display: grid;
  grid-template-columns: minmax(260px, 1fr) minmax(320px, 0.9fr) auto;
  align-items: center;
  gap: 24px;
  min-height: 92px;
  padding: 16px 20px;
}
.bundle-img, .product-img {
  width: 56px;
  height: 56px;
  border-radius: 8px;
  object-fit: cover;
  background: var(--color-surface-soft);
}
.bundle-info, .product-info {
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
}
.bundle-title-row {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
}
.bundle-title, .product-title {
  min-width: 0;
  overflow: hidden;
  color: var(--color-ink);
  font-size: 17px;
  font-weight: 700;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: left;
}
.bundle-type-tag {
  flex: 0 0 auto;
  font-weight: 700;
}
.bundle-desc {
  display: -webkit-box;
  overflow: hidden;
  color: var(--color-muted);
  font-size: 13px;
  line-height: 1.45;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}
.bundle-footnote {
  display: flex;
  flex-wrap: wrap;
  gap: 6px 14px;
  color: var(--color-subtle);
  font-size: 12px;
}
.bundle-metrics {
  display: grid;
  grid-template-columns: repeat(3, minmax(90px, 1fr));
  gap: 10px;
}
.bundle-metric {
  min-height: 52px;
  padding: 10px 12px;
  border: 1px solid var(--color-line);
  border-radius: var(--radius-sm);
  background: var(--color-surface-soft);
}
.metric-label {
  display: block;
  margin-bottom: 4px;
  color: var(--color-muted);
  font-size: 12px;
}
.metric-value {
  display: block;
  overflow: hidden;
  color: var(--color-ink);
  font-size: 14px;
  font-weight: 700;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.bundle-actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 18px;
}
.bundle-status-switch {
  display: inline-flex;
  align-items: center;
  min-height: 36px;
}
.bundle-status-switch :deep(.el-switch) {
  --el-switch-on-color: var(--color-brand);
  --el-switch-off-color: var(--color-subtle);
}
.bundle-status-switch :deep(.el-switch__core) {
  min-width: 78px;
}
.view-content-btn, .download-btn {
  min-width: 132px;
  min-height: 36px;
  font-weight: 600;
}
.product-trial {
  color: var(--color-muted);
  font-size: 14px;
}
.product-trial-lasts {
  color: var(--color-muted);
  font-size: 12px;
}
.pagination-bar {
  margin: 24px 0 0 0;
  display: flex;
  justify-content: center;
}
@media (max-width: 1100px) {
  .bundle-card-content, .product-card-content {
    grid-template-columns: 1fr;
    align-items: stretch;
    gap: 14px;
  }

  .bundle-actions {
    justify-content: flex-start;
  }
}

@media (max-width: 640px) {
  .products-header,
  .products-section {
    width: calc(100% - 24px);
  }

  .section-title-row {
    align-items: flex-start;
    flex-direction: column;
  }

  .bundle-metrics {
    grid-template-columns: 1fr;
  }

  .bundle-actions {
    flex-wrap: wrap;
  }
}
</style> 
