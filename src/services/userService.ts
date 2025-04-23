import { db } from '../firebase/config'
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore'
import type { User } from 'firebase/auth'

interface UserData {
  displayName: string | null
  email: string | null
  photoURL: string | null
  allergies: string
  createdAt: Date
  updatedAt: Date
}

export const userService = {
  async getUserData(userId: string): Promise<UserData | null> {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId))
      if (userDoc.exists()) {
        return userDoc.data() as UserData
      }
      return null
    } catch (error) {
      console.error('Erreur lors de la récupération des données utilisateur:', error)
      return null
    }
  },

  async createUserData(user: User, allergies: string = ''): Promise<void> {
    try {
      const userData: UserData = {
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        allergies,
        createdAt: new Date(),
        updatedAt: new Date()
      }
      await setDoc(doc(db, 'users', user.uid), userData)
    } catch (error) {
      console.error('Erreur lors de la création des données utilisateur:', error)
      throw error
    }
  },

  async updateUserData(userId: string, data: Partial<UserData>): Promise<void> {
    try {
      const userRef = doc(db, 'users', userId)
      const userDoc = await getDoc(userRef)

      if (userDoc.exists()) {
        // Document existe, utiliser updateDoc
        await updateDoc(userRef, {
          ...data,
          updatedAt: new Date()
        })
      } else {
        // Document n'existe pas, créer un nouveau document
        const userData: UserData = {
          displayName: data.displayName || null,
          email: data.email || null,
          photoURL: data.photoURL || null,
          allergies: data.allergies || '',
          createdAt: new Date(),
          updatedAt: new Date()
        }
        await setDoc(userRef, userData)
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour des données utilisateur:', error)
      throw error
    }
  },

  async updateAllergies(userId: string, allergies: string): Promise<void> {
    try {
      await this.updateUserData(userId, { allergies })
    } catch (error) {
      console.error('Erreur lors de la mise à jour des allergies:', error)
      throw error
    }
  }
}
