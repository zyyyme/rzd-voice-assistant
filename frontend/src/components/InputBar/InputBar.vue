<script setup>
import { ref } from 'vue'
import VoiceInput from './VoiceInput.vue';
import { useChat } from '../../composables/useChat'
import { speech2text } from '../../services/api/voice'
import { useChatStore } from '../../stores/chat';

const textInput = ref('')
const isVoiceInputEnabled = ref(false)

const chatStore = useChatStore()

const { onUserMessage } = useChat()

function onMessageSubmit () {
    if (textInput.value.length > 0) {
        onUserMessage({ author: 'user', type: 'text', body: { text: textInput.value}})
        textInput.value = ''
    }
}

function toggleVoiceInput (value) {
    isVoiceInputEnabled.value = value
}

async function onVoiceSubmit (audioObject) {
    chatStore.isTranscribing = true
    const data = await speech2text(audioObject.data)
    chatStore.isTranscribing = false
    onUserMessage({ author: 'user', type: 'voice', body: { audioUrl: audioObject.url, transcription: data.decoded_text } })
    toggleVoiceInput(false)
}
</script>

<template>
    <div class="w-full container flex justify-center" >
        <div class="flex w-full lg:inline-flex">
            <VoiceInput v-if="isVoiceInputEnabled" @close="() => toggleVoiceInput(false)" @submit="onVoiceSubmit" />
            <button class="btn btn-outline btn-circle" @click="() => toggleVoiceInput(true)">
                <img src="/svg/micro.svg" alt="">
            </button>
            <input v-model.trim="textInput" placeholder="Напишите что хотите спросить" class="mx-3 input input-accent w-full" @keydown.enter="onMessageSubmit">
            <button class="btn btn-primary" @click="onMessageSubmit" >
                <slot>
                    <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="32" height="32" viewBox="0 0 32 32"
                        fill="white">
                        <path
                            d="M 3.59375 5.34375 L 4.03125 7.21875 L 5.96875 16 L 4.03125 24.78125 L 3.59375 26.65625 L 5.375 25.9375 L 27.375 16.9375 L 29.65625 16 L 27.375 15.0625 L 5.375 6.0625 Z M 6.375 8.65625 L 21.90625 15 L 7.78125 15 Z M 7.78125 17 L 21.90625 17 L 6.375 23.34375 Z">
                        </path>
                    </svg>
                </slot>
            </button>
        </div>
    </div>
</template>

