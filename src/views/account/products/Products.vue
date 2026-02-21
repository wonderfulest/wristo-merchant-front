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
        <el-button style="background: #19b36b; border-color: #19b36b;" type="success" class="add-new-btn" @click="() => openBundleDrawer()">NEW BUNDLE<el-icon><i class="el-icon-arrow-down" /></el-icon></el-button>
      </div>
      <!-- <div class="products-header-actions">
        <el-button type="success" plain>GENERATE SHOP</el-button>
        <el-button type="success" plain>UNLOCK APP</el-button>
      </div> -->
    </div>
    <div class="products-section">
      <div class="section-title-row">
        <span class="section-title">BUNDLES</span>
        <el-checkbox v-model="showInactiveBundles" @change="handleShowInactiveBundlesChange">SHOW INACTIVE BUNDLES</el-checkbox>
      </div>
      <div class="bundle-list">
        <el-card class="bundle-card" v-for="item in bundles" :key="item.bundleId" shadow="hover" @click="() => openBundleDrawer(item)">
          <div class="bundle-card-content">
            <div class="bundle-info">
              <div class="bundle-title">{{ item.bundleName }}</div>
              <el-button
                size="small"
                :class="item.isActive === 1 ? 'active-btn' : 'inactive-btn'"
                plain
                @click.stop="toggleBundleActive(item)"
                style="width: 72px; min-width: 72px; text-align: center;"
              >{{ item.isActive === 1 ? 'ACTIVE' : 'INACTIVE' }}</el-button>
            </div>
            <div class="bundle-meta">{{ item.products.length }} products</div>
            <el-button class="view-content-btn">VIEW CONTENT <el-icon><i class="el-icon-arrow-down" /></el-icon></el-button>
          </div>
        </el-card>
      </div>
    </div>
    <div class="products-section">
      <div class="section-title-row">
        <span class="section-title">APPS/WATCH-FACES</span>
      </div>
      <ProductTable @edit="openProductDrawer" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getProduct, type Product } from '@/api/products'
import { fetchBundles, type Bundle, getBundle, updateBundleActive } from '@/api/bundles'
import { ElMessage } from 'element-plus'
import ProductDrawer from './ProductDrawer.vue'
import BundleDrawer from './BundleDrawer.vue'
import type { ApiResponse } from '@/types/api'
import ProductTable from './ProductTable.vue'

const bundles = ref<Bundle[]>([])

const drawerVisible = ref(false)
const addProductDrawerRef = ref()
const editProduct = ref<Product | null>(null)

const bundleDrawerVisible = ref(false)
const bundleDrawerRef = ref()
const editBundle = ref<Bundle | null>(null)
const showInactiveBundles = ref(false)

const toggleBundleActive = async (bundle: Bundle) => {
  const res = await updateBundleActive(bundle.bundleId, bundle.isActive === 1 ? 0 : 1)
  if (res.code === 0) {
    ElMessage.success('更新成功')
  } else {
    ElMessage.error(res.msg || '更新失败')
  }
  getBundles()
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
      ElMessage.error(res.msg || '获取套餐失败')
    }
  } catch (e) {
    ElMessage.error('获取套餐失败')
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
  padding: 12px 20px !important;
}
.account-products-page {
  background: #f5f6f7;
}
.drawer-content {
  padding: 32px 32px 0 32px;
}
.products-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
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
  font-weight: bold;
}
.products-header-actions {
  display: flex;
  gap: 24px;
}
.products-section {
  width: 90%;
  margin: 0 auto 32px auto;
}
.section-title-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}
.section-title {
  font-size: 15px;
  font-weight: bold;
  color: #888;
  letter-spacing: 1px;
}
.bundle-list, .product-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.bundle-card, .product-card {
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  border: none;
}
.bundle-card-content, .product-card-content {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 0px 24px;
}
.bundle-img, .product-img {
  width: 56px;
  height: 56px;
  border-radius: 8px;
  object-fit: cover;
  background: #eee;
}
.bundle-info, .product-info {
  flex: 1 1 180px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.bundle-title, .product-title {
  font-size: 18px;
  font-weight: 600;
  color: #222;
  text-align: left;
}
.bundle-desc {
  color: #888;
  font-size: 14px;
}
.bundle-meta {
  flex: 1 1 120px;
  color: #888;
  font-size: 15px;
  text-align: right;
}
.bundle-price, .product-price {
  flex: 1 1 80px;
  color: #222;
  font-size: 16px;
  font-weight: 600;
  text-align: right;
}
.view-content-btn, .download-btn {
  min-width: 150px;
  font-weight: 500;
  margin-left: 16px;
}
.product-trial {
  color: #888;
  font-size: 14px;
}
.product-trial-lasts {
  color: #888;
  font-size: 12px;
}
.pagination-bar {
  margin: 24px 0 0 0;
  display: flex;
  justify-content: center;
}
.active-btn {
  background: #19b36b !important;
  border-color: #19b36b !important;
  color: #fff !important;
  font-size: 13px;
  font-weight: 600;
}
.inactive-btn {
  background: #e0e0e0 !important;
  border-color: #e0e0e0 !important;
  color: #888 !important;
  font-size: 13px;
  font-weight: 600;
}
</style> 