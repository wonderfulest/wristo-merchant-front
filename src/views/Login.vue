<template>
  <div class="login-page">
    <div class="login-logo">
      <span class="logo-bold">Wristo<span class="logo-green">Io</span></span>
    </div>
    <h2 class="login-title">Developer Log In</h2>
    <form class="login-form" @submit.prevent="handleLogin">
      <label class="login-label" for="email">Email Address</label>
      <input
        id="email"
        v-model="email"
        type="email"
        class="login-input"
        autocomplete="username"
        required
      />

      <label class="login-label" for="password">Password</label>
      <input
        id="password"
        v-model="password"
        type="password"
        class="login-input"
        autocomplete="current-password"
        required
      />

      <div class="login-options">
        <label class="remember-me">
          <input type="checkbox" v-model="rememberMe" />
          <span>Remember me</span>
        </label>
      </div>

      <div class="forgot-row">
        <span>Forgot Password? <a href="#" class="reset-link">Reset here.</a></span>
      </div>

      <button class="login-btn" type="submit">Continue</button>
    </form>
    <div class="register-tip">
      No account? <router-link to="/register">Sign up here.</router-link>
    </div>
    <div class="login-footer">
      © 2025 Wristo.
      <a href="#" class="footer-link">Terms of Use.</a>
      <a href="#" class="footer-link">Privacy Policy.</a>
      Wristo is not affiliated with Garmin.
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useUserStore } from '@/store/user'
import { useRouter } from 'vue-router'

const email = ref('')
const password = ref('')
const rememberMe = ref(false)
const userStore = useUserStore()
const router = useRouter()

const handleLogin = async () => {
  try {
    await userStore.login({
      email: email.value,
      password: password.value
    })
    router.push('/')
  } catch (error: any) {
    alert(error.message || '登录失败')
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  background: #fff;
  padding-top: 40px;
}
.login-logo {
  font-size: 2.2rem;
  font-weight: bold;
  margin-bottom: 18px;
  letter-spacing: 1px;
  text-align: center;
}
.logo-bold {
  color: #444;
  font-weight: 700;
}
.logo-green {
  color: #7ca89c;
  font-weight: 700;
  margin-left: 2px;
}
.login-title {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 32px;
  text-align: center;
}
.login-form {
  width: 370px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.login-label {
  font-weight: 800;
  margin-bottom: 4px;
  margin-top: 10px;
  text-align: left;
}
.login-input {
  padding: 12px 14px;
  border: 3px solid #d1d3d4;
  border-radius: 10px;
  font-size: 1rem;
  margin-bottom: 2px;
  background: #fff;
  outline: none;
  transition: border 0.2s;
}
.login-input:focus {
  border-color: #7ca89c;
}
.login-options {
  display: flex;
  align-items: center;
  margin: 10px 0 0 0;
}
.remember-me {
  display: flex;
  align-items: center;
  font-size: 1rem;
  font-weight: 500;
  gap: 6px;
}
.forgot-row {
  margin: 8px 0 0 0;
  font-size: 1rem;
}
.reset-link {
  color: #222;
  font-weight: 600;
  text-decoration: underline;
  margin-left: 2px;
}
.login-btn {
  margin-top: 22px;
  width: 100%;
  background: #111;
  color: #fff;
  font-size: 1.15rem;
  font-weight: bold;
  border: none;
  border-radius: 28px;
  padding: 14px 0;
  cursor: pointer;
  transition: background 0.2s;
}
.login-btn:hover {
  background: #333;
}
.login-footer {
  margin-top: 38px;
  text-align: center;
  color: #444;
  font-size: 0.98rem;
  line-height: 1.7;
}
.footer-link {
  color: #222;
  text-decoration: underline;
  margin: 0 4px;
}
.register-tip {
  text-align: center;
  margin-top: 18px;
  font-size: 1rem;
}
.register-tip a {
  color:  #111;
  text-decoration: none;
  margin-left: 4px;
}
.register-tip a:hover {
  text-decoration: underline;
}
</style> 