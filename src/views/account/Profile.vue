<template>
  <div class="profile-page">
    <div class="profile-container">
      <div class="profile-hero">
        <div class="avatar-wrapper" @click="triggerAvatarUpload">
          <img :src="form.avatar || defaultAvatar" class="avatar-img" alt="user avatar" />
          <div class="avatar-overlay">{{ t('profile.avatar') }}</div>
          <input ref="avatarInputRef" type="file" accept="image/*" hidden @change="onAvatarFileChange" />
        </div>
        <div class="hero-name">{{ form.nickname || form.username || 'Wristo' }}</div>
        <div class="hero-email">{{ form.email || '—' }}</div>
      </div>

      <template v-if="userInfo">
        <div class="section">
          <div class="section-header">
            <span class="section-title">{{ t('profile.title') }}</span>
          </div>
          <div class="section-card">
            <div class="row">
              <div class="row-label">{{ t('profile.username') }}</div>
              <div class="row-value"><el-input v-model="form.username" :placeholder="t('profile.usernamePlaceholder')" /></div>
            </div>
            <div class="row-divider" />
            <div class="row">
              <div class="row-label">{{ t('profile.nickname') }}</div>
              <div class="row-value"><el-input v-model="form.nickname" :placeholder="t('profile.nicknamePlaceholder')" /></div>
            </div>
            <div class="row-divider" />
            <div class="row">
              <div class="row-label">{{ t('profile.email') }}</div>
              <div class="row-value text-value">{{ form.email || '—' }}</div>
            </div>
            <div class="row-divider" />
            <div class="row">
              <div class="row-label">{{ t('profile.phone') }}</div>
              <div class="row-value text-value">{{ form.phone || '—' }}</div>
            </div>
            <div class="row-divider" />
            <div class="row">
              <div class="row-label">{{ t('profile.createdAt') }}</div>
              <div class="row-value text-value">{{ form.createdAt || '—' }}</div>
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
              <div class="row-value text-value">{{ form.appCount || 0 }}</div>
            </div>
            <div class="row-divider" />
            <div class="row">
              <div class="row-label">{{ t('profile.totalDownloads') }}</div>
              <div class="row-value text-value">{{ form.totalDownloads || 0 }}</div>
            </div>
            <div class="row-divider" />
            <div class="row row-tall">
              <div class="row-label">{{ t('profile.banner') }}</div>
              <div class="row-value">
                <ImageUpload
                  v-model="form.bannerImageId"
                  :preview-url="bannerPreviewUrl"
                  aspect-code="banner"
                  :max-size-mb="4"
                  @uploaded="handleBannerUploaded"
                />
              </div>
            </div>
            <div class="row-divider" />
            <div class="row">
              <div class="row-label">{{ t('profile.slogan') }}</div>
              <div class="row-value"><el-input v-model="form.slogan" :placeholder="t('profile.sloganPlaceholder')" /></div>
            </div>
            <div class="row-divider" />
            <div class="row">
              <div class="row-label">Facebook</div>
              <div class="row-value"><el-input v-model="form.facebookUrl" :placeholder="t('profile.facebookPlaceholder')" /></div>
            </div>
            <div class="row-divider" />
            <div class="row">
              <div class="row-label">Instagram</div>
              <div class="row-value"><el-input v-model="form.instagramUrl" :placeholder="t('profile.instagramPlaceholder')" /></div>
            </div>
            <div class="row-divider" />
            <div class="row">
              <div class="row-label">X</div>
              <div class="row-value"><el-input v-model="form.xUrl" :placeholder="t('profile.xPlaceholder')" /></div>
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
                <el-select v-model="form.payoutMethod" :placeholder="t('profile.payoutMethodPlaceholder')" style="width: 100%">
                  <el-option :label="t('profile.alipay')" value="alipay" />
                  <el-option :label="t('profile.paypal')" value="paypal" />
                </el-select>
              </div>
            </div>
            <div class="row-divider" />
            <div class="row">
              <div class="row-label">{{ t('profile.payoutAccount') }}</div>
              <div class="row-value"><el-input v-model="form.payoutAccount" :placeholder="t('profile.payoutAccountPlaceholder')" /></div>
            </div>
            <div class="row-divider" />
            <div class="row save-row">
              <el-button type="primary" :loading="saving" @click="handleSave">{{ t('common.save') }}</el-button>
            </div>
          </div>
        </div>
      </template>
      <el-skeleton v-else class="section-card loading-card" :rows="6" animated />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch } from 'vue'
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
  appCount: '',
  totalDownloads: '',
  bannerImageId: undefined as number | undefined,
  slogan: '',
  facebookUrl: '',
  instagramUrl: '',
  xUrl: '',
  payoutMethod: '',
  payoutAccount: ''
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

function triggerAvatarUpload() {
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
  background: transparent;
  display: flex;
  justify-content: center;
  padding: 0 16px 48px;
}
.profile-container {
  width: 100%;
  max-width: 680px;
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
  background: var(--color-surface);
  cursor: pointer;
  box-shadow: 0 0 0 3px var(--color-surface), var(--shadow-md);
}
.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.avatar-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.35);
  color: var(--color-surface);
  font-size: 0.8rem;
  opacity: 0;
  transition: opacity 0.2s ease;
}
.avatar-wrapper:hover .avatar-overlay {
  opacity: 1;
}
.hero-name {
  margin-top: 8px;
  color: var(--color-ink);
  font-size: 1.75rem;
  font-weight: 700;
  text-align: center;
}
.hero-email {
  color: var(--color-muted);
  font-size: 0.9375rem;
}
.section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.section-header {
  padding: 0 4px;
}
.section-title {
  color: var(--color-muted);
  font-size: 0.8125rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}
.section-card {
  background: var(--color-surface);
  border-radius: 14px;
  overflow: hidden;
  box-shadow: var(--shadow-sm);
}
.row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  min-height: 50px;
  padding: 13px 18px;
}
.row-tall {
  align-items: flex-start;
}
.row-divider {
  height: 1px;
  margin-left: 18px;
  background: var(--color-line);
}
.row-label {
  flex: 0 0 140px;
  color: var(--color-ink);
  font-size: 0.9375rem;
}
.row-value {
  flex: 1;
  min-width: 0;
  text-align: right;
}
.text-value {
  color: var(--color-muted);
  overflow-wrap: anywhere;
}
.save-row {
  justify-content: flex-end;
}
.loading-card {
  padding: 18px;
}
@media (max-width: 640px) {
  .row {
    align-items: flex-start;
    flex-direction: column;
  }
  .row-label {
    flex-basis: auto;
  }
  .row-value {
    width: 100%;
    text-align: left;
  }
}
</style> 
