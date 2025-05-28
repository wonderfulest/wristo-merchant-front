<template>
  <div class="account-products-page">
    <el-drawer v-model="drawerVisible" direction="ltr" size="480px" :with-header="false">
      <ProductDrawer ref="addProductDrawerRef" :product="editProduct" @close="closeDrawer" />
    </el-drawer>
    <div class="products-header">
      <el-button type="success" class="add-new-btn" @click="() => openDrawer()">ADD NEW <el-icon><i class="el-icon-arrow-down" /></el-icon></el-button>
      <div class="products-header-actions">
        <el-button type="success" plain>GENERATE SHOP</el-button>
        <el-button type="success" plain>UNLOCK APP</el-button>
      </div>
    </div>
    <div class="products-section">
      <div class="section-title-row">
        <span class="section-title">BUNDLES</span>
        <el-checkbox>SHOW INACTIVE BUNDLES</el-checkbox>
      </div>
      <div class="bundle-list">
        <el-card class="bundle-card" v-for="item in bundles" :key="item.id" shadow="hover">
          <div class="bundle-card-content">
            <img :src="item.img" class="bundle-img" />
            <div class="bundle-info">
              <div class="bundle-title">{{ item.name }}</div>
              <el-button type="success" size="small" class="status-btn">ACTIVE <el-icon><i class="el-icon-arrow-down" /></el-icon></el-button>
            </div>
            <div class="bundle-meta">{{ item.products }} products</div>
            <div class="bundle-price">${{ item.price }}</div>
            <el-button class="view-content-btn">VIEW CONTENT <el-icon><i class="el-icon-arrow-down" /></el-icon></el-button>
          </div>
        </el-card>
      </div>
    </div>
    <div class="products-section">
      <div class="section-title-row">
        <span class="section-title">APPS/WATCH-FACES</span>
      </div>
      <div class="product-list">
        <el-card class="product-card" v-for="item in products" :key="item.id" shadow="hover" @click="() => openDrawer(item)">
          <div class="product-card-content">
            <img :src="item.garminImageUrl" class="product-img" />
            <div class="product-info">
              <div class="product-title">{{ item.name }}</div>
              <div class="product-trial">{{ item.description }}</div>
            </div>
            <div class="product-price">${{ item.price }}</div>
            <el-button class="download-btn">DOWNLOAD LIB <el-icon><i class="el-icon-arrow-down" /></el-icon></el-button>
          </div>
        </el-card>
      </div>
      <div class="pagination-bar">
        <el-pagination
          background
          layout="sizes, prev, pager, next"
          :total="total"
          :page-size="pageSize"
          :current-page="pageNum"
          :page-sizes="pageSizes"
          @current-change="handlePageChange"
          @size-change="handleSizeChange"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { fetchProductPage, type Product } from '@/api/products'
import { ElMessage } from 'element-plus'
import ProductDrawer from './ProductDrawer.vue'

const bundles = [
  { id: 1, name: 'Whole Neon', img: '', products: 41, price: '9.90' },
]

const products = ref<Product[]>([])
const pageNum = ref(1)
const pageSize = ref(10)
const total = ref(0)
const pageSizes = [10, 20, 50]

const drawerVisible = ref(false)
const addProductDrawerRef = ref()
const editProduct = ref<Product | null>(null)

const openDrawer = (product?: Product) => {
  drawerVisible.value = true
  if (product) {
    editProduct.value = product
    addProductDrawerRef.value?.setForm(product)
  } else {
    editProduct.value = null
    addProductDrawerRef.value?.resetForm()
  }
}

const closeDrawer = () => { 
  drawerVisible.value = false
  getProducts()
}

const getProducts = async () => {
  try {
    const res = await fetchProductPage({ pageNum: pageNum.value, pageSize: pageSize.value, orderBy: 'created_at:desc' })
    if (res.code === 0 && res.data) {
      products.value = res.data.list
      total.value = res.data.total
    } else {
      ElMessage.error(res.msg || '获取产品失败')
    }
  } catch (e) {
    ElMessage.error('获取产品失败')
  }
}

onMounted(getProducts)

const handlePageChange = (val: number) => {
  pageNum.value = val
  getProducts()
}

const handleSizeChange = (val: number) => {
  pageSize.value = val
  pageNum.value = 1
  getProducts()
}
</script>

<style scoped>
:deep(.el-card__body) {
  padding: 12px 20px !important;
}
.account-products-page {
  padding: 32px 0;
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
}
.status-btn {
  width: 90px;
  font-size: 13px;
  font-weight: 500;
  margin-top: 4px;
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
.pagination-bar {
  margin: 24px 0 0 0;
  display: flex;
  justify-content: center;
}
</style> 