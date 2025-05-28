<template>
  <div class="account-products-page">
    <div class="products-header">
      <el-button type="success" class="add-new-btn">ADD NEW <el-icon><i class="el-icon-arrow-down" /></el-icon></el-button>
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
        <el-card class="product-card" v-for="item in products" :key="item.id" shadow="hover">
          <div class="product-card-content">
            <img :src="item.img" class="product-img" />
            <div class="product-info">
              <div class="product-title">{{ item.name }}</div>
              <div class="product-trial">{{ item.trial }}</div>
            </div>
            <div class="product-price">${{ item.price }}</div>
            <el-button class="download-btn">DOWNLOAD LIB <el-icon><i class="el-icon-arrow-down" /></el-icon></el-button>
          </div>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const bundles = [
  { id: 1, name: 'Whole Neon', img: 'https://via.placeholder.com/56', products: 41, price: '9.90' },
  { id: 2, name: 'Whole Shop', img: 'https://via.placeholder.com/56', products: 510, price: '9.90' },
  { id: 3, name: 'Whole Store', img: 'https://via.placeholder.com/56', products: 631, price: '9.90' },
  { id: 4, name: 'Whole Store', img: 'https://via.placeholder.com/56', products: 506, price: '9.90' },
  { id: 5, name: 'Whole Venu', img: 'https://via.placeholder.com/56', products: 480, price: '9.90' },
]
const products = [
  { id: 1, name: 'Arcane Glow', img: 'https://via.placeholder.com/56', trial: 'No Trial', price: '1.99' },
  { id: 2, name: 'Another App', img: 'https://via.placeholder.com/56', trial: 'Trial', price: '2.99' },
]
</script>

<style scoped>
.account-products-page {
  padding: 32px 0;
  background: #f5f6f7;
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
  gap: 18px;
}
.bundle-card, .product-card {
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  border: none;
}
.bundle-card-content, .product-card-content {
  display: flex;
  align-items: center;
  gap: 18px;
  padding: 18px 24px;
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
</style> 