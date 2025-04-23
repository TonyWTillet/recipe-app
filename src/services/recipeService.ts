import { db } from '../firebase/config'
import { collection, doc, getDocs, addDoc, deleteDoc, query, where, orderBy, Timestamp } from 'firebase/firestore'
import type { User } from 'firebase/auth'

export interface Recipe {
  id?: string
  userId: string
  title: string
  content: string
  createdAt: Timestamp
  updatedAt: Timestamp
}

export const recipeService = {
  async getUserRecipes(userId: string): Promise<Recipe[]> {
    try {
      const recipesQuery = query(
        collection(db, 'recipes'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      )

      const querySnapshot = await getDocs(recipesQuery)
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Recipe[]
    } catch (error) {
      console.error('Erreur lors de la récupération des recettes:', error)
      return []
    }
  },

  async saveRecipe(user: User, content: string, title: string = 'Nouvelle recette'): Promise<string> {
    try {
      const now = Timestamp.now()
      const recipe: Omit<Recipe, 'id'> = {
        userId: user.uid,
        title,
        content,
        createdAt: now,
        updatedAt: now
      }

      const docRef = await addDoc(collection(db, 'recipes'), recipe)
      return docRef.id
    } catch (error) {
      console.error('Erreur lors de la sauvegarde de la recette:', error)
      throw error
    }
  },

  async deleteRecipe(recipeId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'recipes', recipeId))
    } catch (error) {
      console.error('Erreur lors de la suppression de la recette:', error)
      throw error
    }
  }
}
