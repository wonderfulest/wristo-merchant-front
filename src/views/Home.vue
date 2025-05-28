<template>
  <div class="layout">
    <!-- Header -->
    <header class="header">
      <div class="header-inner">
        <div class="logo">
          <span class="logo-icon">W</span>
          <span class="logo-text">pay</span>
        </div>
        <div class="header-right">
          <a href="/account">ACCOUNT</a>
          <a href="#">DOCUMENTATION</a>
          <a href="#">API</a>
          <a href="#" @click.prevent="handleLogout">LOG OUT</a>
        </div>
      </div>
      <div class="header-sub">
        <nav class="header-sub-nav">
          <router-link to="/" exact-active-class="active">Dashboard</router-link>
          <router-link to="/account/products" exact-active-class="active">Products</router-link>
          <router-link to="/account/history" exact-active-class="active">History</router-link>
          <router-link to="/account/discounts" exact-active-class="active">Discounts</router-link>
          <router-link to="/account/profile" exact-active-class="active">Profile</router-link>
        </nav>
      </div>
    </header>

    <!-- Main Content -->
    <main class="main-content">
      <router-view />
    </main>

    <!-- Footer -->
    <footer class="footer">
      <div class="footer-inner">
        <div class="footer-left">
          <span class="footer-icon">🐦</span>
          <span>© Wristo 2018</span>
        </div>
        <div class="footer-links">
          <a href="#">Terms of Use</a>
          <a href="#">Privacy Policy</a>
          <a href="mailto:support@wristo.io">support@wristo.io</a>
        </div>
        <div class="footer-right">
          <span>Wristo</span>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from '@/store/user'
import { useRouter } from 'vue-router'
const router = useRouter()
const userStore = useUserStore()
const handleLogout = async () => {
  await userStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f5f6f7;
}
.header {
  background: #f5f6f7;
  border-bottom: 1px solid #e5e5e5;
  display: flex;
  flex-direction: column;
  width: 100%;
  margin: 0 auto;
}
.header-inner {
  width: 80%;
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 84px;
  background: #f5f6f7;
}
.logo {
  display: flex;
  align-items: center;
  font-size: 24px;
  font-weight: bold;
}
.logo-icon {
  background: #1abc5b;
  color: #fff;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 6px;
  font-size: 22px;
}
.logo-text {
  color: #222;
  font-weight: 600;
}
.header-sub {
  width: 100%;
  margin: 0 auto;
  border-top: 1px solid #e5e5e5;
  display: flex;
  align-items: center;
  min-height: 64px;
}
.header-sub-nav {
  width: 60%;
  margin: 0 auto;
  display: flex;
  gap: 72px;
  padding: 12px 0;
  align-items: center;
}
.header-sub-nav a {
  color: #222;
  text-decoration: none;
  font-size: 15px;
  transition: color 0.2s;
}
.header-sub-nav .active {
  color: #1abc5b;
  border-bottom: 2px solid #1abc5b;
}
.header-right {
  display: flex;
  gap: 18px;
}
.header-right a {
  color: #888;
  font-size: 12px;
  text-decoration: none;
  transition: color 0.2s;
}
.header-right a:hover {
  color: #1abc5b;
}
.main-content {
  flex: 1;
  width: 100%;
  max-width: 1200px;
  margin: 32px auto 0 auto;
  background: transparent;
  min-height: 400px;
}
.footer {
  background: #fff;
  border-top: 1px solid #e5e5e5;
  padding: 16px 0;
}
.footer-inner {
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 32px;
  font-size: 13px;
  color: #888;
}
.footer-left {
  display: flex;
  align-items: center;
  gap: 8px;
}
.footer-icon {
  font-size: 16px;
}
.footer-links {
  display: flex;
  gap: 18px;
}
.footer-links a {
  color: #888;
  text-decoration: none;
  transition: color 0.2s;
}
.footer-links a:hover {
  color: #1abc5b;
}
.footer-right {
  font-weight: bold;
  color: #888;
}
</style>
