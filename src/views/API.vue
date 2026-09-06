<template>
  <div class="api-page">
    <div class="api-header"><h1>{{ t('api.title') }}</h1></div>
    <div class="api-content">
      <p class="api-tip">{{ t('api.tip.results') }}</p>
      <p class="api-tip">{{ t('api.tip.secret') }}</p>
      <p class="api-tip">
        {{ t('api.tip.docs.prefix') }}
        <a :href="merchantApiDocsUrl" target="_blank" rel="noopener noreferrer">{{ t('api.tip.docs.link') }}</a>
        {{ t('api.tip.docs.suffix') }}
      </p>
      <el-card class="api-key-card" shadow="never" v-loading="loading">
        <template v-if="tokenMetadata">
          <div class="api-key-label">{{ t('api.key') }}</div>
          <div class="masked-key">{{ t('api.keyMasked') }}</div>
          <dl class="key-metadata">
            <div><dt>{{ t('api.createdAt') }}</dt><dd>{{ formatDate(tokenMetadata.createdAt) }}</dd></div>
            <div><dt>{{ t('api.lastUsedAt') }}</dt><dd>{{ tokenMetadata.lastUsedAt ? formatDate(tokenMetadata.lastUsedAt) : t('api.neverUsed') }}</dd></div>
          </dl>
          <el-button type="danger" class="generate-btn" :loading="rotating" @click="handleCreateOrRotate">{{ t('api.rotate') }}</el-button>
        </template>
        <template v-else-if="!loading">
          <el-empty :description="t('api.noKey')" :image-size="88">
            <el-button type="success" :loading="rotating" @click="handleCreateOrRotate">{{ t('api.create') }}</el-button>
          </el-empty>
        </template>
      </el-card>
    </div>
    <el-dialog v-model="secretVisible" :title="t('api.secretTitle')" width="min(620px, calc(100vw - 24px))" @closed="revealedToken = ''">
      <el-alert :title="t('api.secretWarning')" type="warning" :closable="false" show-icon />
      <div class="secret-copy-row">
        <el-input v-model="revealedToken" readonly show-password aria-label="New API key" />
        <el-button type="primary" @click="copySecret">{{ t('api.copy') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { createOrRotateToken, getTokenMetadata, TOKEN_NAME, type TokenMetadata, type TokenSecretData } from '@/api/merchant-api'
import type { ApiResponse } from '@/types/api'
import { useI18n } from '@/i18n'

const tokenMetadata = ref<TokenMetadata | null>(null)
const revealedToken = ref('')
const loading = ref(false)
const rotating = ref(false)
const secretVisible = ref(false)
const { t, locale } = useI18n()
const merchantApiDocsUrl = import.meta.env.VITE_WRISTO_MERCHANT_API_DOCS_URL || 'https://api.wristo.io/swagger-ui.html'
const isRotation = computed(() => tokenMetadata.value !== null)

const formatDate = (value: string) => new Intl.DateTimeFormat(locale.value === 'zh' ? 'zh-CN' : 'en-US', {
  dateStyle: 'medium', timeStyle: 'short',
}).format(new Date(value))

const fetchTokenMetadata = async () => {
  loading.value = true
  try {
    const res: ApiResponse<TokenMetadata> = await getTokenMetadata()
    if (res.code === 0) tokenMetadata.value = res.data || null
    else ElMessage.error(res.msg || t('api.fetchFailed'))
  } catch {
    ElMessage.error(t('api.fetchFailed'))
  } finally {
    loading.value = false
  }
}

const handleCreateOrRotate = async () => {
  if (isRotation.value) {
    try {
      await ElMessageBox.confirm(t('api.rotateConfirm'), t('api.rotate'), {
        confirmButtonText: t('api.rotate'), cancelButtonText: t('common.cancel'), type: 'warning',
      })
    } catch {
      return
    }
  }
  rotating.value = true
  try {
    const res: ApiResponse<TokenSecretData> = await createOrRotateToken(TOKEN_NAME)
    if (res.code !== 0 || !res.data?.token) {
      ElMessage.error(res.msg || t('api.generateFailed'))
      return
    }
    const { token, ...metadata } = res.data
    const rotated = isRotation.value
    tokenMetadata.value = metadata
    revealedToken.value = token
    secretVisible.value = true
    ElMessage.success(rotated ? t('api.rotateSuccess') : t('api.createSuccess'))
  } catch (error: any) {
    ElMessage.error(error?.msg || t('api.generateFailed'))
  } finally {
    rotating.value = false
  }
}

const copySecret = async () => {
  try {
    await navigator.clipboard.writeText(revealedToken.value)
    ElMessage.success(t('api.copySuccess'))
  } catch {
    ElMessage.error(t('api.copyFailed'))
  }
}

onMounted(fetchTokenMetadata)
</script>

<style lang="scss" scoped>
@use '@/assets/styles/variables.scss' as *;
.api-page { min-height: 100vh; background: $color-bg; }
.api-header { background: $color-header-bg; color: $color-header-text; padding: 40px 0 24px; }
.api-header h1 { max-width: 900px; margin: 0 auto; padding: 0 16px; font-size: $font-size-title; font-weight: 400; letter-spacing: 2px; }
.api-content { max-width: 900px; margin: 32px auto 0; padding: 0 16px; color: $color-link; }
.api-tip { font-size: $font-size-sm; color: $color-info; margin-bottom: 12px; line-height: 1.7; }
.api-key-card { margin-top: 32px; max-width: 600px; }
.api-key-label { font-size: $font-size-sm; color: $color-link; margin-bottom: 8px; }
.masked-key { padding: 12px; border-radius: $border-radius; background: $color-surface-soft; font-family: monospace; letter-spacing: .08em; }
.key-metadata { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; margin: 20px 0; }
.key-metadata dt { color: $color-info; font-size: $font-size-xs; }
.key-metadata dd { margin: 4px 0 0; color: $color-link; font-size: $font-size-sm; }
.generate-btn { width: 100%; font-weight: bold; }
.secret-copy-row { display: flex; gap: 12px; margin-top: 20px; }
@media (max-width: 640px) {
  .api-page { min-height: auto; }
  .api-header { padding: 26px 16px 18px; }
  .api-header h1 { padding: 0; font-size: 1.8rem; letter-spacing: 0; }
  .api-content { margin-top: 18px; }
  .key-metadata { grid-template-columns: 1fr; gap: 10px; }
  .secret-copy-row { flex-direction: column; }
}
</style>
