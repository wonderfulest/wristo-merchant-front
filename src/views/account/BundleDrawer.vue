<template>
  <div class="add-bundle-drawer">
    <div class="drawer-header">
      <h2>{{ props.bundle ? 'Edit Bundle' : 'Add New Bundle' }}</h2>
    </div>
    <div class="drawer-body">
      <div class="custom-form">
        <div class="custom-form-item">
          <label class="custom-label" :class="{ active: isActive('bundleName') || form.bundleName }">Bundle Name</label>
          <input
            type="text"
            v-model="form.bundleName"
            placeholder="Enter bundle name"
            class="custom-input"
            @focus="activeInput = 'bundleName'"
            @blur="activeInput = ''"
            autocomplete="off"
          />
        </div>
        <div class="custom-form-item">
          <label class="custom-label" :class="{ active: isActive('bundleDesc') || form.bundleDesc }">Bundle Description</label>
          <input
            type="text"
            v-model="form.bundleDesc"
            placeholder="Enter bundle description"
            class="custom-input"
            @focus="activeInput = 'bundleDesc'"
            @blur="activeInput = ''"
            autocomplete="off"
          />
        </div>
        <div class="custom-form-item">
          <label class="custom-label" :class="{ active: isActive('price') || form.price }">Price</label>
          <input
            type="text"
            v-model="form.price"
            placeholder="Enter bundle price"
            class="custom-input"
            @focus="activeInput = 'price'"
            @blur="activeInput = ''"
            autocomplete="off"
          />
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
  </div>
</template>

<script setup lang="ts">
import { ref, defineExpose, defineProps, watch } from 'vue'
import { createBundle, type Bundle } from '@/api/bundles'
import { ElMessage } from 'element-plus'
import { defineEmits } from 'vue'

const props = defineProps<{ bundle?: Bundle | null }>()
const emits = defineEmits(['close'])

const activeInput = ref('')
const loading = ref(false)

interface AddBundleForm {
  bundleName: string
  bundleDesc: string
}

const form = ref<AddBundleForm>({
  bundleName: '',
  bundleDesc: ''
})

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

async function handleCreate() {
  if (!validateForm()) return
  loading.value = true
  try {
    const payload = {
      bundleName: form.value.bundleName.trim(),
      bundleDesc: form.value.bundleDesc.trim()
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

function setForm(bundle: Bundle) {
  form.value = {
    bundleName: bundle.bundleName || '',
    bundleDesc: bundle.bundleDesc || ''
  }
}

function resetForm() {
  form.value = {
    bundleName: '',
    bundleDesc: ''
  }
}

defineExpose({ setForm, resetForm })

watch(() => props.bundle, (val) => {
  if (val) setForm(val)
  else resetForm()
})

async function handleSave() {
  // 这里可扩展为更新套餐接口
  ElMessage.success('Bundle updated (mock)')
  emits('close')
}
</script>

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
</style>
