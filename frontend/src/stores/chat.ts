import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { Message } from '../types/chat'

type AssistantState = 'idle' | 'quering' | 'conversation' | 'stopped'

export const useChatStore = defineStore('chat-store', () => {
  const assistantState = ref<AssistantState>('idle')
  // const messages = ref<Message[]>([])

  const isQuering = ref(false)

  return { assistantState, isQuering }
})
