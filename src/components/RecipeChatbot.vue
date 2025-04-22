<template>
  <div class="chat-container overflow-hidden p-0">
    <div class="chat-header border-b border-white/10 p-4">
      <div class="flex items-center gap-3">
        <div class="w-8 h-8 rounded-full bg-gradient-to-r from-violet-500 to-blue-500 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
            <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
            <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
          </svg>
        </div>
        <div>
          <h2 class="text-white font-medium">Assistant Recettes</h2>
          <p class="text-xs text-gray-400">Toujours en ligne</p>
        </div>
      </div>
    </div>

    <div class="chat-messages" ref="messagesContainer">
      <div v-for="(message, index) in messages"
           :key="index"
           class="flex mb-6 items-end gap-3"
           :class="[
             message.type === 'user' ? 'justify-end' : 'justify-start',
             index === 0 ? 'mt-4' : ''
           ]"
      >
        <div v-if="message.type === 'bot'" class="w-8 h-8 rounded-full bg-gradient-to-r from-violet-500 to-blue-500 flex items-center justify-center flex-shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
            <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
            <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
          </svg>
        </div>

        <div class="message max-w-[80%] break-words rounded-2xl px-4 py-3 shadow-lg"
             :class="[
               message.type === 'user'
                 ? 'bg-blue-600 text-white rounded-br-sm'
                 : 'bg-white/10 text-gray-200 rounded-bl-sm'
             ]"
        >
          {{ message.text }}
        </div>

        <div v-if="message.type === 'user'" class="w-8 h-8 rounded-full bg-gradient-to-r from-violet-500 to-blue-500 flex items-center justify-center flex-shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
          </svg>
        </div>
      </div>
    </div>

    <div class="chat-input border-t border-white/10 p-4">
      <div class="flex gap-3">
        <input
          v-model="userInput"
          @keyup.enter="sendMessage"
          placeholder="Posez votre question sur les recettes..."
          type="text"
          class="flex-1 bg-white/5 text-white placeholder-gray-400 rounded-xl px-4 py-2 border border-white/10 focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-all duration-200"
        />
        <button
          @click="sendMessage"
          class="bg-gradient-to-r from-violet-500 to-blue-500 text-white px-6 py-2 rounded-xl hover:opacity-90 transition-opacity duration-200 flex items-center gap-2"
        >
          <span>Envoyer</span>
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'

interface Message {
  text: string
  type: 'user' | 'bot'
}

const messages = ref<Message[]>([
  {
    text: "Bonjour ! Je suis votre assistant de recettes. Comment puis-je vous aider aujourd'hui ?",
    type: 'bot',
  },
])
const userInput = ref('')
const messagesContainer = ref<HTMLElement | null>(null)

const sendMessage = async () => {
  if (!userInput.value.trim()) return

  // Ajouter le message de l'utilisateur
  messages.value.push({
    text: userInput.value,
    type: 'user',
  })

  // Simuler une réponse du bot
  setTimeout(() => {
    messages.value.push({
      text: 'Je suis en train de chercher la meilleure recette pour vous...',
      type: 'bot',
    })
    scrollToBottom()
  }, 1000)

  userInput.value = ''
  await nextTick()
  scrollToBottom()
}

const scrollToBottom = () => {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

onMounted(() => {
  scrollToBottom()
})
</script>

<style scoped>
.chat-messages {
  height: 400px;
  overflow-y: auto;
  padding: 20px;
  scroll-behavior: smooth;
}

/* Style de défilement personnalisé pour le conteneur de messages */
.chat-messages::-webkit-scrollbar {
  width: 5px;
}

.chat-messages::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
}

.chat-messages::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 10px;
}

.chat-messages::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.3);
}

/* Animation des messages */
.message {
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
