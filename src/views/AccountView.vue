<template>
  <div v-if="user" class="account-page">
    <div class="account-container bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-8">
      <h1 class="text-2xl font-bold text-white text-center mb-8">Mon Compte</h1>

      <div class="profile-section mb-8">
        <div class="profile-header flex items-center gap-6">
          <div class="profile-avatar w-24 h-24 rounded-full overflow-hidden bg-white/10 flex items-center justify-center">
            <img v-if="user.photoURL" :src="user.photoURL" alt="Photo de profil" class="w-full h-full object-cover" />
            <div v-else class="w-full h-full flex items-center justify-center bg-white/10 text-white text-3xl font-bold">
              {{ userInitials }}
            </div>
          </div>
          <div class="profile-info">
            <h2 class="text-xl font-medium text-white m-0">{{ user.displayName || 'Utilisateur' }}</h2>
            <p class="text-gray-400 mt-1">{{ user.email }}</p>
          </div>
        </div>
      </div>

      <div class="space-y-8">
        <div class="section">
          <h3 class="text-lg font-medium text-white mb-4">Informations personnelles</h3>
          <div class="space-y-4">
            <div class="form-group">
              <label for="displayName" class="block text-sm font-medium text-gray-300 mb-2">Nom d'affichage</label>
              <input
                type="text"
                id="displayName"
                v-model="displayName"
                placeholder="Votre nom"
                class="mt-1 block w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500/50"
              />
            </div>
          </div>
        </div>

        <div class="section">
          <h3 class="text-lg font-medium text-white mb-4">Allergies alimentaires</h3>
          <div class="space-y-4">
            <div class="form-group">
              <label for="allergies" class="block text-sm font-medium text-gray-300 mb-2">Allergies connues</label>
              <input
                type="text"
                id="allergies"
                v-model="allergies"
                placeholder="Ex: gluten, arachides..."
                class="mt-1 block w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500/50"
              />
            </div>
          </div>
        </div>

        <div class="flex flex-col gap-4 pt-6">
          <button
            @click="updateProfile"
            :disabled="updating"
            class="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-gradient-to-r from-violet-500 to-blue-500 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {{ updating ? 'Mise à jour...' : 'Enregistrer les modifications' }}
          </button>

          <button
            @click="logout"
            class="w-full flex justify-center py-3 px-4 border border-white/10 rounded-xl shadow-sm text-sm font-medium text-white bg-white/5 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 cursor-pointer"
          >
            Se déconnecter
          </button>
        </div>

        <div class="space-y-2">
          <p v-if="updateSuccess" class="text-green-400 text-sm text-center">Profil mis à jour avec succès !</p>
          <p v-if="updateError" class="text-red-400 text-sm text-center">{{ updateError }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import {
  updateProfile as updateFirebaseProfile,
} from 'firebase/auth'
import { useAuth } from '../composables/useAuth'
import { userService } from '../services/userService'

// Définir une interface locale pour les données utilisateur
interface LocalUserData {
  displayName: string | null
  email: string | null
  photoURL: string | null
  allergies: string
  createdAt?: Date
  updatedAt?: Date
}

const router = useRouter()
const { user, logout } = useAuth()

const displayName = ref('')
const allergies = ref('')
const updating = ref(false)
const updateSuccess = ref(false)
const updateError = ref('')
const userData = ref<LocalUserData | null>(null)

const userInitials = computed(() => {
  if (!user.value) return ''
  const name = user.value.displayName || user.value.email || ''
  return name.charAt(0).toUpperCase()
})

onMounted(async () => {
  if (!user.value) {
    router.push('/login')
    return
  }

  // Charger les données utilisateur depuis Firestore
  userData.value = await userService.getUserData(user.value.uid) as LocalUserData | null
  console.log('User data from Firestore:', userData.value)

  if (userData.value) {
    displayName.value = userData.value.displayName || ''
    allergies.value = userData.value.allergies || ''
  } else {
    // Créer un nouveau document utilisateur si n'existe pas
    await userService.createUserData(user.value)
    displayName.value = user.value.displayName || ''
  }
})

const updateUserProfile = async () => {
  if (!user.value) return
  updating.value = true
  updateSuccess.value = false
  updateError.value = ''

  try {
    // Mettre à jour le profil Firebase Auth
    await updateFirebaseProfile(user.value, {
      displayName: displayName.value,
      photoURL: userData.value?.photoURL || null
    })

    // Mettre à jour les données dans Firestore
    await userService.updateUserData(user.value.uid, {
      displayName: displayName.value,
      allergies: allergies.value,
      photoURL: userData.value?.photoURL || null
    })

    // Mettre à jour userData local
    if (userData.value) {
      userData.value.displayName = displayName.value
      userData.value.allergies = allergies.value
    }

    updateSuccess.value = true
  } catch (error: unknown) {
    if (error instanceof Error) {
      updateError.value = error.message
    } else {
      updateError.value = 'Une erreur est survenue'
    }
  } finally {
    updating.value = false
  }
}

const updateProfile = async () => {
  await updateUserProfile()
}
</script>

<style scoped>
.account-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  height: calc(100vh - 5rem);
  overflow-y: auto;
}

/* Style de défilement personnalisé */
.account-page::-webkit-scrollbar {
  width: 5px;
}

.account-page::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
}

.account-page::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 10px;
}

.account-page::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.3);
}
</style>
