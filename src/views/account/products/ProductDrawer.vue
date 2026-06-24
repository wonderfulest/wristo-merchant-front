<template>
  <div class="add-product-drawer">
    <div class="drawer-header">
      <h2>{{ t('drawer.addProduct') }}</h2>
    </div>
    <div class="drawer-body">
      <div class="section-title-row">
        <span class="section-title">{{ t('drawer.productImage') }}</span>
        <el-button
          class="help-btn"
          type="info"
          circle
          size="small"
          @click="showTip = !showTip"
        >
          <el-icon><i class="el-icon-question" /></el-icon>
        </el-button>
      </div>
      <el-tooltip
        v-if="showTip"
        effect="light"
        placement="bottom"
        :show-after="0"
        :hide-after="100"
        :visible="true"
        :popper-style="{maxWidth: '400px', whiteSpace: 'normal', lineHeight: '1.2'}"
      >
        <template #content>
          <div class="section-desc">
            {{ t('drawer.imageTip') }}
          </div>
        </template>
        <span></span>
      </el-tooltip>
    
      <div class="platform-img-row">
        <div
          class="platform-img-block"
          v-for="platform in platforms"
          :key="platform.key"
        >
          <div class="platform-label">{{ platform.label }}</div>
          <el-upload
            class="img-uploader"
            drag
            :show-file-list="false"
            :on-change="(file: any) => handleImageChange(file, platform.key)"
            :before-upload="() => false"
          >
            <div v-if="!form[platform.imgField]" class="img-upload-placeholder">
              <el-icon><i class="el-icon-picture" /></el-icon>
              <div>{{ t('drawer.addPreview') }}</div>
            </div>
            <img v-else :src="form[platform.imgField]" class="img-preview" />
          </el-upload>
        </div>
      </div>
      <div class="custom-form">
        <div
          v-for="item in inputItems"
          :key="item.key"
          class="custom-form-item"
          :style="item.key === 'trialLasts' || item.key === 'price' ? 'display: flex; align-items: center;' : ''"
        >
          <label
            :class="['custom-label', { active: isActive(item.key) || form[item.key] }]"
            >{{ t(item.labelKey) }}</label
          >
          <input
            :type="item.type || 'text'"
            v-model="form[item.key]"
            :placeholder="item.placeholder"
            class="custom-input"
            @focus="activeInput = item.key"
            @blur="activeInput = ''"
            autocomplete="off"
            :style="item.key === 'trialLasts' || item.key === 'price' ? 'flex: 1;' : ''"
            :data-short-underline="item.key === 'trialLasts' || item.key === 'price' ? true : null"
          />
          <span
            v-if="item.key === 'trialLasts'"
            style="margin-left: 8px; color: var(--color-muted); font-size: 1.1rem; margin-top: 10px;"
            >{{ t('products.hours') }}</span
          >
          <span
            v-if="item.key === 'price'"
            style="margin-left: 8px; color: var(--color-muted); font-size: 1.1rem; margin-top: 10px;"
            >USD</span
          >
          <div
            v-if="item.tipKey && activeInput === item.key"
            class="custom-tip-right"
          >
            {{ t(item.tipKey) }}
          </div>
        </div>
      </div>
    </div>
    <div class="drawer-footer">
      <el-checkbox v-model="checked" class="footer-checkbox">
        <el-tooltip
          effect="dark"
          placement="top"
          :content="t('drawer.agreement')"
          :show-after="200"
          :hide-after="100"
          :popper-style="{maxWidth: '400px', whiteSpace: 'normal', lineHeight: '1.2'}"
        >
          <span class="footer-checkbox-text" style="cursor: pointer;">
            {{ t('drawer.agree') }}
          </span>
        </el-tooltip>
      </el-checkbox>
      <el-button
        type="success"
        class="create-btn"
        size="large"
        :disabled="!checked || loading"
        @click="props.product ? handleSave() : handleCreate()"
      >
        {{ props.product ? t('common.save') : t('drawer.createProduct') }}
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineExpose, defineProps, watch } from "vue";
import { createProduct, updateProduct, type Product, uploadProductImage } from '@/api/products'
import { ElMessage } from 'element-plus'
import { defineEmits } from 'vue'
import type { ApiResponse } from '@/types/api';
import { useI18n, type MessageKey } from '@/i18n'

const props = defineProps<{ product?: Product | null }>()

const showTip = ref(false);
const activeInput = ref("");

const platforms = [{ key: "garmin", label: "Garmin", imgField: "garminImg" }];

interface AddProductForm {
  garminImg: string;
  name: string;
  description: string;
  price: string;
  garminUrl: string;
  trialLasts: string;
  [key: string]: any;
}

const form = ref<AddProductForm>({
  garminImg: "",
  name: "",
  description: "",
  price: "",
  garminUrl: "",
  trialLasts: "",
});

const checked = ref(false);

const loading = ref(false);
const emits = defineEmits(['close'])
const { t } = useI18n()

const inputItems: Array<{
  key: string
  labelKey: MessageKey
  placeholder: string
  type?: string
  tipKey?: MessageKey
}> = [
  {
    key: "name",
    labelKey: "drawer.nameOfProduct",
    placeholder: "",
    type: "text",
    tipKey: "drawer.nameTip",
  },
  { key: "description", labelKey: "drawer.productDescription", placeholder: "" },
  {
    key: "price",
    labelKey: "drawer.productPrice",
    placeholder: "",
    type: "text",
    tipKey: "drawer.priceTip",
  },
  {
    key: "garminUrl",
    labelKey: "drawer.garminUrl",
    placeholder: "",
    type: "text",
    tipKey: "drawer.garminUrlTip",
  },
  {
    key: "trialLasts",
    labelKey: "drawer.trialLasts",
    placeholder: "",
    type: "text",
    tipKey: "drawer.trialTip",
  },
  {
    key: "contactUrl",
    labelKey: "drawer.contactPage",
    placeholder: "",
    type: "text",
  },
];

function handleImageChange(file: any, key: string) {
  if (!file || !file.raw) return;
  loading.value = true;
  uploadProductImage(file.raw, 'hero', file.raw.type.split('/')[1] || 'png')
    .then((res: any) => {
      if (res.code === 0 && res.data) {
        form.value[`${key}Img`] = res.data;
        ElMessage.success(t('drawer.uploadSuccess'));
      } else {
        ElMessage.error(res.msg || t('drawer.uploadFailed'));
      }
    })
    .catch(() => {
      ElMessage.error(t('drawer.uploadFailed'));
    })
    .finally(() => {
      loading.value = false;
    });
}

function isActive(key: string) {
  return activeInput.value === key;
}

function validateForm() {
  if (!form.value.name.trim()) {
    ElMessage.error(t('drawer.productNameRequired'));
    return false;
  }
  if (!form.value.description.trim()) {
    ElMessage.error(t('drawer.productDescRequired'));
    return false;
  }
  if (form.value.price && isNaN(Number(form.value.price))) {
    ElMessage.error(t('drawer.priceNumber'));
    return false;
  }
  if (form.value.trialLasts && isNaN(Number(form.value.trialLasts))) {
    ElMessage.error(t('drawer.trialNumber'));
    return false;
  }
  return true;
}

async function handleCreate() {
  if (!checked.value) {
    ElMessage.error(t('drawer.mustAgree'));
    return;
  }
  if (!validateForm()) return;
  loading.value = true;
  try {
    const payload = {
      name: form.value.name.trim(),
      description: form.value.description.trim(),
      garminImageUrl: form.value.garminImg || '',
      garminStoreUrl: form.value.garminUrl || '',
      trialLasts: form.value.trialLasts ? Number(form.value.trialLasts) : 0,
      price: form.value.price ? Number(form.value.price) : 0,
    };
    const res: ApiResponse<Product> = await createProduct(payload);
    if (res.code === 0) {
      ElMessage.success(t('drawer.productCreated'));
      emits('close');
    } else {
      ElMessage.error(res.msg || t('drawer.createFailed'));
    }
  } catch (e: any) {
    ElMessage.error(e?.msg || t('drawer.createFailed'));
  } finally {
    loading.value = false;
  }
}

function resetForm() {
  form.value = {
    garminImg: "",
    name: "",
    description: "",
    price: "",
    garminUrl: "",
    trialLasts: "",
  };
  checked.value = false;
  // 其他需要重置的状态
}

function setForm(product: Product) {
  form.value = {
    garminImg: product.garminImageUrl || "",
    name: product.name || "",
    description: product.description || "",
    price: product.price != null ? String(product.price) : "",
    garminUrl: product.garminStoreUrl || "",
    trialLasts: product.trialLasts != null ? String(product.trialLasts) : "",
    contactUrl: product.appId != null ? "https://wristo.io/contact/" +  product.appId : ""
  };
  checked.value = true;
}

defineExpose({ resetForm, setForm });

// 监听 prop product 变化自动填充
watch(() => props.product, (val) => {
  if (val) setForm(val);
  else resetForm();
});

// const productDrawerVisible = ref(false)
// const currentProduct = ref<Product | null>(null)

// const handleProductClick = async (appId: number) => {
//   const res = await getProduct(appId)
//   if (res.code === 0 && res.data) {
//     currentProduct.value = res.data
//     productDrawerVisible.value = true
//   }
// }

async function handleSave() {
  if (!props.product) return
  if (!validateForm()) return
  loading.value = true
  try {
    const payload = {
      name: form.value.name.trim(),
      description: form.value.description.trim(),
      garminImageUrl: form.value.garminImg || '',
      garminStoreUrl: form.value.garminUrl || '',
      trialLasts: form.value.trialLasts ? Number(form.value.trialLasts) : 0,
      price: form.value.price ? Number(form.value.price) : 0,
    }
    const res = await updateProduct(props.product.appId, payload)
    if (res.code === 0) {
      ElMessage.success(t('drawer.productUpdated'))
      emits('close')
    } else {
      ElMessage.error(res.msg || t('drawer.updateFailed'))
    }
  } catch (e: any) {
    ElMessage.error(e?.msg || t('drawer.updateFailed'))
  } finally {
    loading.value = false
  }
}

</script>

<style scoped>
.add-product-drawer {
  background: var(--color-surface);
  min-height: 100vh;
  padding: 0;
  display: flex;
  flex-direction: column;
  height: 100vh;
  height: 100dvh;
  border-radius: 12px 0 0 12px;
  box-shadow: var(--shadow-md);
}

.drawer-header {
  background: var(--color-brand);
  color: var(--color-surface);
  padding: 36px 0 24px 0;
  text-align: center;
}

.drawer-header h2 {
  font-size: 2.4rem;
  font-weight: 400;
  margin: 0;
  letter-spacing: 1px;
}

.drawer-body {
  padding: 36px 32px 0 32px;
  flex: 1 1 auto;
  overflow-y: auto;
}

.section-title-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.section-title {
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 0;
  color: var(--color-ink);
}

.section-desc {
  color: var(--color-muted);
  font-size: 1rem;
  margin-bottom: 12px;
  line-height: 1.2;
  text-align: center;
}

.platform-img-row {
  display: flex;
  gap: 18px;
  margin-bottom: 24px;
}

.platform-img-block {
  flex: 1;
  text-align: center;
}

.platform-label {
  font-size: 1.1rem;
  font-weight: bold;
  margin-bottom: 8px;
  color: var(--color-ink);
}

.img-uploader {
  width: 120px;
  height: 120px;
  border: 2px dashed var(--color-subtle);
  border-radius: 10px;
  background: var(--color-surface-soft);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  margin-bottom: 8px;
  transition: border-color 0.2s;
  position: relative;
  overflow: hidden;
}

.img-uploader:hover {
  border-color: var(--color-brand);
}

.img-upload-placeholder {
  color: var(--color-subtle);
  font-size: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.img-preview {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  display: block;
  margin: auto;
}

.custom-form {
  margin-top: 18px;
}

.custom-form-item {
  position: relative;
  margin-bottom: 32px;
}

.custom-label {
  position: absolute;
  left: 0px;
  top: 18px;
  font-size: 1.1rem;
  color: var(--color-subtle);
  pointer-events: none;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  font-weight: 500;
}

.custom-label.active {
  top: -14px;
  left: -4px;
  font-size: 0.98rem;
  color: var(--color-brand);
  background: var(--color-surface);
  padding: 0 4px;
  font-weight: 600;
}

.custom-input {
  width: 100%;
  border: none;
  border-bottom: 2px solid var(--color-line);
  outline: none;
  font-size: 1.15rem;
  padding: 18px 0 6px 0;
  background: transparent;
  color: var(--color-ink);
  transition: border-color 0.2s, border-width 0.2s;
}

.custom-input:focus {
  border-bottom: 3px solid var(--color-brand);
}

.custom-textarea {
  resize: none;
  min-height: 48px;
}

.custom-tip-right {
  position: absolute;
  top: 0;
  right: 0;
  transform: translateY(-110%);
  background: var(--color-ink);
  color: var(--color-surface);
  font-size: 1.05rem;
  border-radius: 8px;
  padding: 12px 18px;
  min-width: 260px;
  max-width: 340px;
  z-index: 10;
  text-align: left;
  box-shadow: var(--shadow-md);
  line-height: 1.5;
  font-weight: 500;
  pointer-events: none;
  white-space: normal;
}

.drawer-footer {
  padding: 12px 32px 24px 32px;
  background: var(--color-surface);
  box-shadow: var(--shadow-sm);
  display: flex;
  flex-direction: column;
  gap: 24px;
  border-radius: 0 0 0 12px;
}

.footer-checkbox {
  align-items: flex-start;
  margin-bottom: 0;
  display: flex;
  align-items: center;
}

.footer-checkbox-text {
  font-size: 1.15rem;
  color: var(--color-ink);
  line-height: 1.2;
  word-break: break-word;
  white-space: normal;
  overflow-x: hidden;
}

.create-btn {
  width: 100%;
  height: 48px;
  font-size: 1.3rem;
  font-weight: bold;
  letter-spacing: 1px;
  background: var(--color-brand);
  border: none;
  border-radius: 6px;
  color: var(--color-surface);
  box-shadow: var(--shadow-sm);
  transition: background 0.2s;
}

.create-btn:disabled {
  background: var(--color-brand-soft);
  color: var(--color-surface);
  cursor: not-allowed;
}

.help-btn {
  padding: 0;
  width: 28px;
  height: 28px;
  min-width: 28px;
  min-height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-surface-soft);
  border-radius: 50%;
  border: none;
  color: var(--color-brand);
  transition: background 0.2s;
}

.help-btn:hover {
  background: var(--color-brand-soft);
  color: var(--color-brand);
}

:deep(.el-upload-dragger) {
  all: unset !important;
  /* 你可以在这里添加自己的样式 */
}

/* 针对 trialLasts 和 price，缩短下划线宽度 */
input[data-short-underline] {
  width: 80px !important;
  min-width: 0;
  display: inline-block;
}

@media (max-width: 640px) {
  .add-product-drawer {
    min-height: 100dvh;
    height: 100dvh;
    border-radius: 0;
    box-shadow: none;
  }

  .drawer-header {
    padding: 22px 18px 16px;
  }

  .drawer-header h2 {
    font-size: 1.7rem;
    font-weight: 650;
  }

  .drawer-body {
    padding: 24px 18px 0;
  }

  .platform-img-row {
    flex-direction: column;
    gap: 14px;
  }

  .img-uploader {
    width: min(160px, 52vw);
    height: min(160px, 52vw);
  }

  .custom-form-item {
    margin-bottom: 28px;
  }

  .custom-label {
    max-width: calc(100% - 8px);
    font-size: 1rem;
  }

  .custom-input {
    font-size: 1rem;
  }

  .custom-tip-right {
    position: static;
    transform: none;
    min-width: 0;
    max-width: 100%;
    margin-top: 8px;
    font-size: 0.9rem;
    padding: 10px 12px;
  }

  .drawer-footer {
    padding: 12px 18px max(18px, env(safe-area-inset-bottom));
    border-radius: 0;
    gap: 14px;
  }

  .footer-checkbox-text {
    font-size: 0.95rem;
  }

  .create-btn {
    height: 46px;
    font-size: 1rem;
    letter-spacing: 0;
  }
}
</style>

<style>
.el-drawer {
  --el-drawer-padding-primary: 0 !important;
}
.el-upload-dragger {
  border: none !important;
}
</style>
