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

      <!-- Redirection si non authentifié -->
      <div v-else class="flex items-center justify-center min-h-[60vh]">
        <p class="text-gray-400">Veuillez vous connecter pour accéder à cette page.</p>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import RecipeChatbot from '../components/RecipeChatbot.vue'
import { useAuth } from '../composables/useAuth'
import type { User } from 'firebase/auth'

const router = useRouter()
const { user, loading, logout } = useAuth()

// Rediriger vers la page de connexion si non authentifié
onMounted(() => {
  if (!user.value && !loading.value) {
    router.push('/login')
  }
})

// Gérer la déconnexion
const handleLogout = async () => {
  await logout()
  router.push('/login')
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
