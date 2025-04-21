<template>
  <div class="chat-container">
    <div class="chat-messages" ref="messagesContainer">
      <div v-for="(message, index) in messages" :key="index" :class="['message', message.type]">
        {{ message.text }}
      </div>
    </div>

    <div class="chat-input">
      <input
        v-model="userInput"
        @keyup.enter="sendMessage"
        placeholder="Posez votre question sur les recettes..."
        type="text"
      />
      <button @click="sendMessage">Envoyer</button>
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
.chat-container {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.chat-messages {
  height: 400px;
  overflow-y: auto;
  padding: 20px;
}

.message {
  margin-bottom: 15px;
  padding: 10px 15px;
  border-radius: 20px;
  max-width: 80%;
  word-wrap: break-word;
}

.user {
  background-color: #4caf50;
  color: white;
  margin-left: auto;
  border-bottom-right-radius: 5px;
}

.bot {
  background-color: #f1f1f1;
  color: #333;
  margin-right: auto;
  border-bottom-left-radius: 5px;
}

.chat-input {
  display: flex;
  padding: 15px;
  background-color: #f8f8f8;
  border-top: 1px solid #eee;
}

input {
  flex: 1;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-right: 10px;
}

button {
  padding: 10px 20px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #45a049;
}
</style>
