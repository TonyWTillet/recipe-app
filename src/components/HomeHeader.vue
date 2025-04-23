<template>
  <nav class="relative z-50 w-full bg-[#0a0a0a]/50 backdrop-blur-sm">
    <div class="w-full px-4 sm:px-6 lg:px-8 h-20">
      <div class="flex items-center justify-between h-full">
        <!-- Logo à gauche -->
        <div class="flex-shrink-0">
          <h1 class="text-xl font-bold text-white">
            Recipe Chatbot
          </h1>
        </div>

        <!-- Navigation au centre - position absolue pour un vrai centrage -->
        <div class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden md:block">
          <div class="flex items-center gap-5">
            <router-link
              to="/"
              class="nav-link text-gray-300 hover:text-white text-sm font-medium border-b-2 border-transparent hover:border-white/50 transition-colors duration-200 py-2"
              active-class="border-white text-white"
            >
              Accueil
            </router-link>
            <router-link
              to="/recipes"
              class="nav-link text-gray-300 hover:text-white text-sm font-medium border-b-2 border-transparent hover:border-white/50 transition-colors duration-200 py-2"
              active-class="border-white text-white"
            >
              Mes recettes
            </router-link>
          </div>
        </div>

        <!-- Profil utilisateur à droite -->
        <div class="hidden md:flex items-center">
          <div v-if="user" class="flex items-center bg-white/5 rounded-full pl-3 pr-1 py-1.5">
            <div class="flex items-center gap-5">
              <!-- Image de profil ou initiales -->
              <RouterLink to="/account" class="flex items-center gap-2 hover:opacity-80 transition-opacity">
                <div v-if="user.photoURL" class="h-8 w-8 rounded-full overflow-hidden ring-1 ring-white/20">
                  <img :src="user.photoURL" alt="Photo de profil" class="h-full w-full object-cover" />
                </div>
                <div v-else class="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center ring-1 ring-white/20">
                  <span class="text-white font-medium text-sm">
                    {{ getUserInitials(user) }}
                  </span>
                </div>
                <span class="text-sm font-medium text-gray-300">{{ getUserDisplayName(user) }}</span>
              </RouterLink>

              <!-- Bouton déconnexion intégré -->
              <button
                @click="handleLogout"
                class="bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white px-3 py-1.5 rounded-full text-sm font-medium transition-colors duration-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          </div>
          <div v-else>
            <router-link
              to="/login"
              class="bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white px-3 py-1.5 rounded-full text-sm font-medium transition-colors duration-200 flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
              <span>Connexion</span>
            </router-link>
          </div>
        </div>

        <!-- Menu mobile -->
        <div class="flex md:hidden">
          <button
            @click="mobileMenuOpen = !mobileMenuOpen"
            class="inline-flex items-center justify-center p-2 rounded-full text-gray-400 hover:text-white hover:bg-white/5 focus:outline-none"
          >
            <span class="sr-only">Ouvrir le menu</span>
            <svg
              class="h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Menu mobile -->
    <div v-if="mobileMenuOpen" class="md:hidden bg-black/90 border-b border-white/10">
      <div class="px-2 pt-2 pb-3 space-y-1">
        <router-link
          to="/"
          class="nav-link text-gray-300 hover:bg-white/5 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
          active-class="bg-white/10 text-white"
        >
          Accueil
        </router-link>
        <router-link
          to="/recipes"
          class="nav-link text-gray-300 hover:bg-white/5 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
          active-class="bg-white/10 text-white"
        >
        Mes recettes
        </router-link>
      </div>
      <div class="pt-4 pb-3 border-t border-white/10">
        <div v-if="user" class="px-4 py-2">
          <div class="flex items-center gap-5">
            <!-- Image de profil ou initiales pour mobile -->
            <div v-if="user.photoURL" class="h-10 w-10 rounded-full overflow-hidden ring-1 ring-white/20">
              <img :src="user.photoURL" alt="Photo de profil" class="h-full w-full object-cover" />
            </div>
            <div v-else class="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center ring-1 ring-white/20">
              <span class="text-white font-medium">
                {{ getUserInitials(user) }}
              </span>
            </div>
            <div class="ml-3">
              <div class="text-base font-medium text-white">{{ getUserDisplayName(user) }}</div>
              <button
                @click="handleLogout"
                class="mt-2 w-full bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 flex items-center justify-center gap-2"
              >
                <span>Déconnexion</span>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          </div>
        </div>
        <div v-else class="px-4 py-2">
          <router-link
            to="/login"
            class="bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white px-3 py-1.5 rounded-full text-sm font-medium transition-colors duration-200 flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
            </svg>
            <span>Connexion</span>
          </router-link>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { User } from 'firebase/auth';
import { RouterLink } from 'vue-router';
import { useRouter } from 'vue-router';
import { useAuth } from '../composables/useAuth';

const router = useRouter();
const { logout } = useAuth();

// Props
defineProps<{
  user: User | null
}>();

// État du menu mobile
const mobileMenuOpen = ref(false);

// Fonction pour gérer la déconnexion
const handleLogout = async () => {
  await logout();
  router.push('/login');
};

// Fonction pour obtenir les initiales de l'utilisateur
const getUserInitials = (user: User): string => {
  if (user.displayName) {
    const names = user.displayName.split(' ');
    if (names.length > 1) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return names[0][0].toUpperCase();
  }

  if (user.email) {
    return user.email[0].toUpperCase();
  }

  return '?';
};

// Fonction pour obtenir le nom d'affichage de l'utilisateur
const getUserDisplayName = (user: User): string => {
  if (user.displayName) {
    return user.displayName;
  }

  if (user.email) {
    return user.email;
  }

  return 'Utilisateur';
};
</script>

<style scoped>
header {
  text-align: center;
  margin-bottom: 40px;
}

header h1 {
  color: #2c3e50;
  margin-bottom: 10px;
}

header p {
  color: #666;
}
</style>
