<template>
  <div class="home relative">
    <!-- Loading state -->
    <div v-if="loading" class="flex items-center justify-center min-h-[60vh]">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
    </div>

    <template v-else>
      <!-- Contenu authentifié -->
      <div v-if="user" class="space-y-8">

        <div class="bg-white/5 rounded-2xl p-8 border border-white/10">
          <RecipeChatbot />
        </div>
      </div>

      <!-- Formulaires d'authentification -->
      <template v-else>
        <div class="max-w-md mx-auto">
          <div class="bg-white/5 rounded-2xl p-8 border border-white/10">
            <AuthForm
              v-if="!showResetPassword"
              @auth-success="handleAuthSuccess"
              @reset-password="showResetPassword = true"
              class="space-y-6"
            />
            <ResetPassword
              v-else
              @back="showResetPassword = false"
              class="space-y-6"
            />
          </div>
        </div>
      </template>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import RecipeChatbot from '../components/RecipeChatbot.vue'
import AuthForm from '../components/AuthForm.vue'
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
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

@media (min-width: 768px) {
  .home {
    padding: 40px;
  }
}
</style>
