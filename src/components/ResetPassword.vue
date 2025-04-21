<template>
  <div class="reset-password">
    <div class="form-container">
      <h2>Réinitialiser le mot de passe</h2>
      <p class="instructions">
        Entrez votre adresse e-mail et nous vous enverrons un lien pour réinitialiser votre mot de
        passe.
      </p>
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="email">Email</label>
          <input type="email" id="email" v-model="email" required placeholder="Votre email" />
        </div>
        <button type="submit" :disabled="loading">
          {{ success ? 'Email envoyé' : 'Envoyer le lien' }}
        </button>
        <p class="error" v-if="error">{{ error }}</p>
        <p class="success" v-if="success">
          Un email de réinitialisation a été envoyé à {{ email }}.
        </p>
        <p class="back-link">
          <a href="#" @click.prevent="$emit('back')">Retour à la connexion</a>
        </p>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { auth } from '../firebase/config'
import { sendPasswordResetEmail } from 'firebase/auth'

const emit = defineEmits(['back'])

const email = ref('')
const error = ref('')
const success = ref(false)
const loading = ref(false)

const handleSubmit = async () => {
  loading.value = true
  error.value = ''
  success.value = false

  try {
    await sendPasswordResetEmail(auth, email.value)
    success.value = true
  } catch (e: any) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.reset-password {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f5f5;
}

.form-container {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}

h2 {
  text-align: center;
  color: #2c3e50;
  margin-bottom: 1rem;
}

.instructions {
  text-align: center;
  color: #666;
  margin-bottom: 1.5rem;
  font-size: 0.9rem;
}

.form-group {
  margin-bottom: 1rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  color: #666;
}

input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

button {
  width: 100%;
  padding: 0.75rem;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #45a049;
}

button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.error {
  color: #ff4444;
  text-align: center;
  margin-top: 1rem;
}

.success {
  color: #4caf50;
  text-align: center;
  margin-top: 1rem;
}

.back-link {
  text-align: center;
  margin-top: 1.5rem;
}

.back-link a {
  color: #4caf50;
  text-decoration: none;
}

.back-link a:hover {
  text-decoration: underline;
}
</style>
