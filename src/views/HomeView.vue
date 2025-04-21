<template>
  <div class="home">
    <HomeHeader />
    <div v-if="loading" class="loading">Chargement...</div>
    <template v-else>
      <div v-if="user" class="authenticated-content">
        <UserInfo :user="user" @logout="logout" />
        <RecipeChatbot />
      </div>
      <template v-else>
        <AuthForm
          v-if="!showResetPassword"
          @auth-success="handleAuthSuccess"
          @reset-password="showResetPassword = true"
        />
        <ResetPassword v-else @back="showResetPassword = false" />
      </template>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import HomeHeader from '../components/HomeHeader.vue'
import RecipeChatbot from '../components/RecipeChatbot.vue'
import AuthForm from '../components/AuthForm.vue'
import UserInfo from '../components/UserInfo.vue'
import ResetPassword from '../components/ResetPassword.vue'
import { useAuth } from '../composables/useAuth'
import type { User } from 'firebase/auth'

const { user, loading, logout } = useAuth()
const showResetPassword = ref(false)

const handleAuthSuccess = (newUser: User) => {
  console.log('Utilisateur connecté:', newUser.email)
}
</script>

<style scoped>
.home {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
}

.loading {
  text-align: center;
  padding: 2rem;
  color: #666;
}

.authenticated-content {
  margin-top: 2rem;
}
</style>
