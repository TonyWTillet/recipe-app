import { ref, onMounted } from 'vue'
import { auth } from '../firebase/config'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import type { User } from 'firebase/auth'

export function useAuth() {
  const user = ref<User | null>(null)
  const loading = ref(true)

  onMounted(() => {
    const unsubscribe = onAuthStateChanged(auth, (newUser) => {
      user.value = newUser
      loading.value = false
    })

    // Nettoyage de l'observateur lors du démontage du composant
    return () => unsubscribe()
  })

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
    logout,
  }
}
