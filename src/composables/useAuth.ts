import { ref } from 'vue'
import { auth } from '../firebase/config'
import { onAuthStateChanged, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import type { User } from 'firebase/auth'
import { userService } from '../services/userService'

// État global de l'authentification
const user = ref<User | null>(null)
const loading = ref(true)

// Initialiser l'observateur d'authentification une seule fois
const unsubscribe = onAuthStateChanged(auth, (newUser) => {
  user.value = newUser
  loading.value = false
})

export function useAuth() {
  const login = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      return userCredential.user
    } catch (error) {
      console.error('Erreur lors de la connexion:', error)
      throw error
    }
  }

  const loginWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider()
      const userCredential = await signInWithPopup(auth, provider)

      // Créer ou mettre à jour les données utilisateur dans Firestore
      const userData = await userService.getUserData(userCredential.user.uid)
      if (!userData) {
        await userService.createUserData(userCredential.user)
      }

      return userCredential.user
    } catch (error) {
      console.error('Erreur lors de la connexion avec Google:', error)
      throw error
    }
  }

  const register = async (email: string, password: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)

      // Créer les données utilisateur dans Firestore
      await userService.createUserData(userCredential.user)

      return userCredential.user
    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error)
      throw error
    }
  }

  const logout = async () => {
    try {
      await signOut(auth)
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error)
    }
  }

  return {
    user,
    loading,
    login,
    loginWithGoogle,
    register,
    logout,
  }
}
