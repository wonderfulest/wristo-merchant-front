<template>
  <div class="global-layout">
    <!-- Header -->
    <header class="header-bar">
      <div class="header-inner">
        <div class="logo">
          <router-link :to="localizedPath('/account')" class="logo-link" aria-label="Wristo merchant home">
            <img class="logo-image" src="https://cdn.wristo.io/brands/wristo-logo/svg/wristo-logo-horizontal.svg" alt="Wristo" />
          </router-link>
        </div>
        <nav class="nav-area desktop-nav" aria-label="Primary navigation">
          <router-link :to="localizedPath('/account')" class="nav-link">{{ t('nav.account') }}</router-link>
          <a href="#" class="nav-link">{{ t('nav.documentation') }}</a>
          <router-link v-if="hasMerchantRole" :to="localizedPath('/api')" class="nav-link">{{ t('nav.api') }}</router-link>
          <LanguageSwitcher />
        </nav>
        <el-dropdown @command="handleUserMenuCommand" trigger="click" popper-class="user-menu-popper">
          <button type="button" class="user-avatar-container" :aria-label="t('nav.account')">
            <img :src="userAvatar" class="user-avatar" alt="user avatar" />
            <span class="user-trigger-copy">
              <span>{{ displayName }}</span>
              <small>{{ accountStatus }}</small>
            </span>
            <el-icon class="user-trigger-arrow"><ArrowDown /></el-icon>
          </button>
          <template #dropdown>
            <el-dropdown-menu class="user-dropdown-menu">
              <div class="user-dropdown-profile">
                <img :src="userAvatar" class="user-dropdown-avatar" alt="user avatar" />
                <div class="user-dropdown-identity">
                  <strong>{{ displayName }}</strong>
                  <span>{{ userEmail }}</span>
                </div>
                <span class="user-dropdown-status">{{ accountStatus }}</span>
              </div>
              <div class="user-dropdown-section">
                <span class="user-dropdown-section-title">{{ t('nav.account') }}</span>
                <el-dropdown-item command="profile" class="user-dropdown-item">
                  <span class="user-dropdown-icon">
                    <el-icon><User /></el-icon>
                  </span>
                  <span class="user-dropdown-copy">
                    <strong>{{ t('user.editProfile') }}</strong>
                    <small>{{ t('profile.email') }} · {{ userEmail }}</small>
                  </span>
                  <el-icon class="user-dropdown-arrow"><ArrowRight /></el-icon>
                </el-dropdown-item>
                <el-dropdown-item command="password" class="user-dropdown-item">
                  <span class="user-dropdown-icon">
                    <el-icon><Lock /></el-icon>
                  </span>
                  <span class="user-dropdown-copy">
                    <strong>{{ t('user.changePassword') }}</strong>
                    <small>{{ t('profile.username') }} · {{ displayName }}</small>
                  </span>
                  <el-icon class="user-dropdown-arrow"><ArrowRight /></el-icon>
                </el-dropdown-item>
              </div>
              <el-dropdown-item divided command="logout" class="user-dropdown-item user-dropdown-logout">
                <span class="user-dropdown-icon danger">
                  <el-icon><SwitchButton /></el-icon>
                </span>
                <span class="user-dropdown-copy">
                  <strong>{{ t('user.logout') }}</strong>
                  <small>{{ t('nav.account') }}</small>
                </span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </header>
    <!-- Main Content -->
    <main class="main-content">
      <nav class="mobile-primary-nav" aria-label="Primary navigation">
        <router-link :to="localizedPath('/account')" class="mobile-nav-link">{{ t('nav.account') }}</router-link>
        <a href="#" class="mobile-nav-link">{{ t('nav.documentation') }}</a>
        <router-link v-if="hasMerchantRole" :to="localizedPath('/api')" class="mobile-nav-link">{{ t('nav.api') }}</router-link>
      </nav>
      <router-view />
    </main>
    <!-- Footer -->
    <footer class="footer">
      <div class="footer-main desktop-layout">
        <div class="footer-brand">
          <img class="footer-mark" src="https://cdn.wristo.io/brands/wristo-logo/svg/wristo-mark.svg" alt="" aria-hidden="true" />
          <span>© Wristo 2026</span>
        </div>
        <nav class="footer-nav" aria-label="Footer links">
          <a href="#">{{ t('footer.terms') }}</a>
          <a href="#">{{ t('footer.privacy') }}</a>
          <a href="mailto:support@wristo.io">support@wristo.io</a>
        </nav>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from '@/store/user'
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from '@/i18n'
import { addLocaleToPath, useLocaleStore } from '@/store/locale'
import { redirectToSsoLogin } from '@/utils/ssoRedirect'
import { ArrowDown, ArrowRight, Lock, SwitchButton, User } from '@element-plus/icons-vue'
import LanguageSwitcher from '@/components/LanguageSwitcher.vue'

const userStore = useUserStore()
const router = useRouter()
const localeStore = useLocaleStore()
const { t } = useI18n()
const defaultAvatar = 'https://cdn.wristo.io/test/avatar/561aae25-41bd-47ab-974e-7231f5a850e8.png'
const userAvatar = computed(() => userStore.userInfo?.avatar || defaultAvatar)
const displayName = computed(() => userStore.userInfo?.nickname || userStore.userInfo?.username || 'Wristo')
const userEmail = computed(() => userStore.userInfo?.email || 'merchant@wristo.io')
const accountStatus = computed(() => hasMerchantRole.value ? 'Merchant' : 'Account')
const handleLogout = async () => {
  await userStore.logout()
  redirectToSsoLogin('merchant')
}
const hasMerchantRole = computed(() => {
  const roles: any[] = (userStore.userInfo && Array.isArray((userStore.userInfo as any).roles)) ? (userStore.userInfo as any).roles : []
  return roles.some((role: any) => role.roleCode === 'ROLE_MERCHANT')
})

const handleUserMenuCommand = async (command: string) => {
  if (command === 'profile') {
    router.push(localizedPath('/account/profile'))
    return
  }
  if (command === 'password') {
    router.push(localizedPath('/account/password'))
    return
  }
  if (command === 'logout') {
    await handleLogout()
  }
}

const localizedPath = (path: string) => addLocaleToPath(path, localeStore.currentLocale)
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
  background: transparent;
  width: 100%;
  overflow-x: hidden;
  max-width: 100vw;
}
.header-bar {
  width: 100%;
  background: rgba(255, 255, 255, 0.88);
  border-bottom: 1px solid $color-line;
  box-shadow: 0 10px 35px rgba(17, 24, 39, 0.05);
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
  position: sticky;
  top: 0;
  z-index: 20;
}
.header-inner {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  height: 72px;
  padding: 0 24px;
}
.logo {
  display: flex;
  align-items: center;
  flex: 0 0 auto;
}
.logo-link {
  display: inline-flex;
  align-items: center;
  width: 132px;
  height: 40px;
  text-decoration: none;
}
.logo-image {
  display: block;
  width: 100%;
  height: auto;
}
.nav-area {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-width: 0;
  flex: 1 1 auto;
}
.nav-link {
  color: $color-muted;
  font-size: 0.95rem;
  font-weight: 650;
  text-decoration: none;
  padding: 10px 12px;
  border-radius: 999px;
  white-space: nowrap;
  transition: color 0.18s ease, background 0.18s ease;
}
.nav-link:hover,
.nav-link.router-link-active,
.nav-link.router-link-exact-active {
  color: $color-brand-strong;
  background: $color-brand-soft;
}
.main-content {
  flex: 1;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  padding: 16px 12px 0;
  min-height: 0; /* allow flex item to shrink to avoid pushing footer */
}
.mobile-primary-nav {
  display: none;
}
.footer {
  color: $color-footer-text;
  font-size: 0.95rem;
  background: rgba(255, 255, 255, 0.94);
  border-top: 1px solid rgba(17, 24, 39, 0.08);
  box-shadow: 0 -1px 0 rgba(255, 255, 255, 0.8);
  padding: 14px 16px;
  width: 100%;
  position: relative;
  margin-top: auto;
  padding-bottom: max(14px, env(safe-area-inset-bottom));
  text-align: center;
  outline: none;
  transition: background 0.25s ease, border-color 0.25s ease, transform 0.3s ease;
  min-height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}
.footer-main {
  width: min(100%, 1180px);
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  color: #4b5563;
  font-size: 0.95rem;
  letter-spacing: 0;
}
.footer-brand {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  color: #374151;
  font-weight: 700;
}
.footer-mark {
  width: 22px;
  height: 22px;
  padding: 3px;
  border: 1px solid rgba(15, 107, 104, 0.18);
  border-radius: 999px;
  background: $color-brand-soft;
}
.footer-nav {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  flex-wrap: wrap;
}
.footer-nav a {
  min-height: 32px;
  display: inline-flex;
  align-items: center;
  border-radius: 999px;
  padding: 6px 10px;
  color: #4b5563;
  text-decoration: underline;
  text-decoration-thickness: 1px;
  text-underline-offset: 3px;
  margin: 0;
  transition: background 0.2s ease, color 0.2s ease, box-shadow 0.2s ease;
}
.footer-nav a:hover,
.footer-nav a:focus-visible {
  background: rgba(15, 107, 104, 0.1);
  color: $color-brand-strong;
  outline: none;
  box-shadow: 0 0 0 3px rgba(15, 107, 104, 0.14);
}
.user-avatar-container {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  min-height: 46px;
  padding: 4px 11px 4px 5px;
  border: 1px solid rgba(15, 107, 104, 0.12);
  border-radius: 999px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.96), rgba(248, 250, 252, 0.9));
  color: $color-ink;
  font-family: inherit;
  box-shadow: 0 10px 24px rgba(17, 24, 39, 0.08), 0 1px 0 rgba(255, 255, 255, 0.9) inset;
  cursor: pointer;
  transition: transform 0.18s ease, border-color 0.18s ease, background 0.18s ease, box-shadow 0.18s ease;
}
.user-avatar-container:hover,
.user-avatar-container:focus-visible {
  border-color: rgba(15, 107, 104, 0.28);
  background: $color-brand-soft;
  box-shadow: 0 14px 30px rgba(15, 107, 104, 0.12), 0 1px 0 rgba(255, 255, 255, 0.95) inset;
  transform: translateY(-1px);
}
.user-avatar-container:focus-visible {
  outline: 3px solid rgba(15, 107, 104, 0.22);
  outline-offset: 3px;
}
.user-avatar-container:active {
  transform: translateY(0) scale(0.98);
}
.user-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #fff;
  box-shadow: 0 0 0 1px rgba(15, 107, 104, 0.12);
  transition: box-shadow 0.2s ease, transform 0.2s ease;
}
.user-avatar-container:hover .user-avatar {
  box-shadow: 0 0 0 2px rgba(15, 107, 104, 0.22);
  transform: scale(1.03);
}
.user-trigger-copy {
  display: grid;
  gap: 1px;
  min-width: 0;
  max-width: 116px;
  text-align: left;
}
.user-trigger-copy span,
.user-trigger-copy small {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.user-trigger-copy span {
  color: $color-ink;
  font-size: 0.85rem;
  font-weight: 800;
  line-height: 1.2;
}
.user-trigger-copy small {
  color: #64748b;
  font-size: 0.7rem;
  font-weight: 750;
  line-height: 1.2;
}
.user-trigger-arrow {
  color: #64748b;
  font-size: 13px;
  transition: transform 0.18s ease, color 0.18s ease;
}
.user-avatar-container:hover .user-trigger-arrow {
  color: $color-brand-strong;
  transform: translateY(1px);
}
:global(.user-menu-popper) {
  border: 1px solid rgba(15, 23, 42, 0.08) !important;
  border-radius: 20px !important;
  overflow: hidden;
  box-shadow: 0 28px 70px rgba(15, 23, 42, 0.18), 0 1px 0 rgba(255, 255, 255, 0.86) inset !important;
}
:global(.user-menu-popper .el-popper__arrow::before) {
  border-color: rgba(15, 23, 42, 0.08) !important;
}
:global(.user-dropdown-menu) {
  width: 344px;
  padding: 10px !important;
}
:global(.user-dropdown-profile) {
  display: grid;
  grid-template-columns: 50px minmax(0, 1fr) auto;
  align-items: center;
  gap: 11px;
  padding: 10px;
  margin-bottom: 8px;
  border: 1px solid rgba(15, 107, 104, 0.1);
  border-radius: 16px;
  background: linear-gradient(135deg, rgba(15, 107, 104, 0.09), rgba(245, 179, 68, 0.1)), #fff;
}
:global(.user-dropdown-avatar) {
  width: 50px;
  height: 50px;
  border-radius: 15px;
  object-fit: cover;
  border: 2px solid #fff;
  box-shadow: 0 8px 20px rgba(15, 23, 42, 0.12);
}
:global(.user-dropdown-identity) {
  display: grid;
  min-width: 0;
  gap: 3px;
}
:global(.user-dropdown-identity strong),
:global(.user-dropdown-identity span) {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
:global(.user-dropdown-identity strong) {
  color: $color-ink;
  font-size: 0.98rem;
  font-weight: 900;
  line-height: 1.25;
}
:global(.user-dropdown-identity span) {
  color: #64748b;
  font-size: 0.78rem;
  font-weight: 650;
}
:global(.user-dropdown-status) {
  align-self: start;
  padding: 4px 8px;
  border-radius: 999px;
  background: rgba(15, 23, 42, 0.06);
  color: #475569;
  font-size: 0.68rem;
  font-weight: 850;
  text-transform: uppercase;
}
:global(.user-dropdown-section) {
  padding: 5px 0;
}
:global(.user-dropdown-section-title) {
  display: block;
  padding: 4px 8px 6px;
  color: $color-brand-strong;
  font-size: 0.7rem;
  font-weight: 900;
  text-transform: uppercase;
}
:global(.user-dropdown-item) {
  display: grid !important;
  grid-template-columns: 38px minmax(0, 1fr) 18px;
  align-items: center;
  gap: 10px;
  min-height: 58px;
  padding: 8px !important;
  border-radius: 13px !important;
  color: $color-ink !important;
}
:global(.user-dropdown-item:hover),
:global(.user-dropdown-item:focus) {
  background: $color-brand-soft !important;
  color: $color-brand-strong !important;
}
:global(.user-dropdown-icon) {
  width: 38px;
  height: 38px;
  border-radius: 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: rgba(15, 107, 104, 0.09);
  color: $color-brand-strong;
}
:global(.user-dropdown-icon.danger) {
  background: $color-danger-soft;
  color: $color-danger;
}
:global(.user-dropdown-copy) {
  display: grid;
  min-width: 0;
  gap: 2px;
}
:global(.user-dropdown-copy strong),
:global(.user-dropdown-copy small) {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
:global(.user-dropdown-copy strong) {
  color: inherit;
  font-size: 0.92rem;
  font-weight: 850;
}
:global(.user-dropdown-copy small) {
  color: #64748b;
  font-size: 0.74rem;
  font-weight: 650;
}
:global(.user-dropdown-arrow) {
  color: #94a3b8;
}
:global(.user-dropdown-logout) {
  margin-top: 5px !important;
  grid-template-columns: 38px minmax(0, 1fr) !important;
}
:global(.user-dropdown-logout.el-dropdown-menu__item--divided::before) {
  margin: 0 0 8px !important;
}
:global(.user-dropdown-logout:hover),
:global(.user-dropdown-logout:focus) {
  background: $color-danger-soft !important;
  color: $color-danger !important;
}

@media (max-width: 768px) {
  .header-inner {
    height: 64px;
    gap: 10px;
    padding: 0 14px;
  }
  .logo {
    width: 104px;
  }
  .logo-link,
  .logo-image {
    width: 104px;
  }
  .desktop-nav {
    justify-content: flex-end;
    gap: 4px;
    flex: 0 0 auto;
  }
  .nav-link {
    display: none;
  }
  .user-trigger-copy {
    display: none;
  }
  .user-avatar-container {
    min-height: 42px;
    padding: 3px 8px 3px 4px;
  }
  .user-trigger-arrow {
    display: none;
  }
  .main-content {
    padding: 10px 10px 0;
  }
  .mobile-primary-nav {
    display: flex;
    gap: 8px;
    margin: 0 -10px 10px;
    padding: 0 10px 2px;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
  }
  .mobile-primary-nav::-webkit-scrollbar {
    display: none;
  }
  .mobile-nav-link {
    flex: 0 0 auto;
    min-height: 36px;
    display: inline-flex;
    align-items: center;
    border: 1px solid rgba(15, 107, 104, 0.12);
    border-radius: 999px;
    padding: 8px 12px;
    background: rgba(255, 255, 255, 0.76);
    color: $color-muted;
    font-size: 0.86rem;
    font-weight: 750;
    text-decoration: none;
    white-space: nowrap;
  }
  .mobile-nav-link.router-link-active,
  .mobile-nav-link.router-link-exact-active {
    background: $color-brand-soft;
    color: $color-brand-strong;
    border-color: rgba(15, 107, 104, 0.22);
  }
  :global(.user-dropdown-menu) {
    width: min(344px, calc(100vw - 24px));
  }
  .footer-main {
    flex-direction: column;
    align-items: center;
    gap: 8px;
  }
  .global-layout {
    overflow-x: hidden;
    max-width: 100vw;
  }
  .footer {
    z-index: 100;
    backdrop-filter: blur(20px);
    background: rgba(255, 255, 255, 0.96);
    border-radius: 18px 18px 0 0;
    box-shadow: 0 -10px 24px rgba(17, 24, 39, 0.08);
    padding: 12px 16px max(12px, env(safe-area-inset-bottom));
    min-height: auto;
    margin-top: 32px;
  }
  .footer-brand {
    font-size: 0.9rem;
  }
  .footer-nav {
    justify-content: center;
  }
}
</style>
