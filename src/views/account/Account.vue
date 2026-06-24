<template>
  <div class="account-layout">
    <div class="header-sub">
      <nav class="header-sub-nav">
        <router-link :to="localizedPath('/account/dashboard')" exact-active-class="active">{{ t('nav.dashboard') }}</router-link>
        <router-link :to="localizedPath('/account/products')" exact-active-class="active">{{ t('nav.products') }}</router-link>
        <router-link :to="localizedPath('/account/history')" exact-active-class="active">{{ t('nav.history') }}</router-link>
        <router-link :to="localizedPath('/account/discounts')" exact-active-class="active">{{ t('nav.discounts') }}</router-link>
        <router-link :to="localizedPath('/account/profile')" exact-active-class="active">{{ t('nav.profile') }}</router-link>
      </nav>
    </div>
    <!-- Main Content -->
    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from '@/i18n'
import { addLocaleToPath, useLocaleStore } from '@/store/locale'

const { t } = useI18n()
const localeStore = useLocaleStore()
const localizedPath = (path: string) => addLocaleToPath(path, localeStore.currentLocale)
</script>

<style lang="scss" scoped>
@use '@/assets/styles/variables.scss' as *;

.account-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: $color-bg;
}
.header {
  background: $color-bg;
  border-bottom: 1px solid $color-border;
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
  background: $color-bg;
}
.logo {
  display: flex;
  align-items: center;
  font-size: $font-size-lg;
  font-weight: bold;
}
.logo-icon {
  background: $color-success;
  color: $color-header-text;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 6px;
  font-size: $font-size-xl;
}
.logo-text {
  color: $color-link;
  font-weight: 600;
}
.header-right {
  display: flex;
  gap: 32px;
}
.header-right a {
  color: $color-info;
  font-size: $font-size-xs;
  text-decoration: none;
  transition: color 0.2s;
}
.header-right a:hover {
  color: $color-success;
}
.header-sub {
  width: 100%;
  background: $color-bg;
  display: flex;
  align-items: center;
  min-height: 56px;
  z-index: 10;
  overflow: hidden;
}
.header-sub-nav {
  width: 80%;
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  gap: 88px;
  padding: 0 0 0 8px;
  align-items: center;
}
.header-sub-nav a {
  color: $color-link;
  text-decoration: none;
  font-size: $font-size-md;
  font-weight: 500;
  padding: 8px 0 6px 0;
  border-bottom: 2.5px solid transparent;
  transition: color 0.18s, border-color 0.18s, background 0.18s;
  border-radius: 2px 2px 0 0;
  position: relative;
}
.header-sub-nav a:hover {
  color: $color-primary;
  background: rgba($color-primary, 0.07);
}
.header-sub-nav .active {
  color: $color-primary;
  border-bottom: 2.5px solid $color-primary;
  font-weight: 700;
}
.main-content {
  flex: 1;
  width: 100%;
  max-width: 1200px;
  margin: 32px auto 0 auto;
  background: transparent;
  min-height: 400px;
}

/* Mobile responsiveness for Account page */
@media (max-width: 768px) {
  .header-sub-nav {
    width: 100%;
    max-width: 100%;
    padding: 0 12px;
    gap: 8px;
    flex-wrap: nowrap;
    justify-content: flex-start;
    box-sizing: border-box;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
  }
  .header-sub-nav::-webkit-scrollbar {
    display: none;
  }
  .header-sub-nav a {
    flex: 0 0 auto;
    font-size: $font-size-sm;
    min-height: 38px;
    display: inline-flex;
    align-items: center;
    border: 1px solid transparent;
    border-radius: 999px;
    padding: 7px 12px;
  }
  .header-sub-nav .active {
    border: 1px solid rgba($color-primary, 0.18);
    border-bottom-color: rgba($color-primary, 0.18);
    background: rgba($color-primary, 0.08);
  }
  .main-content {
    max-width: 100%;
    margin: 12px auto 0 auto;
    padding: 0;
    box-sizing: border-box;
  }
}
</style>
