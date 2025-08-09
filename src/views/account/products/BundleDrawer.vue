<template>
  <div class="add-bundle-drawer">
    <div class="drawer-header">
      <h2>{{ props.bundle ? 'Edit Bundle' : 'Add New Bundle' }}</h2>
    </div>
    <div class="drawer-body">
      <!-- 套餐信息 -->
      <div class="custom-form">
        <div class="custom-form-item">
          <label
            :class="['custom-label', { active: isActive('bundleName') || form.bundleName }]"
          >Bundle Name</label>
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
          >Bundle Description</label>
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
          >Price</label>
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
          <span style="margin-left: 8px; color: #888; font-size: 1.1rem; margin-top: 10px;">USD</span>
        </div>
      </div>
      <!-- 产品选择器 -->
      <div class="product-selector">
        <div class="selector-header">
          <span>Select Products Included</span>
          <a class="change-order" @click="handleChangeOrder">Change Order</a>
        </div>
        <div class="selector-list">
          <div class="selector-item" @click="toggleSelectAll">
            <span :class="['selector-checkbox', isAllSelected ? 'checked' : '']"></span>
            <span class="selector-label">Select All</span>
          </div>
          <div
            class="selector-item"
            v-for="product in products"
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
            >{{ product.name }}</span>
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
        {{ props.bundle ? 'Save' : 'CREATE BUNDLE' }}
      </el-button>
    </div>
    <el-dialog v-model="orderDialogVisible" width="700px" append-to-body class="sort-order-dialog" :show-close="true" :close-on-click-modal="false">
      <template #header>
        <div class="sort-dialog-header">
          <div class="sort-dialog-title">Manage App Sort Order</div>
        </div>
      </template>
      <div class="sort-dialog-desc">
        Change the order in which apps will be shown to your customers in the bundle overviews during purchase.
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
          <el-button class="save-btn" type="success" @click="saveOrder">SAVE</el-button>
          <el-button class="cancel-btn" @click="orderDialogVisible = false">CANCEL</el-button>
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

// 2. props/emit 定义
const props = defineProps<{ bundle?: Bundle | null }>()
const emits = defineEmits(['close'])

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
  price: '',
})

const products = ref<Product[]>([])
const selectedProductIds = ref<number[]>([])
const historySelectedIds = ref<number[]>([])
const orderDialogVisible = ref(false)
const orderDialogIds = ref<number[]>([])

// 4. computed 计算属性
const isAllSelected = computed(() =>
  products.value.length > 0 &&
  selectableProducts.value.length > 0 &&
  selectedProductIds.value.length === selectableProducts.value.length
)

const selectableProducts = computed(() =>
  products.value.filter(p => !historySelectedIds.value.includes(p.appId))
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
    ElMessage.error('Bundle name is required')
    return false
  }
  if (!form.value.bundleDesc.trim()) {
    ElMessage.error('Bundle description is required')
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
    selectedProductIds.value = selectableProducts.value.map(p => p.appId)
  } else {
    selectedProductIds.value = []
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
      ElMessage.success('Bundle created successfully')
      emits('close')
    } else {
      ElMessage.error(res.msg || 'Create failed')
    }
  } catch (e: any) {
    ElMessage.error(e?.msg || 'Create failed')
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
      ElMessage.success('Bundle updated successfully')
      emits('close')
    } else {
      ElMessage.error(res.msg || 'Update failed')
    }
  } catch (e: any) {
    ElMessage.error(e?.msg || 'Update failed')
  } finally {
    loading.value = false
  }
}

function setForm(bundle: Bundle) {
  form.value.bundleName = bundle.bundleName || ''
  form.value.bundleDesc = bundle.bundleDesc || ''
  form.value.price = bundle.price !== undefined && bundle.price !== null ? String(bundle.price) : ''
  const ids = Array.isArray(bundle.products) ? bundle.products.map(p => p.appId) : []
  selectedProductIds.value = ids.filter(id => !historySelectedIds.value.includes(id))
  historySelectedIds.value = ids.slice()
}

function resetForm() {
  form.value.bundleName = ''
  form.value.bundleDesc = ''
  form.value.price = ''
  selectedProductIds.value = []
  historySelectedIds.value = []
}

function removeSelected(appId: number) {
  // 只允许移除新选中的
  const idx = selectedProductIds.value.indexOf(appId)
  if (idx !== -1) selectedProductIds.value.splice(idx, 1)
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
  background: #fff;
  min-height: 100vh;
  padding: 0;
  display: flex;
  flex-direction: column;
  height: 100vh;
  border-radius: 12px 0 0 12px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
}
.drawer-header {
  background: #434a4f;
  color: #fff;
  padding: 24px 0 12px 0;
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
  color: #bbb;
  pointer-events: none;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  font-weight: 500;
}
.custom-label.active {
  top: -14px;
  left: -4px;
  font-size: 0.98rem;
  color: #19b36b;
  background: #fff;
  padding: 0 4px;
  font-weight: 600;
}
.custom-input {
  width: 100%;
  border: none;
  border-bottom: 2px solid #e0e0e0;
  outline: none;
  font-size: 1.15rem;
  padding: 18px 0 6px 0;
  background: transparent;
  color: #222;
  transition: border-color 0.2s, border-width 0.2s;
}
.custom-input:focus {
  border-bottom: 3px solid #19b36b;
}
.drawer-footer {
  padding: 32px 32px 24px 32px;
  background: #fff;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.04);
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
  background: #19b36b;
  border: none;
  border-radius: 6px;
  color: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: background 0.2s;
}
.create-btn:disabled {
  background: #b2dfc7;
  color: #fff;
  cursor: not-allowed;
}
.product-selector {
  margin: 32px 0;
}
.selector-header {
  font-size: 20px;
  margin-bottom: 16px;
  text-align: left;
}
.change-order {
  color: #19b36b;
  margin-left: 8px;
  cursor: pointer;
  font-size: 16px;
  text-decoration: underline;
}
.selector-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.selector-item {
  display: flex;
  align-items: center;
  cursor: pointer;
  font-size: 14px;
  margin-bottom: 4px;
}
.selector-checkbox {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 3px solid #bbb;
  margin-right: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
  transition: border-color 0.2s;
  position: relative;
}
.selector-checkbox.checked {
  background: #19b36b;
  border-color: #19b36b;
}
.selector-checkbox.checked::after {
  content: '';
  display: block;
  width: 14px;
  height: 8px;
  border-left: 3px solid #fff;
  border-bottom: 3px solid #fff;
  transform: rotate(-45deg);
  position: absolute;
  left: 4px;
  top: 4px;
}
.selector-label {
  font-size: 18px;
  color: #222;
}
.selector-item-disabled {
  opacity: 0.5;
  pointer-events: none;
}
.selector-checkbox-disabled {
  background: #19b36b !important;
  border-color: #19b36b !important;
}
.selector-label-disabled {
  color: #aaa !important;
}
.selector-history-title {
  font-size: 16px;
  color: #888;
  margin: 18px 0 8px 0;
  font-weight: 500;
}
.drag-ghost {
  opacity: 0.5;
  background: #f5f6f7;
}
.drag-chosen {
  background: #e0f7ef;
}

.sort-order-dialog >>> .el-dialog__header {
  padding: 0;
  background: #19b36b;
  border-radius: 8px 8px 0 0;
}
.sort-dialog-header {
  background: #19b36b;
  padding: 24px 32px 16px 32px;
  border-radius: 8px 8px 0 0;
}
.sort-dialog-title {
  color: #fff;
  font-size: 2rem;
  font-weight: 600;
  letter-spacing: 1px;
  border-radius: 8px 8px 0 0;
}
.sort-dialog-desc {
  font-size: 1.15rem;
  color: #555;
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
  background: #f3f3f3;
  border-radius: 4px;
  margin-bottom: 8px;
  padding: 8px 24px;
  font-size: 1.18rem;
  font-weight: 500;
  color: #222;
  cursor: grab;
  transition: box-shadow 0.2s;
  box-shadow: 0 1px 2px rgba(0,0,0,0.03);
}
.order-label {
  flex: 1;
  color: #222;
  font-weight: 500;
}
.save-btn {
  background: #19b36b;
  color: #fff;
  font-weight: 600;
  min-width: 120px;
  font-size: 1.1rem;
  border-radius: 4px;
  border: none;
}
.save-btn:hover {
  background: #13a05a;
}
.cancel-btn {
  color: #f44336;
  background: transparent;
  border: none;
  font-weight: 600;
  min-width: 90px;
  font-size: 1.1rem;
}
.cancel-btn:hover {
  color: #c62828;
  background: #fbe9e7;
}
</style>
