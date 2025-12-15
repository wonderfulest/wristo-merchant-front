<template>
  <div class="account-page">
    <h2>个人信息</h2>
    <el-form
      v-if="userInfo"
      :model="form"
      label-width="90px"
      class="profile-form"
      @submit.prevent
    >
      <el-form-item label="头像">
        <el-upload
          class="avatar-uploader"
          :show-file-list="false"
          :before-upload="beforeAvatarUpload"
          :on-change="handleAvatarChange"
          :auto-upload="false"
        >
          <img v-if="form.avatar" :src="form.avatar" class="avatar" />
          <el-icon v-else class="avatar-uploader-icon"><i class="el-icon-plus" /></el-icon>
        </el-upload>
      </el-form-item>
      <el-form-item label="用户名">
        <el-input v-model="form.username" placeholder="请输入用户名" />
      </el-form-item>
      <!-- <el-form-item label="昵称">
        <el-input v-model="form.nickname" placeholder="请输入昵称" />
      </el-form-item> -->
      <el-form-item label="邮箱">
        <el-input v-model="form.email" disabled />
      </el-form-item>
      <el-form-item label="手机号">
        <el-input v-model="form.phone" disabled />
      </el-form-item>
      <el-form-item label="注册时间">
        <el-input v-model="form.createdAt" disabled />
      </el-form-item>

      <el-divider content-position="left">商家展示</el-divider>

      <el-form-item label="应用数">
        <el-input v-model="form.appCount" disabled />
      </el-form-item>

      <el-form-item label="总下载量">
        <el-input v-model="form.totalDownloads" disabled />
      </el-form-item>

      <el-form-item label="Banner图" prop="bannerImageId">
        <ImageUpload
          v-model="form.bannerImageId"
          :preview-url="bannerPreviewUrl"
          aspect-code="banner"
          :max-size-mb="4"
          @uploaded="handleBannerUploaded"
        />
      </el-form-item>

      <el-form-item label="标语">
        <el-input v-model="form.slogan" placeholder="请输入标语" />
      </el-form-item>

      <el-form-item label="Facebook">
        <el-input v-model="form.facebookUrl" placeholder="请输入Facebook链接" />
      </el-form-item>

      <el-form-item label="Instagram">
        <el-input v-model="form.instagramUrl" placeholder="请输入Instagram链接" />
      </el-form-item>

      <el-form-item label="X">
        <el-input v-model="form.xUrl" placeholder="请输入X链接" />
      </el-form-item>
      
      <el-divider content-position="left">支付信息</el-divider>
      
      <el-form-item label="支付方式">
        <el-select v-model="form.payoutMethod" placeholder="请选择支付方式" style="width: 100%">
          <el-option label="支付宝 (国内，到账人民币，2.5%汇损)" value="alipay" />
          <el-option label="PayPal (海外，到账美元，无汇损)" value="paypal" />
          <!-- <el-option label="微信" value="wechat" /> -->
          <!-- <el-option label="银行卡" value="bank" /> -->
        </el-select>
      </el-form-item>
      
      <el-form-item label="支付账户">
        <el-input v-model="form.payoutAccount" placeholder="请输入支付账户" />
      </el-form-item>
      
      <el-form-item>
        <el-button type="primary" :loading="saving" @click="handleSave">保存</el-button>
      </el-form-item>
    </el-form>
    <el-skeleton v-else :rows="6" animated />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch } from 'vue'
import { getMchUserInfo, updateMchInfo, uploadAvatar } from '@/api/user'
import type { MchUserVO, UserMchUpdateDTO, ApiResponse } from '@/types/api'
import type { ImageVO } from '@/types/image'
import { ElMessage } from 'element-plus'
import ImageUpload from '@/components/common/ImageUpload.vue'

const userInfo = ref<MchUserVO | null>(null)
const loading = ref(true)
const saving = ref(false)
const bannerPreviewUrl = ref('')

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
      ElMessage.error(res.msg || '获取用户信息失败')
    }
  } catch (e) {
    ElMessage.error('获取用户信息失败')
  } finally {
    loading.value = false
  }
}

function beforeAvatarUpload(file: File) {
  const isImage = file.type.startsWith('image/')
  if (!isImage) {
    ElMessage.error('只能上传图片文件')
  }
  const isLt2M = file.size / 1024 / 1024 < 2
  if (!isLt2M) {
    ElMessage.error('图片大小不能超过 2MB!')
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
      ElMessage.success('头像上传成功')
    } else {
      ElMessage.error(res.msg || '头像上传失败')
    }
  } catch (e) {
    ElMessage.error('头像上传失败')
  }
}

async function handleSave() {
  saving.value = true
  try {
    const updateData: UserMchUpdateDTO = {
      username: form.username,
      nickname: form.nickname,
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
      ElMessage.success('保存成功')
      await fetchUserInfo()
    } else {
      ElMessage.error(res.msg || '保存失败')
    }
  } catch (e) {
    ElMessage.error('保存失败')
  } finally {
    saving.value = false
  }
}
</script>

<style scoped>
.account-page {
  width: 60%;
  padding: 32px;
  background: #fff;
  min-height: 300px;
  min-width: 480px;
  margin: 0 auto;
}
.profile-form {
  margin-top: 32px;
}
.avatar-uploader {
  display: flex;
  align-items: center;
}
.avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  border: 1.5px solid #eee;
}
.avatar-uploader-icon {
  font-size: 32px;
  color: #bbb;
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1.5px dashed #eee;
  border-radius: 50%;
  background: #fafbfc;
}
</style> 