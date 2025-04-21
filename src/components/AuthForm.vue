<template>
  <div class="auth-form">
    <div class="form-container">
      <h2>{{ isLogin ? 'Connexion' : 'Inscription' }}</h2>
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="email">Email</label>
          <input type="email" id="email" v-model="email" required placeholder="Votre email" />
        </div>
        <div class="form-group">
          <label for="password">Mot de passe</label>
          <input
            type="password"
            id="password"
            v-model="password"
            required
            placeholder="Votre mot de passe"
          />
        </div>
        <button type="submit" :disabled="loading">
          {{ isLogin ? 'Se connecter' : "S'inscrire" }}
        </button>
        <p class="error" v-if="error">{{ error }}</p>
        <p class="toggle-form">
          {{ isLogin ? 'Pas encore de compte ?' : 'Déjà un compte ?' }}
          <a href="#" @click.prevent="toggleForm">
            {{ isLogin ? "S'inscrire" : 'Se connecter' }}
          </a>
        </p>
        <p v-if="isLogin" class="forgot-password">
          <a href="#" @click.prevent="$emit('reset-password')">Mot de passe oublié ?</a>
        </p>
      </form>

      <div class="divider">
        <span>ou</span>
      </div>

      <button class="google-btn" @click="signInWithGoogle" :disabled="loading">
        <img src="../assets/google-icon.svg" alt="Google" class="google-icon" />
        Continuer avec Google
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { auth } from '../firebase/config'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  type UserCredential,
} from 'firebase/auth'

const emit = defineEmits(['auth-success', 'reset-password'])

const isLogin = ref(true)
const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

const toggleForm = () => {
  isLogin.value = !isLogin.value
  error.value = ''
}

const handleSubmit = async () => {
  loading.value = true
  error.value = ''

  try {
    let userCredential: UserCredential

    if (isLogin.value) {
      userCredential = await signInWithEmailAndPassword(auth, email.value, password.value)
    } else {
      userCredential = await createUserWithEmailAndPassword(auth, email.value, password.value)
    }

    emit('auth-success', userCredential.user)
  } catch (e: any) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}

const signInWithGoogle = async () => {
  loading.value = true
  error.value = ''

  try {
    const provider = new GoogleAuthProvider()
    const userCredential = await signInWithPopup(auth, provider)
    emit('auth-success', userCredential.user)
  } catch (e: any) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.auth-form {
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
  margin-bottom: 1.5rem;
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

.toggle-form {
  text-align: center;
  margin-top: 1rem;
  color: #666;
}

.toggle-form a {
  color: #4caf50;
  text-decoration: none;
}

.toggle-form a:hover {
  text-decoration: underline;
}

.forgot-password {
  text-align: center;
  margin-top: 0.5rem;
  font-size: 0.9rem;
}

.forgot-password a {
  color: #4caf50;
  text-decoration: none;
}

.forgot-password a:hover {
  text-decoration: underline;
}

.divider {
  display: flex;
  align-items: center;
  margin: 1.5rem 0;
  color: #666;
}

.divider::before,
.divider::after {
  content: '';
  flex: 1;
  border-bottom: 1px solid #ddd;
}

.divider span {
  padding: 0 1rem;
}

.google-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: white;
  color: #333;
  border: 1px solid #ddd;
}

.google-btn:hover {
  background-color: #f5f5f5;
}

.google-icon {
  width: 18px;
  height: 18px;
  margin-right: 10px;
}
</style>
