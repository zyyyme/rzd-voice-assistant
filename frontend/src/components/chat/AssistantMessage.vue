<script setup lang="ts">
import { PropType, onMounted, ref, computed } from 'vue';
import { DocumentMessageBody, Message, MessageBody, TextMessageBody, VoiceMessageBody } from '../../types/chat';
import User from './User.vue'
import { PlayIcon, StopIcon } from '@heroicons/vue/24/solid'
import { getText2SpeechLink } from '../../services/api/voice'

const props = defineProps({
    message: Object as PropType<Message>,
    isQuering: Boolean
})

const isAudioEnabled = ref(false)

const audioUrl = computed(() => { 
    if (!props.message?.body) return ''
    const text = props.message?.type === 'voice' ? (props.message?.body as VoiceMessageBody).transcription : (props.message?.body as TextMessageBody).text
    return text ? getText2SpeechLink(text) : ''
})

</script>

<template>
    <div class="chat chat-start my-3">
        <User class="chat-image" name="Ассистент" />
        <div class="chat-header"> 
            Ассистент
            <time class="text-xs opacity-50">12:46</time>
        </div>
        <div class="chat-bubble">
            <template v-if="message?.type === 'document'">
                <span v-if="isQuering" class="loading loading-ball text-primary loading-lg"></span>
                <template v-else-if="message?.body">
                    <div class="mb-4">
                        {{  (message?.body as DocumentMessageBody).text  }}
                    </div>
                    <RouterLink class="underline" :to="`/knowledge-base/${( message?.body as DocumentMessageBody).referenceId}`">Референс</RouterLink>
                </template>
            </template>
            <template v-else-if="message?.type === 'text'">
                <span v-if="isQuering" class="loading loading-ball text-primary loading-lg"></span>
                <template v-else-if="message?.body"> 
                    {{ ( message?.body as TextMessageBody).text }}
                </template>
            </template>
        </div>
        <div class="chat-footer opacity-50 mt-2">
            <template v-if="!isQuering">
                <button v-if="!isAudioEnabled" class="btn btn-sm" @click="() => isAudioEnabled = true"> <PlayIcon class="w-4 h-4" /> Слушать </button>
                <audio v-else autoplay controls controlslist="nodownload noplaybackrate nomute" :src="audioUrl" />
            </template>
        </div>
    </div>
</template>