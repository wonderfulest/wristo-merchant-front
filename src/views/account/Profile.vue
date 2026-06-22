<template>
  <div class="profile-page">
    <div class="profile-container">
      <div class="profile-hero">
        <div class="avatar-wrapper" :class="{ editing: editMode }" @click="triggerAvatarUpload">
          <img :src="heroAvatar" class="avatar-img" alt="user avatar" />
          <div class="avatar-overlay">{{ t('profile.avatar') }}</div>
          <input v-if="editMode" ref="avatarInputRef" type="file" accept="image/*" hidden @change="onAvatarFileChange" />
        </div>
        <div class="hero-name">{{ displayName }}</div>
        <div class="hero-email">{{ userInfo?.email || '—' }}</div>
      </div>

      <template v-if="userInfo">
        <div class="section">
          <div class="section-header">
            <span class="section-title">{{ t('profile.title') }}</span>
            <button v-if="!editMode" class="edit-trigger" type="button" @click="startEdit">
              Edit
            </button>
            <button v-else class="edit-trigger cancel" type="button" @click="cancelEdit">
              {{ t('common.cancel') }}
            </button>
          </div>
          <div class="section-card">
            <div class="row">
              <div class="row-label">{{ t('profile.username') }}</div>
              <div class="row-value">
                <span v-if="!editMode" class="row-value-text">{{ userInfo.username || '—' }}</span>
                <el-input v-else v-model="form.username" class="apple-input" :placeholder="t('profile.usernamePlaceholder')" />
              </div>
            </div>
            <div class="row-divider" />
            <div class="row">
              <div class="row-label">{{ t('profile.nickname') }}</div>
              <div class="row-value">
                <span v-if="!editMode" class="row-value-text">{{ userInfo.nickname || '—' }}</span>
                <el-input v-else v-model="form.nickname" class="apple-input" :placeholder="t('profile.nicknamePlaceholder')" />
              </div>
            </div>
            <div class="row-divider" />
            <div class="row">
              <div class="row-label">{{ t('profile.email') }}</div>
              <div class="row-value text-value">{{ userInfo.email || '—' }}</div>
            </div>
            <div class="row-divider" />
            <div class="row">
              <div class="row-label">{{ t('profile.phone') }}</div>
              <div class="row-value text-value">{{ userInfo.phone || '—' }}</div>
            </div>
            <div class="row-divider" />
            <div class="row">
              <div class="row-label">{{ t('profile.createdAt') }}</div>
              <div class="row-value text-value">{{ userInfo.createdAt || '—' }}</div>
            </div>
          </div>
        </div>

        <div class="section">
          <div class="section-header">
            <span class="section-title">{{ t('profile.merchantDisplay') }}</span>
          </div>
          <div class="section-card">
            <div class="row">
              <div class="row-label">{{ t('profile.appCount') }}</div>
              <div class="row-value text-value">{{ userInfo.appCount || 0 }}</div>
            </div>
            <div class="row-divider" />
            <div class="row">
              <div class="row-label">{{ t('profile.totalDownloads') }}</div>
              <div class="row-value text-value">{{ userInfo.totalDownloads || 0 }}</div>
            </div>
            <div class="row-divider" />
            <div class="row row-tall">
              <div class="row-label">{{ t('profile.banner') }}</div>
              <div class="row-value">
                <ImageUpload
                  v-if="editMode"
                  v-model="form.bannerImageId"
                  :preview-url="bannerPreviewUrl"
                  aspect-code="banner"
                  :max-size-mb="4"
                  @uploaded="handleBannerUploaded"
                />
                <div v-else class="banner-preview">
                  <img v-if="bannerPreviewUrl" :src="bannerPreviewUrl" alt="merchant banner" />
                  <span v-else>{{ t('common.noImage') }}</span>
                </div>
              </div>
            </div>
            <div class="row-divider" />
            <div class="row">
              <div class="row-label">{{ t('profile.slogan') }}</div>
              <div class="row-value">
                <span v-if="!editMode" class="row-value-text">{{ userInfo.slogan || '—' }}</span>
                <el-input v-else v-model="form.slogan" class="apple-input" :placeholder="t('profile.sloganPlaceholder')" />
              </div>
            </div>
            <div class="row-divider" />
            <div class="row">
              <div class="row-label">Facebook</div>
              <div class="row-value">
                <span v-if="!editMode" class="row-value-text">{{ userInfo.facebookUrl || '—' }}</span>
                <el-input v-else v-model="form.facebookUrl" class="apple-input" :placeholder="t('profile.facebookPlaceholder')" />
              </div>
            </div>
            <div class="row-divider" />
            <div class="row">
              <div class="row-label">Instagram</div>
              <div class="row-value">
                <span v-if="!editMode" class="row-value-text">{{ userInfo.instagramUrl || '—' }}</span>
                <el-input v-else v-model="form.instagramUrl" class="apple-input" :placeholder="t('profile.instagramPlaceholder')" />
              </div>
            </div>
            <div class="row-divider" />
            <div class="row">
              <div class="row-label">X</div>
              <div class="row-value">
                <span v-if="!editMode" class="row-value-text">{{ userInfo.xUrl || '—' }}</span>
                <el-input v-else v-model="form.xUrl" class="apple-input" :placeholder="t('profile.xPlaceholder')" />
              </div>
            </div>
          </div>
        </div>

        <div class="section">
          <div class="section-header">
            <span class="section-title">{{ t('profile.payoutInfo') }}</span>
          </div>
          <div class="section-card">
            <div class="row">
              <div class="row-label">{{ t('profile.payoutMethod') }}</div>
              <div class="row-value">
                <span v-if="!editMode" class="row-value-text">{{ payoutMethodLabel }}</span>
                <el-select v-else v-model="form.payoutMethod" :placeholder="t('profile.payoutMethodPlaceholder')" class="apple-select">
                  <el-option :label="t('profile.alipay')" value="alipay" />
                  <el-option :label="t('profile.paypal')" value="paypal" />
                </el-select>
              </div>
            </div>
            <div class="row-divider" />
            <div class="row">
              <div class="row-label">{{ t('profile.payoutAccount') }}</div>
              <div class="row-value">
                <span v-if="!editMode" class="row-value-text">{{ userInfo.payoutAccount || '—' }}</span>
                <el-input v-else v-model="form.payoutAccount" class="apple-input" :placeholder="t('profile.payoutAccountPlaceholder')" />
              </div>
            </div>
            <template v-if="editMode">
              <div class="row-divider" />
              <div class="row save-row">
                <button class="save-btn" type="button" :disabled="saving" @click="handleSave">
                  {{ saving ? t('common.loading') : t('common.save') }}
                </button>
              </div>
            </template>
          </div>
        </div>
      </template>
      <el-skeleton v-else class="section-card loading-card" :rows="6" animated />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, reactive, onMounted, watch } from 'vue'
import { getMchUserInfo, updateMchInfo, uploadAvatar } from '@/api/user'
import type { MchUserVO, UserMchUpdateDTO, ApiResponse } from '@/types/api'
import type { ImageVO } from '@/types/image'
import { ElMessage } from 'element-plus'
import ImageUpload from '@/components/common/ImageUpload.vue'
import { useI18n } from '@/i18n'
import { useUserStore } from '@/store/user'

const userInfo = ref<MchUserVO | null>(null)
const loading = ref(true)
const saving = ref(false)
const editMode = ref(false)
const bannerPreviewUrl = ref('')
const { t } = useI18n()
const userStore = useUserStore()
const defaultAvatar = 'https://cdn.wristo.io/test/avatar/561aae25-41bd-47ab-974e-7231f5a850e8.png'
const avatarInputRef = ref<HTMLInputElement | null>(null)

const form = reactive({
  username: '',
  nickname: '',
  avatar: '',
  email: '',
  phone: '',
  createdAt: '',
  appCount: '' as number | '',
  totalDownloads: '' as number | '',
  bannerImageId: undefined as number | undefined,
  slogan: '',
  facebookUrl: '',
  instagramUrl: '',
  xUrl: '',
  payoutMethod: '',
  payoutAccount: ''
})

const displayName = computed(() => {
  const source = editMode.value ? form : userInfo.value
  return source?.nickname || source?.username || 'Wristo'
})

const heroAvatar = computed(() => {
  return editMode.value ? (form.avatar || defaultAvatar) : (userInfo.value?.avatar || defaultAvatar)
})

const payoutMethodLabel = computed(() => {
  const method = userInfo.value?.payoutMethod
  if (method === 'alipay') return t('profile.alipay')
  if (method === 'paypal') return t('profile.paypal')
  return '—'
})

watch(
  () => form.bannerImageId,
  (v) => {
    if (v === undefined) bannerPreviewUrl.value = ''
  }
)

const getImageUrl = (img?: any): string => {
  if (!img) return ''
  return img.url || img.previewUrl || img.formats?.thumbnail?.url || ''
}

const handleBannerUploaded = (img: ImageVO) => {
  bannerPreviewUrl.value = (img as any)?.previewUrl || (img as any)?.formats?.thumbnail?.url || (img as any)?.url || ''
}

onMounted(async () => {
  await fetchUserInfo()
})

async function fetchUserInfo() {
  loading.value = true
  try {
    const res: ApiResponse<MchUserVO> = await getMchUserInfo()
    if (res.code === 0 && res.data) {
      userInfo.value = res.data
      userStore.setUserInfo(res.data)
      Object.assign(form, {
        username: res.data.username || '',
        nickname: res.data.nickname || '',
        avatar: res.data.avatar || '',
        email: res.data.email || '',
        phone: res.data.phone || '',
        createdAt: res.data.createdAt || '',
        payoutMethod: res.data.payoutMethod || '',
        payoutAccount: res.data.payoutAccount || '',
        bannerImageId: (res.data.bannerImageId ?? undefined) as any,
        slogan: res.data.slogan || '',
        facebookUrl: res.data.facebookUrl || '',
        instagramUrl: res.data.instagramUrl || '',
        xUrl: res.data.xUrl || '',
        appCount: res.data.appCount ?? '',
        totalDownloads: res.data.totalDownloads ?? ''
      })
      bannerPreviewUrl.value = getImageUrl((res.data as any)?.bannerImage)
      editMode.value = false
    } else {
      ElMessage.error(res.msg || t('profile.fetchFailed'))
    }
  } catch (e) {
    ElMessage.error(t('profile.fetchFailed'))
  } finally {
    loading.value = false
  }
}

function beforeAvatarUpload(file: File) {
  const isImage = file.type.startsWith('image/')
  if (!isImage) {
    ElMessage.error(t('profile.imageOnly'))
  }
  const isLt2M = file.size / 1024 / 1024 < 2
  if (!isLt2M) {
    ElMessage.error(t('profile.imageTooLarge'))
  }
  return isImage && isLt2M
}

async function handleAvatarChange(fileObj: any) {
  const file = fileObj.raw
  if (!beforeAvatarUpload(file)) return
  try {
    const res: ApiResponse<string> = await uploadAvatar(file)
    if (res.code === 0) {
      form.avatar = res.data || ''
      ElMessage.success(t('profile.avatarUploaded'))
    } else {
      ElMessage.error(res.msg || t('profile.avatarUploadFailed'))
    }
  } catch (e) {
    ElMessage.error(t('profile.avatarUploadFailed'))
  }
}

function syncFormFromUser() {
  if (!userInfo.value) return
  Object.assign(form, {
    username: userInfo.value.username || '',
    nickname: userInfo.value.nickname || '',
    avatar: userInfo.value.avatar || '',
    email: userInfo.value.email || '',
    phone: userInfo.value.phone || '',
    createdAt: userInfo.value.createdAt || '',
    payoutMethod: userInfo.value.payoutMethod || '',
    payoutAccount: userInfo.value.payoutAccount || '',
    bannerImageId: (userInfo.value.bannerImageId ?? undefined) as any,
    slogan: userInfo.value.slogan || '',
    facebookUrl: userInfo.value.facebookUrl || '',
    instagramUrl: userInfo.value.instagramUrl || '',
    xUrl: userInfo.value.xUrl || '',
    appCount: userInfo.value.appCount ?? '',
    totalDownloads: userInfo.value.totalDownloads ?? ''
  })
}

function startEdit() {
  syncFormFromUser()
  editMode.value = true
}

function cancelEdit() {
  syncFormFromUser()
  bannerPreviewUrl.value = getImageUrl((userInfo.value as any)?.bannerImage)
  editMode.value = false
}

function triggerAvatarUpload() {
  if (!editMode.value) return
  avatarInputRef.value?.click()
}

async function onAvatarFileChange(e: Event) {
  const files = (e.target as HTMLInputElement).files
  if (!files || files.length === 0) return
  await handleAvatarChange({ raw: files[0] })
  ;(e.target as HTMLInputElement).value = ''
}

async function handleSave() {
  const username = form.username.trim()
  const nickname = form.nickname.trim()
  if (!username) {
    ElMessage.error(t('profile.usernamePlaceholder'))
    return
  }

  saving.value = true
  try {
    const updateData: UserMchUpdateDTO = {
      username,
      nickname,
      avatar: form.avatar,
      payoutMethod: form.payoutMethod,
      payoutAccount: form.payoutAccount,
      bannerImageId: form.bannerImageId,
      slogan: form.slogan,
      facebookUrl: form.facebookUrl,
      instagramUrl: form.instagramUrl,
      xUrl: form.xUrl
    }
    const res: ApiResponse<boolean> = await updateMchInfo(updateData)
    if (res.code === 0) {
      ElMessage.success(t('profile.saveSuccess'))
      await fetchUserInfo()
    } else {
      ElMessage.error(res.msg || t('profile.saveFailed'))
    }
  } catch (e) {
    ElMessage.error(t('profile.saveFailed'))
  } finally {
    saving.value = false
  }
}
</script>

<style scoped>
.profile-page {
  width: 100%;
  min-height: calc(100vh - 80px);
  background: #f2f2f7;
  display: flex;
  justify-content: center;
  padding: 0 16px 48px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
.profile-container {
  width: 100%;
  max-width: 580px;
  display: flex;
  flex-direction: column;
  gap: 32px;
  padding-top: 40px;
}
.profile-hero {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}
.avatar-wrapper {
  position: relative;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  overflow: hidden;
  background: #fff;
  box-shadow:
    0 0 0 3px #fff,
    0 2px 16px rgba(0, 0, 0, 0.08);
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}
.avatar-wrapper.editing {
  cursor: pointer;
  box-shadow:
    0 0 0 3px var(--color-brand),
    0 4px 20px rgba(15, 107, 104, 0.18);
}
.avatar-wrapper.editing:hover {
  transform: scale(1.04);
}
.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
.avatar-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.35);
  color: #fff;
  font-size: 0.8rem;
  font-weight: 700;
  opacity: 0;
  transition: opacity 0.2s ease;
}
.avatar-wrapper.editing:hover .avatar-overlay {
  opacity: 1;
}
.hero-name {
  margin-top: 8px;
  color: #1d1d1f;
  font-size: 1.75rem;
  font-weight: 700;
  letter-spacing: 0;
  text-align: center;
}
.hero-email {
  color: #86868b;
  font-size: 0.9375rem;
}
.section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 4px;
}
.section-title {
  color: #86868b;
  font-size: 0.8125rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}
.edit-trigger {
  font-size: 0.9375rem;
  font-weight: 500;
  color: var(--color-brand);
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 6px;
  transition: background 0.15s ease;
}
.edit-trigger:hover {
  background: rgba(15, 107, 104, 0.08);
}
.edit-trigger.cancel {
  color: #86868b;
}
.edit-trigger.cancel:hover {
  background: rgba(0, 0, 0, 0.04);
}
.section-card {
  background: #fff;
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 0.5px 0 rgba(0, 0, 0, 0.04);
}
.row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  min-height: 48px;
  padding: 13px 18px;
  transition: background 0.15s ease;
}
.row-tall {
  align-items: flex-start;
}
.row-divider {
  height: 0.5px;
  margin-left: 18px;
  background: #d1d1d6;
}
.row-label {
  flex: 0 0 auto;
  color: #1d1d1f;
  font-size: 0.9375rem;
  font-weight: 400;
  white-space: nowrap;
}
.row-value {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  min-width: 0;
  text-align: right;
  color: #86868b;
  font-size: 0.9375rem;
}
.text-value {
  color: #86868b;
  overflow-wrap: anywhere;
}
.row-value-text {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.apple-input,
.apple-select {
  width: 100%;
}
.apple-input :deep(.el-input__wrapper),
.apple-select :deep(.el-select__wrapper) {
  background: #f2f2f7;
  border-radius: 8px;
  box-shadow: none !important;
  min-height: 34px;
  transition: background 0.2s ease;
}
.apple-input :deep(.el-input__wrapper.is-focus),
.apple-select :deep(.el-select__wrapper.is-focused) {
  background: #e8e8ed;
}
.apple-input :deep(.el-input__inner) {
  color: #1d1d1f;
  font-size: 0.9375rem;
  text-align: right;
}
.apple-select :deep(.el-select__selected-item) {
  color: #1d1d1f;
  font-size: 0.9375rem;
  justify-content: flex-end;
}
.banner-preview {
  width: min(100%, 260px);
  min-height: 72px;
  display: grid;
  place-items: center;
  overflow: hidden;
  border-radius: 12px;
  background: #f2f2f7;
  color: #86868b;
  font-size: 0.875rem;
}
.banner-preview img {
  width: 100%;
  height: 96px;
  object-fit: cover;
}
.save-row {
  padding: 12px 18px 14px;
  justify-content: center;
}
.save-btn {
  width: 100%;
  min-height: 42px;
  padding: 11px 24px;
  border: none;
  border-radius: 10px;
  background: var(--color-brand);
  color: #fff;
  cursor: pointer;
  font-size: 0.9375rem;
  font-weight: 600;
  transition: background 0.2s ease, opacity 0.2s ease, transform 0.15s ease;
}
.save-btn:hover:not(:disabled) {
  background: var(--color-brand-strong);
}
.save-btn:active:not(:disabled) {
  transform: scale(0.985);
}
.save-btn:disabled {
  cursor: not-allowed;
  opacity: 0.68;
}
.loading-card {
  padding: 18px;
}
@media (max-width: 640px) {
  .profile-page {
    padding: 0 0 32px;
  }
  .profile-container {
    max-width: 100%;
    gap: 24px;
    padding: 24px 16px 0;
  }
  .avatar-wrapper {
    width: 88px;
    height: 88px;
  }
  .hero-name {
    font-size: 1.5rem;
  }
  .section-card {
    border-radius: 12px;
  }
  .row {
    gap: 12px;
    padding: 12px 16px;
  }
  .row-tall {
    flex-direction: column;
  }
  .row-tall .row-value {
    width: 100%;
    justify-content: flex-start;
    text-align: left;
  }
  .row-divider {
    margin-left: 16px;
  }
  .apple-input :deep(.el-input__inner) {
    text-align: right;
  }
}
</style> 
