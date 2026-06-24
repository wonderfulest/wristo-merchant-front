<template>
  <div class="api-page">
    <div class="api-header">
      <h1>{{ t('api.title') }}</h1>
    </div>
    <div class="api-content">
      <p class="api-tip">
        {{ t('api.tip.results') }}
      </p>
      <p class="api-tip">
        {{ t('api.tip.secret') }}
      </p>
      <p class="api-tip">
        {{ t('api.tip.docs.prefix') }} <a href="#" target="_blank">{{ t('api.tip.docs.link') }}</a> {{ t('api.tip.docs.suffix') }}
      </p>
      <div class="api-key-card">
        <el-card>
          <div class="api-key-label">{{ t('api.key') }}</div>
          <el-input v-model="apiKey" readonly class="api-key-input" />
          <el-button type="success" class="generate-btn" :loading="loading" @click="generateKey">{{ t('api.generate') }}</el-button>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { getToken, createOrUpdateToken, TOKEN_NAME } from '@/api/merchant-api'
import type { ApiResponse } from '@/types/api'
import type {  TokenData } from '@/api/merchant-api'
import { useI18n } from '@/i18n'

const apiKey = ref('')
const loading = ref(false)
const { t } = useI18n()

onMounted(async () => {
  const res: ApiResponse<TokenData> = await getToken()
  if (res.code === 0) {
    apiKey.value = res.data?.token || ''
    if (!apiKey.value) {
      generateKey()
    }
  } else {
    ElMessage.error(res.msg || t('api.fetchFailed'))
  }
})
async function generateKey() {
  loading.value = true
  try {
    const res: ApiResponse<TokenData> = await createOrUpdateToken(TOKEN_NAME)
    if (res.code === 0) {
      apiKey.value = res.data?.token || ''
      ElMessage.success(t('api.generateSuccess'))
    } else {
      ElMessage.error(res.msg || t('api.generateFailed'))
    }
  } catch (e: any) {
    ElMessage.error(e?.msg || t('api.generateFailed'))
  } finally {
    loading.value = false
  }
}
</script>

<style lang="scss" scoped>
@use '@/assets/styles/variables.scss' as *;

.api-page {
  min-height: 100vh;
  background: $color-bg;
}
.api-header {
  background: $color-header-bg;
  color: $color-header-text;
  padding: 40px 0 24px 0;
  text-align: left;
}
.api-header h1 {
  font-size: $font-size-title;
  font-weight: 400;
  margin: 0 0 0 60px;
  letter-spacing: 2px;
}
.api-content {
  max-width: 900px;
  margin: 32px auto 0 auto;
  padding: 0 16px;
  font-size: $font-size-md;
  color: $color-link;
}
.api-tip {
  font-size: $font-size-sm;
  color: $color-info;
  margin-bottom: 12px;
  line-height: 1.7;
}
.api-key-card {
  display: flex;
  justify-content: center;
  margin-top: 40px;
}
.el-card {
  min-width: 480px;
  max-width: 600px;
  padding: 32px 32px 24px 32px;
  box-sizing: border-box;
  border-radius: $border-radius;
  box-shadow: $box-shadow;
}
.api-key-label {
  font-size: $font-size-sm;
  color: $color-link;
  margin-bottom: 8px;
}
.api-key-input {
  width: 100%;
  margin-bottom: 24px;
  font-size: $font-size-lg;
  letter-spacing: 1px;
  background: $color-surface-soft;
  border-radius: $border-radius;
}
.generate-btn {
  width: 100%;
  font-size: $font-size-md;
  font-weight: bold;
  background: $color-primary;
  border-color: $color-primary;
}

@media (max-width: 640px) {
  .api-page {
    min-height: auto;
  }

  .api-header {
    padding: 26px 16px 18px;
  }

  .api-header h1 {
    margin: 0;
    font-size: 1.8rem;
    letter-spacing: 0;
  }

  .api-content {
    margin-top: 18px;
    padding: 0;
  }

  .api-key-card {
    display: block;
    margin-top: 24px;
  }

  .el-card {
    min-width: 0;
    width: 100%;
    max-width: 100%;
    padding: 18px 14px;
  }

  .api-key-input {
    font-size: $font-size-sm;
    letter-spacing: 0;
  }
}
</style>
