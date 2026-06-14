<template>
  <div class="add-bundle-drawer">
    <div class="drawer-header">
      <h2>{{ props.bundle ? t('bundle.edit') : t('bundle.add') }}</h2>
    </div>
    <div class="drawer-body">
      <!-- 套餐信息 -->
      <div class="custom-form">
        <div class="custom-form-item">
          <label
            :class="['custom-label', { active: isActive('bundleName') || form.bundleName }]"
          >{{ t('bundle.name') }}</label>
          <input
            type="text"
            v-model="form.bundleName"
            placeholder=""
            class="custom-input"
            @focus="activeInput = 'bundleName'"
            @blur="activeInput = ''"
            autocomplete="off"
          />
        </div>
        <div class="custom-form-item">
          <label
            :class="['custom-label', { active: isActive('bundleDesc') || form.bundleDesc }]"
          >{{ t('bundle.description') }}</label>
          <textarea
            v-model="form.bundleDesc"
            placeholder=""
            class="custom-input"
            @focus="activeInput = 'bundleDesc'"
            @blur="activeInput = ''"
            rows="3"
          ></textarea>
        </div>
        <div class="custom-form-item" style="display: flex; align-items: center;">
          <label
            :class="['custom-label', { active: isActive('price') || form.price }]"
          >{{ t('bundle.price') }}</label>
          <input
            type="text"
            v-model="form.price"
            placeholder=""
            class="custom-input"
            @focus="activeInput = 'price'"
            @blur="activeInput = ''"
            autocomplete="off"
            style="flex: 1;"
          />
          <span style="margin-left: 8px; color: var(--color-muted); font-size: 1.1rem; margin-top: 10px;">USD</span>
        </div>
        <div class="custom-form-item" v-if="props.bundle?.bundleId">
          <label class="custom-label active">{{ t('bundle.url') }}</label>
          <div class="bundle-url-display">
            <span class="bundle-url-text">https://www.wristo.io/bundle/{{ props.bundle.bundleId }}</span>
            <button 
              type="button" 
              class="copy-url-btn" 
              @click="copyBundleUrl"
              :title="t('bundle.copyUrl')"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
      <!-- 产品选择器 -->
      <div class="product-selector">
        <div class="selector-header">
          <div>
            <div class="selector-title">{{ t('bundle.selectProducts') }}</div>
            <div class="selector-summary">
              已选 {{ allSelectedIds.length }} / {{ products.length }}
            </div>
          </div>
          <a class="change-order" @click="handleChangeOrder">{{ t('bundle.changeOrder') }}</a>
        </div>
        <div class="selector-search">
          <input
            v-model="productSearchKeyword"
            class="selector-search-input"
            type="search"
            placeholder="按商品名称或 appId 搜索"
            autocomplete="off"
          />
        </div>
        <div class="selector-list">
          <div class="selector-item" @click="toggleSelectAll">
            <span :class="['selector-checkbox', isAllSelected ? 'checked' : '']"></span>
            <span class="selector-product-main">
              <span class="selector-label">{{ t('bundle.selectAll') }}</span>
              <span class="selector-meta">当前筛选可选 {{ selectableFilteredProducts.length }} 个</span>
            </span>
          </div>
          <div
            class="selector-item"
            v-for="product in filteredProducts"
            :key="product.appId"
            :class="historySelectedIds.includes(product.appId) ? 'selector-item-disabled' : ''"
            @click="
              historySelectedIds.includes(product.appId)
                ? null
                : (selectedProductIds.includes(product.appId)
                    ? removeSelected(product.appId)
                    : toggleProduct(product.appId))
            "
          >
            <span
              :class="['selector-checkbox',
                selectedProductIds.includes(product.appId) || historySelectedIds.includes(product.appId) ? 'checked' : '',
                historySelectedIds.includes(product.appId) ? 'selector-checkbox-disabled' : '']"
            ></span>
            <span
              :class="['selector-label', historySelectedIds.includes(product.appId) ? 'selector-label-disabled' : '']"
            >
              <span class="selector-product-main">
                <span class="selector-product-name">{{ product.name }}</span>
              </span>
              <span class="selector-app-id">#{{ product.appId }}</span>
            </span>
          </div>
          <div v-if="filteredProducts.length === 0" class="selector-empty">
            没有匹配的商品
          </div>
        </div>
      </div>
    </div>
    <div class="drawer-footer">
      <el-button
        type="success"
        class="create-btn"
        size="large"
        :disabled="loading"
        @click="props.bundle ? handleSave() : handleCreate()"
      >
        {{ props.bundle ? t('common.save') : t('bundle.create') }}
      </el-button>
    </div>
    <el-dialog v-model="orderDialogVisible" width="700px" append-to-body class="sort-order-dialog" :show-close="true" :close-on-click-modal="false">
      <template #header>
        <div class="sort-dialog-header">
          <div class="sort-dialog-title">{{ t('bundle.manageOrder') }}</div>
        </div>
      </template>
      <div class="sort-dialog-desc">
        {{ t('bundle.orderDesc') }}
      </div>
      <draggable
        v-model="orderDialogIds"
        item-key="appId"
        ghost-class="drag-ghost"
        chosen-class="drag-chosen"
        animation="200"
        :force-fallback="true"
        :class="['order-list']"
      >
        <template #item="{ element }">
          <div class="order-item">
            <span class="order-label">{{ products.find(p => p.appId === element)?.name }}</span>
          </div>
        </template>
      </draggable>
      <template #footer>
        <div class="sort-dialog-footer">
          <el-button class="save-btn" type="success" @click="saveOrder">{{ t('common.save') }}</el-button>
          <el-button class="cancel-btn" @click="orderDialogVisible = false">{{ t('common.cancel') }}</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
// 1. 引入依赖
import { ref, defineExpose, defineProps, watch, computed, onMounted } from 'vue'
import { createBundle, updateBundle, type Bundle } from '@/api/bundles'
import { fetchAllProducts, type Product } from '@/api/products'
import { ElMessage } from 'element-plus'
import { defineEmits } from 'vue'
import draggable from 'vuedraggable'
import { useI18n } from '@/i18n'

// 2. props/emit 定义
const props = defineProps<{ bundle?: Bundle | null }>()
const emits = defineEmits(['close'])
const { t } = useI18n()
const CUSTOM_BUNDLE_DEFAULT_PRICE = '6.99'

// 3. ref/reactive/变量定义
const activeInput = ref('')
const loading = ref(false)

interface AddBundleForm {
  bundleName: string
  bundleDesc: string
  price: string
}

const form = ref<AddBundleForm>({
  bundleName: '',
  bundleDesc: '',
  price: CUSTOM_BUNDLE_DEFAULT_PRICE,
})

const products = ref<Product[]>([])
const selectedProductIds = ref<number[]>([])
const historySelectedIds = ref<number[]>([])
const orderDialogVisible = ref(false)
const orderDialogIds = ref<number[]>([])
const productSearchKeyword = ref('')

// 4. computed 计算属性
const isAllSelected = computed(() =>
  products.value.length > 0 &&
  selectableFilteredProducts.value.length > 0 &&
  selectableFilteredProducts.value.every(p => selectedProductIds.value.includes(p.appId))
)

const filteredProducts = computed(() => {
  const keyword = productSearchKeyword.value.trim().toLowerCase()
  if (!keyword) return products.value
  return products.value.filter(product => {
    const name = product.name?.toLowerCase() || ''
    return name.includes(keyword) || String(product.appId).includes(keyword)
  })
})

const selectableFilteredProducts = computed(() =>
  filteredProducts.value.filter(p => !historySelectedIds.value.includes(p.appId))
)

const allSelectedIds = computed({
  get() {
    return [...historySelectedIds.value, ...selectedProductIds.value]
  },
  set(newArr: number[]) {
    // 拖拽后同步拆分
    const newHistory: number[] = []
    const newSelected: number[] = []
    for (const id of newArr) {
      if (historySelectedIds.value.includes(id)) newHistory.push(id)
      else newSelected.push(id)
    }
    historySelectedIds.value = newHistory
    selectedProductIds.value = newSelected
  }
})

// 5. 生命周期
onMounted(getAllProducts)

// 6. watch 监听
watch(() => props.bundle, async (val) => {
  if (val) setForm(val)
  else resetForm()
})

// 7. 方法函数定义
function isActive(key: string) {
  return activeInput.value === key
}

function validateForm() {
  if (!form.value.bundleName.trim()) {
    ElMessage.error(t('bundle.nameRequired'))
    return false
  }
  if (!form.value.bundleDesc.trim()) {
    ElMessage.error(t('bundle.descRequired'))
    return false
  }
  return true
}

async function getAllProducts() {
  // 拉取所有产品，假设产品总数不会太大
  const res = await fetchAllProducts()
  if (res.code === 0 && res.data) {
    products.value = res.data
  } else {
    products.value = []
  }
}

function toggleProduct(appId: number) {
  if (!selectedProductIds.value.includes(appId) && !historySelectedIds.value.includes(appId)) {
    selectedProductIds.value.push(appId)
  }
}

function toggleSelectAll() {
  if (!isAllSelected.value) {
    const filteredIds = selectableFilteredProducts.value.map(p => p.appId)
    selectedProductIds.value = Array.from(new Set([...selectedProductIds.value, ...filteredIds]))
  } else {
    const filteredIdSet = new Set(selectableFilteredProducts.value.map(p => p.appId))
    selectedProductIds.value = selectedProductIds.value.filter(id => !filteredIdSet.has(id))
  }
}

function handleChangeOrder() {
  // 打开排序弹窗，初始化顺序为当前所有已选
  orderDialogIds.value = allSelectedIds.value.slice()
  orderDialogVisible.value = true
}

function saveOrder() {
  // 拖拽后保存顺序，拆分历史和新选
  const newHistory: number[] = []
  const newSelected: number[] = []
  for (const id of orderDialogIds.value) {
    if (historySelectedIds.value.includes(id)) newHistory.push(id)
    else newSelected.push(id)
  }
  historySelectedIds.value = newHistory
  selectedProductIds.value = newSelected
  orderDialogVisible.value = false
}

async function handleCreate() {
  if (!validateForm()) return
  loading.value = true
  try {
    const payload = {
      bundleName: form.value.bundleName.trim(),
      bundleDesc: form.value.bundleDesc.trim(),
      price: Number(form.value.price),
      appIds: selectedProductIds.value.slice(),
    }
    const res = await createBundle(payload)
    if (res.code === 0) {
      ElMessage.success(t('bundle.created'))
      emits('close')
    } else {
      ElMessage.error(res.msg || t('drawer.createFailed'))
    }
  } catch (e: any) {
    ElMessage.error(e?.msg || t('drawer.createFailed'))
  } finally {
    loading.value = false
  }
}

async function handleSave() {
  if (!validateForm()) return
  loading.value = true
  try {
    const payload = {
      bundleName: form.value.bundleName.trim(),
      bundleDesc: form.value.bundleDesc.trim(),
      price: Number(form.value.price),
      appIds: [...historySelectedIds.value, ...selectedProductIds.value],
    }
    const res = await updateBundle(payload, props.bundle?.bundleId || 0)
    if (res.code === 0) {
      ElMessage.success(t('bundle.updated'))
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

function setForm(bundle: Bundle) {
  form.value.bundleName = bundle.bundleName || ''
  form.value.bundleDesc = bundle.bundleDesc || ''
  form.value.price = bundle.price !== undefined && bundle.price !== null ? String(bundle.price) : ''
  const ids = Array.isArray(bundle.products) ? bundle.products.map(p => p.appId) : []
  historySelectedIds.value = ids.slice()
  selectedProductIds.value = []
  productSearchKeyword.value = ''
}

function resetForm() {
  form.value.bundleName = ''
  form.value.bundleDesc = ''
  form.value.price = CUSTOM_BUNDLE_DEFAULT_PRICE
  selectedProductIds.value = []
  historySelectedIds.value = []
  productSearchKeyword.value = ''
}

function removeSelected(appId: number) {
  // 只允许移除新选中的
  const idx = selectedProductIds.value.indexOf(appId)
  if (idx !== -1) selectedProductIds.value.splice(idx, 1)
}

function copyBundleUrl() {
  if (props.bundle?.bundleId) {
    const url = `https://www.wristo.io/bundle/${props.bundle.bundleId}`
    navigator.clipboard.writeText(url).then(() => {
      ElMessage.success(t('bundle.copySuccess'))
    }).catch(() => {
      ElMessage.error(t('bundle.copyFailed'))
    })
  }
}

// 8. defineExpose

defineExpose({ setForm, resetForm })

</script>

<style>
.el-dialog {
  --el-dialog-padding-primary: 0;
}
</style>
<style scoped>
.add-bundle-drawer {
  background: var(--color-canvas);
  min-height: 100vh;
  padding: 0;
  display: flex;
  flex-direction: column;
  height: 100vh;
  border-radius: 12px 0 0 12px;
  box-shadow: var(--shadow-md);
}
.drawer-header {
  background: linear-gradient(135deg, var(--color-brand-strong) 0%, var(--color-brand) 100%);
  color: var(--color-surface);
  padding: 28px 32px 18px;
  text-align: left;
}
.drawer-header h2 {
  font-size: 28px;
  font-weight: 700;
  margin: 0;
  letter-spacing: 0;
}
.drawer-body {
  padding: 28px 28px 0;
  flex: 1 1 auto;
  overflow-y: auto;
}
.custom-form {
  margin-top: 10px;
  padding: 24px 24px 4px;
  border: 1px solid var(--color-line);
  border-radius: 8px;
  background: var(--color-surface);
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
.drawer-footer {
  padding: 20px 28px 24px;
  background: var(--color-surface) !important;
  box-shadow: var(--shadow-sm);
  display: flex;
  flex-direction: column;
  gap: 24px;
  border-radius: 0 0 0 12px;
}
.create-btn {
  width: 100%;
  height: 48px;
  font-size: 1.3rem;
  font-weight: bold;
  letter-spacing: 1px;
  background: var(--color-brand) !important;
  border: none !important;
  border-radius: 6px;
  color: var(--color-surface) !important;
  box-shadow: var(--shadow-sm);
  transition: background 0.2s;
}
.create-btn:hover,
.create-btn:focus {
  background: var(--color-brand-strong) !important;
  color: var(--color-surface) !important;
}
.create-btn:disabled {
  background: var(--color-brand-soft) !important;
  color: var(--color-surface) !important;
  cursor: not-allowed;
}
.product-selector {
  margin: 20px 0 28px;
  padding: 20px;
  border: 1px solid var(--color-line);
  border-radius: 8px;
  background: var(--color-surface);
}
.selector-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 14px;
  text-align: left;
}
.selector-title {
  color: var(--color-ink);
  font-size: 18px;
  font-weight: 800;
  line-height: 1.25;
}
.selector-summary {
  margin-top: 4px;
  color: var(--color-muted);
  font-size: 13px;
  line-height: 1.4;
}
.change-order {
  color: var(--color-brand);
  cursor: pointer;
  flex: 0 0 auto;
  font-size: 14px;
  font-weight: 700;
  line-height: 32px;
  text-decoration: none;
}
.change-order:hover {
  color: var(--color-brand-strong);
}
.selector-search {
  margin-bottom: 12px;
}
.selector-search-input {
  width: 100%;
  min-height: 44px;
  border: 1px solid var(--color-line);
  border-radius: 8px;
  background: var(--color-surface-soft);
  color: var(--color-ink);
  font-size: 15px;
  outline: none;
  padding: 0 14px;
  transition: border-color 160ms ease, box-shadow 160ms ease, background 160ms ease;
}
.selector-search-input:focus {
  border-color: var(--color-brand);
  background: var(--color-surface);
  box-shadow: 0 0 0 3px rgba(15, 107, 104, 0.14);
}
.selector-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-height: 360px;
  overflow-y: auto;
  padding-right: 2px;
}
.selector-item {
  display: flex;
  align-items: center;
  gap: 12px;
  min-height: 56px;
  padding: 10px 12px;
  border: 1px solid var(--color-line);
  border-radius: 8px;
  background: var(--color-surface);
  cursor: pointer;
  font-size: 14px;
  margin-bottom: 0;
  transition: border-color 160ms ease, background 160ms ease, box-shadow 160ms ease;
}
.selector-item:hover {
  border-color: rgba(15, 107, 104, 0.28);
  background: var(--color-surface-soft);
  box-shadow: var(--shadow-sm);
}
.selector-checkbox {
  flex: 0 0 auto;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  border: 2px solid var(--color-subtle);
  margin-right: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-surface);
  transition: border-color 0.2s;
  position: relative;
}
.selector-checkbox.checked {
  background: var(--color-brand);
  border-color: var(--color-brand);
}
.selector-checkbox.checked::after {
  content: '';
  display: block;
  width: 11px;
  height: 6px;
  border-left: 2px solid var(--color-surface);
  border-bottom: 2px solid var(--color-surface);
  transform: rotate(-45deg);
  position: absolute;
  left: 4px;
  top: 5px;
}
.selector-label {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  min-width: 0;
  flex: 1;
  color: var(--color-ink);
}
.selector-product-main {
  display: flex;
  flex-direction: column;
  gap: 3px;
  min-width: 0;
  text-align: left;
}
.selector-product-name {
  overflow: hidden;
  color: var(--color-ink);
  font-size: 15px;
  font-weight: 700;
  line-height: 1.3;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.selector-meta {
  color: var(--color-muted);
  font-size: 12px;
  line-height: 1.2;
}
.selector-app-id {
  flex: 0 0 auto;
  min-width: 64px;
  padding: 4px 8px;
  border-radius: 999px;
  background: var(--color-brand-soft);
  color: var(--color-brand-strong);
  font-size: 12px;
  font-weight: 800;
  line-height: 1.2;
  text-align: center;
}
.selector-item-disabled {
  opacity: 0.5;
  pointer-events: none;
}
.selector-checkbox-disabled {
  background: var(--color-brand) !important;
  border-color: var(--color-brand) !important;
}
.selector-label-disabled {
  color: var(--color-subtle) !important;
}
.selector-empty {
  padding: 18px 12px;
  border: 1px dashed var(--color-line);
  border-radius: 8px;
  color: var(--color-muted);
  font-size: 14px;
  text-align: center;
}
.selector-history-title {
  font-size: 16px;
  color: var(--color-muted);
  margin: 18px 0 8px 0;
  font-weight: 500;
}
.drag-ghost {
  opacity: 0.5;
  background: var(--color-canvas);
}
.drag-chosen {
  background: var(--color-brand-soft);
}

.sort-order-dialog >>> .el-dialog__header {
  padding: 0;
  background: var(--color-brand);
  border-radius: 8px 8px 0 0;
}
.sort-dialog-header {
  background: var(--color-brand);
  padding: 24px 32px 16px 32px;
  border-radius: 8px 8px 0 0;
}
.sort-dialog-title {
  color: var(--color-surface);
  font-size: 2rem;
  font-weight: 600;
  letter-spacing: 1px;
  border-radius: 8px 8px 0 0;
}
.sort-dialog-desc {
  font-size: 1.15rem;
  color: var(--color-muted);
  margin: 32px 0 32px 0;
  padding: 0 16px;
  text-align: left;
}
.sort-dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 24px;
  padding: 0 8px 8px 8px;
}
.order-list {
  padding: 0 32px;
}
.order-item {
  background: var(--color-surface-soft);
  border-radius: 4px;
  margin-bottom: 8px;
  padding: 8px 24px;
  font-size: 1.18rem;
  font-weight: 500;
  color: var(--color-ink);
  cursor: grab;
  transition: box-shadow 0.2s;
  box-shadow: var(--shadow-sm);
}
.order-label {
  flex: 1;
  color: var(--color-ink);
  font-weight: 500;
}
.save-btn {
  background: var(--color-brand);
  color: var(--color-surface);
  font-weight: 600;
  min-width: 120px;
  font-size: 1.1rem;
  border-radius: 4px;
  border: none;
}
.save-btn:hover {
  background: var(--color-brand-strong);
}
.cancel-btn {
  color: var(--color-danger);
  background: transparent;
  border: none;
  font-weight: 600;
  min-width: 90px;
  font-size: 1.1rem;
}
.cancel-btn:hover {
  color: var(--color-danger);
  background: var(--color-danger-soft);
}
.bundle-url-display {
  display: flex;
  align-items: center;
  background: var(--color-surface-soft);
  border: 1px solid var(--color-line);
  border-radius: 6px;
  padding: 12px 16px;
  margin-top: 8px;
  gap: 12px;
}
.bundle-url-text {
  flex: 1;
  font-size: 1.1rem;
  color: var(--color-brand);
  font-weight: 500;
  word-break: break-all;
}
.copy-url-btn {
  background: var(--color-brand);
  color: var(--color-surface);
  border: none;
  border-radius: 4px;
  padding: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
  min-width: 32px;
  height: 32px;
}
.copy-url-btn:hover {
  background: var(--color-brand-strong);
}
.copy-url-btn svg {
  width: 16px;
  height: 16px;
}
</style>
