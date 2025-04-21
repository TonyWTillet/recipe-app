<template>
  <div class="account-page">
    <div class="account-container">
      <h1>Mon Compte</h1>

      <div class="profile-section">
        <div class="profile-header">
          <div class="profile-avatar">
            <img v-if="user.photoURL" :src="user.photoURL" alt="Photo de profil" />
            <div v-else class="avatar-placeholder">
              {{ userInitials }}
            </div>
          </div>
          <div class="profile-info">
            <h2>{{ user.displayName || 'Utilisateur' }}</h2>
            <p>{{ user.email }}</p>
          </div>
        </div>
      </div>

      <div class="account-sections">
        <div class="section">
          <h3>Informations personnelles</h3>
          <form @submit.prevent="updateProfile" class="profile-form">
            <div class="form-group">
              <label for="displayName">Nom d'affichage</label>
              <input type="text" id="displayName" v-model="displayName" placeholder="Votre nom" />
            </div>
            <div class="form-group">
              <label for="photoURL">URL de la photo de profil</label>
              <input type="url" id="photoURL" v-model="photoURL" placeholder="URL de votre photo" />
            </div>
            <button type="submit" :disabled="updating">
              {{ updating ? 'Mise à jour...' : 'Mettre à jour le profil' }}
            </button>
            <p class="success" v-if="updateSuccess">Profil mis à jour avec succès !</p>
            <p class="error" v-if="updateError">{{ updateError }}</p>
          </form>
        </div>

        <div class="section">
          <h3>Sécurité</h3>
          <div class="security-options">
            <button @click="changePassword" class="secondary-btn">Changer le mot de passe</button>
            <button @click="deleteAccount" class="danger-btn">Supprimer le compte</button>
          </div>
        </div>

        <div class="section">
          <h3>Déconnexion</h3>
          <p>Vous pouvez vous déconnecter de votre compte à tout moment.</p>
          <button @click="logout" class="logout-btn">Se déconnecter</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { auth } from '../firebase/config'
import {
  updateProfile,
  deleteUser,
  EmailAuthProvider,
  reauthenticateWithCredential,
  type User,
} from 'firebase/auth'
import { useAuth } from '../composables/useAuth'

const router = useRouter()
const { user, logout } = useAuth()

const displayName = ref('')
const photoURL = ref('')
const updating = ref(false)
const updateSuccess = ref(false)
const updateError = ref('')

// Calculer les initiales de l'utilisateur pour l'avatar par défaut
const userInitials = computed(() => {
  if (!user.value) return ''
  const name = user.value.displayName || user.value.email || ''
  return name.charAt(0).toUpperCase()
})

// Initialiser les valeurs du formulaire avec les données de l'utilisateur
onMounted(() => {
  if (user.value) {
    displayName.value = user.value.displayName || ''
    photoURL.value = user.value.photoURL || ''
  }
})

// Mettre à jour le profil de l'utilisateur
const updateUserProfile = async () => {
  if (!user.value) return

  updating.value = true
  updateSuccess.value = false
  updateError.value = ''

  try {
    await updateProfile(user.value, {
      displayName: displayName.value,
      photoURL: photoURL.value,
    })
    updateSuccess.value = true
  } catch (error: any) {
    updateError.value = error.message
  } finally {
    updating.value = false
  }
}

// Changer le mot de passe
const changePassword = () => {
  // Rediriger vers une page de changement de mot de passe
  // ou afficher un modal
  alert('Fonctionnalité à implémenter')
}

// Supprimer le compte
const deleteAccount = async () => {
  if (!user.value) return

  if (confirm('Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.')) {
    try {
      // Pour supprimer un compte, l'utilisateur doit être réauthentifié
      // Cette partie nécessiterait une implémentation plus complète
      // avec une demande de mot de passe
      await deleteUser(user.value)
      router.push('/')
    } catch (error: any) {
      console.error('Erreur lors de la suppression du compte:', error)
      alert('Impossible de supprimer le compte. Veuillez réessayer plus tard.')
    }
  }
}

// Mettre à jour le profil
const updateProfile = async () => {
  await updateUserProfile()
}
</script>

<style scoped>
.account-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.account-container {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  padding: 2rem;
}

h1 {
  color: #2c3e50;
  margin-bottom: 2rem;
  text-align: center;
}

.profile-section {
  margin-bottom: 2rem;
}

.profile-header {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.profile-avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  overflow: hidden;
  background-color: #f1f1f1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.profile-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #4caf50;
  color: white;
  font-size: 2.5rem;
  font-weight: bold;
}

.profile-info h2 {
  margin: 0;
  color: #2c3e50;
}

.profile-info p {
  margin: 0.5rem 0 0;
  color: #666;
}

.account-sections {
  display: grid;
  gap: 2rem;
}

.section {
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 1.5rem;
}

.section h3 {
  margin-top: 0;
  color: #2c3e50;
  margin-bottom: 1rem;
}

.profile-form {
  display: grid;
  gap: 1rem;
}

.form-group {
  display: grid;
  gap: 0.5rem;
}

label {
  font-weight: 500;
  color: #666;
}

input {
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

button {
  padding: 0.75rem 1rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
}

button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

button.primary-btn {
  background-color: #4caf50;
  color: white;
}

button.primary-btn:hover {
  background-color: #45a049;
}

button.secondary-btn {
  background-color: #f1f1f1;
  color: #333;
}

button.secondary-btn:hover {
  background-color: #e0e0e0;
}

button.danger-btn {
  background-color: #ff4444;
  color: white;
}

button.danger-btn:hover {
  background-color: #cc0000;
}

button.logout-btn {
  background-color: #f1f1f1;
  color: #333;
}

button.logout-btn:hover {
  background-color: #e0e0e0;
}

.security-options {
  display: grid;
  gap: 1rem;
}

.success {
  color: #4caf50;
  margin-top: 1rem;
}

.error {
  color: #ff4444;
  margin-top: 1rem;
}
</style>
