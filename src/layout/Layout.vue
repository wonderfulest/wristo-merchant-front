<template>
  <div class="global-layout">
    <!-- Header -->
    <header class="header">
      <div class="header-inner">
        <div class="logo">
          <img class="logo-image" src="https://cdn.wristo.io/brands/wristo-logo/svg/wristo-logo-horizontal.svg" alt="Wristo" />
        </div>
        <div class="header-right">
          <router-link :to="localizedPath('/account')">{{ t('nav.account') }}</router-link>
          <a href="#" class="hide-on-mobile">{{ t('nav.documentation') }}</a>
          <router-link :to="localizedPath('/api')" v-if="hasMerchantRole" class="hide-on-mobile">{{ t('nav.api') }}</router-link>
          <select
            class="language-select"
            :aria-label="t('language.selector')"
            :value="localeStore.currentLocale"
            @change="handleLocaleChange"
          >
            <option v-for="locale in locales" :key="locale" :value="locale">
              {{ t(`language.${locale}`) }}
            </option>
          </select>
        </div>
        <div class="user-profile-dropdown">
          <div class="user-avatar-container" @click="toggleDropdown">
            <img :src="userAvatar" class="user-avatar" alt="user avatar" />
            <span class="user-profile-name">{{ displayName }}</span>
          </div>
          <div class="dropdown-content" v-if="isDropdownOpen">
            <router-link :to="localizedPath('/account/profile')">{{ t('user.editProfile') }}</router-link>
            <router-link :to="localizedPath('/account/password')">{{ t('user.changePassword') }}</router-link>
            <a href="#" @click.prevent="handleLogout">{{ t('user.logout') }}</a>
          </div>
        </div>
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
          <img class="footer-mark" src="https://cdn.wristo.io/brands/wristo-logo/svg/wristo-mark.svg" alt="" aria-hidden="true" />
          <span> Wristo 2025</span>
        </div>
        <div class="footer-links">
          <a href="#">{{ t('footer.terms') }}</a>
          <a href="#">{{ t('footer.privacy') }}</a>
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
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from '@/i18n'
import { addLocaleToPath, SUPPORTED_LOCALES, stripLocaleFromPath, useLocaleStore, type SupportedLocale } from '@/store/locale'
import { redirectToSsoLogin } from '@/utils/ssoRedirect'

const userStore = useUserStore()
const route = useRoute()
const router = useRouter()
const localeStore = useLocaleStore()
const { t } = useI18n()
const locales = SUPPORTED_LOCALES
const defaultAvatar = 'https://cdn.wristo.io/test/avatar/561aae25-41bd-47ab-974e-7231f5a850e8.png'
const userAvatar = computed(() => userStore.userInfo?.avatar || defaultAvatar)
const displayName = computed(() => userStore.userInfo?.nickname || userStore.userInfo?.username || 'Wristo')
const handleLogout = async () => {
  await userStore.logout()
  redirectToSsoLogin('merchant')
}
const hasMerchantRole = computed(() => {
  const roles: any[] = (userStore.userInfo && Array.isArray((userStore.userInfo as any).roles)) ? (userStore.userInfo as any).roles : []
  console.log(111, roles, userStore.userInfo)
  return roles.some((role: any) => role.roleCode === 'ROLE_MERCHANT')
})

// 下拉菜单控制
const isDropdownOpen = ref(false)
const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value
}

const localizedPath = (path: string) => addLocaleToPath(path, localeStore.currentLocale)

const handleLocaleChange = (event: Event) => {
  const select = event.target as HTMLSelectElement
  const nextLocale = select.value as SupportedLocale
  localeStore.setLocale(nextLocale)
  router.push(addLocaleToPath(stripLocaleFromPath(route.fullPath), nextLocale))
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/variables.scss';

/* Global clamps to prevent horizontal overflow */
:global(html, body, #app) {
  width: 100%;
  max-width: 100%;
  overflow-x: hidden;
}
:global(*), :global(*::before), :global(*::after) {
  box-sizing: border-box;
}
:global(img), :global(video) {
  max-width: 100%;
  height: auto;
  display: block;
}
:global(.break-anywhere) {
  overflow-wrap: anywhere;
  word-break: break-word;
}

.global-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: $color-bg;
  width: 100%;
  overflow-x: hidden;
  max-width: 100vw;
}
.header {
  background: $color-bg;
  color: $color-link;
  padding: 0;
}
.header-inner {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 80px;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 32px;
}
.logo {
  display: flex;
  align-items: center;
  flex: 0 0 auto;
}
.logo-image {
  display: block;
  width: 132px;
  height: auto;
}
.header-right {
  display: flex;
  gap: 24px;
  align-items: center;
}
.language-select {
  border: 1px solid rgba(25, 179, 107, 0.28);
  border-radius: 8px;
  background: #fff;
  color: $color-link;
  font-size: 0.95rem;
  padding: 7px 28px 7px 10px;
}
.header-right a, .header-right :deep(a.router-link-active), .header-right :deep(a.router-link-exact-active) {
  color: $color-link;
  font-weight: 500;
  text-decoration: none;
  font-size: 1.1rem;
  transition: color 0.2s;
}
.header-right a:hover, .header-right :deep(a):hover {
  color: $color-success;
}
.main-content {
  flex: 1;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  padding: 16px 12px 0;
  min-height: 0; /* allow flex item to shrink to avoid pushing footer */
}
.footer {
  background: $color-footer-bg;
  padding: 8px 0;
  width: 100%;
  position: static; /* rely on flexbox to pin to bottom */
  margin-top: auto;
  padding-bottom: max(8px, env(safe-area-inset-bottom));
  font-size: $font-size-xs;
}
.footer-inner {
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 32px;
  font-size: $font-size-sm;
  color: $color-footer-text;
}
.footer-left {
  display: flex;
  align-items: center;
  gap: 8px;
}
.footer-mark {
  width: 18px;
  height: 18px;
}
.footer-links {
  display: flex;
  gap: 18px;
}
.footer-links a {
  color: $color-footer-text;
  text-decoration: none;
  transition: color 0.2s;
}
.footer-links a:hover {
  color: $color-success;
}
.footer-right {
  font-weight: bold;
  color: $color-footer-text;
}
.dropdown-content {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0,0,0,0.12);
  border-radius: 8px;
  padding: 10px 0;
  position: absolute;
  right: 0;
  top: 60px;
  min-width: 160px;
  z-index: 100;
}
.dropdown-content a {
  width: 100%;
  padding: 10px 24px;
  color: #222;
  text-decoration: none;
  font-size: 1rem;
  transition: background 0.2s, color 0.2s;
  box-sizing: border-box;
  display: block;
}
.dropdown-content a:hover {
  background: #f5f5f5;
  color: #19b36b;
}
.user-profile-dropdown {
  position: relative;
}
.user-avatar-container {
  display: flex;
  align-items: center;
  gap: 10px;
  min-height: 42px;
  padding: 4px 10px 4px 4px;
  border-radius: 999px;
  cursor: pointer;
  transition: background 0.2s ease, box-shadow 0.2s ease;
}
.user-avatar-container:hover {
  background: #fff;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
}
.user-avatar {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #fff;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.12);
}
.user-profile-name {
  max-width: 140px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: $color-link;
  font-size: 0.95rem;
  font-weight: 600;
}

/* Mobile responsiveness */
.hide-on-mobile {
  display: inline;
}

@media (max-width: 768px) {
  .header-inner {
    height: 56px;
    padding: 0 16px;
  }
  .logo {
    width: 104px;
  }
  .logo-image {
    width: 104px;
  }
  .header-right {
    gap: 12px;
  }
  .user-profile-name {
    display: none;
  }
  .header-right a, .header-right :deep(a) {
    font-size: 0.95rem;
  }
  .hide-on-mobile {
    display: none;
  }
  .footer-inner {
    padding: 0 16px;
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  .global-layout {
    overflow-x: hidden;
    max-width: 100vw;
  }
  .footer {
    position: static; /* prevent jumping on mobile */
    padding-bottom: max(8px, env(safe-area-inset-bottom));
  }
}
</style>
