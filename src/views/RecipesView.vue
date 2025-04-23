<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold text-white mb-8 border-b border-white/20 pb-4">Mes recettes</h1>

    <div v-if="loading" class="flex justify-center items-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
    </div>

    <div v-else-if="recipes.length === 0" class="text-center py-12">
      <p class="text-gray-600 mb-4">Vous n'avez pas encore sauvegardé de recettes.</p>
      <p class="text-gray-500 text-sm">Utilisez le chatbot pour générer et sauvegarder des recettes !</p>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="recipe in recipes" :key="recipe.id" class="bg-white/10 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden border border-white/10">
        <div class="p-4">
          <div class="flex justify-between items-start">
            <h3 class="text-lg font-semibold text-white mb-2">{{ recipe.title }}</h3>
            <button
              @click="deleteRecipe(recipe.id)"
              class="text-gray-400 hover:text-red-500 transition-colors duration-200 cursor-pointer"
              title="Supprimer cette recette"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
              </svg>
            </button>
          </div>
          <p class="text-gray-300 text-sm mb-4 line-clamp-3">{{ getRecipePreview(recipe.content) }}</p>
          <div class="flex justify-between items-center">
            <span class="text-sm text-gray-400">
              {{ formatDate(recipe.createdAt) }}
            </span>
            <button
              @click="viewRecipe(recipe)"
              class="text-primary-400 hover:text-primary-300 font-medium"
            >
              Voir la recette
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal pour afficher la recette complète -->
    <div v-if="selectedRecipe" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white/10 backdrop-blur-sm rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden border border-white/10">
        <div class="p-6 overflow-y-auto max-h-[80vh]">
          <div class="flex justify-between items-start mb-4">
            <h2 class="text-2xl font-bold text-white">{{ selectedRecipe.title }}</h2>
            <button
              @click="selectedRecipe = null"
              class="text-gray-400 hover:text-gray-300"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div class="prose max-w-none">
            <pre class="whitespace-pre-wrap text-gray-300">{{ selectedRecipe.content }}</pre>
          </div>
        </div>
        <div class="bg-white/5 px-6 py-4 flex justify-end border-t border-white/10">
          <button
            @click="selectedRecipe = null"
            class="px-4 py-2 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-colors duration-200"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useAuth } from '@/composables/useAuth'
import { recipeService, type Recipe } from '@/services/recipeService'
import { db } from '@/firebase/config'
import { collection, query, where, onSnapshot, Timestamp } from 'firebase/firestore'

const { user } = useAuth()
const recipes = ref<Recipe[]>([])
const loading = ref(true)
const selectedRecipe = ref<Recipe | null>(null)
let unsubscribe: (() => void) | null = null

// Charger les recettes de l'utilisateur en temps réel
const loadRecipes = async () => {
  if (!user.value) return

  try {
    loading.value = true
    const recipesQuery = query(
      collection(db, 'recipes'),
      where('userId', '==', user.value.uid)
    )

    unsubscribe = onSnapshot(recipesQuery, (snapshot) => {
      const recipesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Recipe[]

      recipes.value = recipesData.sort((a, b) =>
        b.createdAt.toMillis() - a.createdAt.toMillis()
      )
      loading.value = false
    }, () => {
      loading.value = false
    })
  } catch {
    loading.value = false
  }
}

// Supprimer une recette
const deleteRecipe = async (recipeId: string | undefined) => {
  if (!recipeId || !confirm('Êtes-vous sûr de vouloir supprimer cette recette ?')) return

  try {
    await recipeService.deleteRecipe(recipeId)
    recipes.value = recipes.value.filter(recipe => recipe.id !== recipeId)
  } catch (error) {
    console.error('Erreur lors de la suppression de la recette:', error)
  }
}

// Afficher une recette dans le modal
const viewRecipe = (recipe: Recipe) => {
  selectedRecipe.value = recipe
}

// Obtenir un aperçu du contenu de la recette
const getRecipePreview = (content: string): string => {
  // Enlever le titre (première ligne)
  const lines = content.split('\n').slice(1)
  // Prendre les 3 premières lignes non vides
  const previewLines = lines.filter(line => line.trim()).slice(0, 3)
  return previewLines.join('\n')
}

// Formater la date
const formatDate = (date: Timestamp): string => {
  return date.toDate().toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

onMounted(() => {
  loadRecipes()
})

onUnmounted(() => {
  if (unsubscribe) {
    unsubscribe()
  }
})
</script>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
