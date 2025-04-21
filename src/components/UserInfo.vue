<template>
  <div class="user-info">
    <div class="user-details">
      <img v-if="user.photoURL" :src="user.photoURL" alt="Photo de profil" class="user-avatar" />
      <div class="user-text">
        <span class="user-name">{{ user.displayName || 'Utilisateur' }}</span>
        <span class="user-email">{{ user.email }}</span>
      </div>
    </div>
    <button @click="logout" class="logout-btn">Déconnexion</button>
  </div>
</template>

<script setup lang="ts">
import { User } from 'firebase/auth'

defineProps<{
  user: User
}>()

const emit = defineEmits(['logout'])

const logout = () => {
  emit('logout')
}
</script>

<style scoped>
.user-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  background-color: #f8f8f8;
  border-radius: 8px;
  margin-bottom: 1.5rem;
}

.user-details {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.user-text {
  display: flex;
  flex-direction: column;
}

.user-name {
  font-weight: 600;
  color: #2c3e50;
}

.user-email {
  font-size: 0.85rem;
  color: #666;
}

.logout-btn {
  padding: 0.5rem 1rem;
  background-color: #ff4444;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
  font-size: 0.9rem;
}

.logout-btn:hover {
  background-color: #cc0000;
}
</style>
