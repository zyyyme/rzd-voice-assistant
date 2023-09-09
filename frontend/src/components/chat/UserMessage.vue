<script setup lang="ts">
import { PropType, toRefs } from 'vue'
import User from './User.vue'
import { TextMessageBody, VoiceMessageBody } from '../../types/chat';

const props = defineProps({
    message: Object as PropType<import('../../types/chat').Message>,
    isLatest: {},
})

const { message, isLatest } = toRefs(props)

</script>

<template>
    <div class="chat chat-end">
        <User class="chat-image" />
        <div class="chat-header">
            Вы
            <time class="text-xs opacity-50">12:46</time>
        </div>
        <div class="chat-bubble bg-white border border-gray-400 text-black">
            <template v-if="message?.type === 'text'">
                <p> {{ (message.body as TextMessageBody).text }} </p>
            </template>
            <template v-else-if="message?.type === 'voice'">
                <audio class="ml-[-15px] mt-[-5px] md:m-0" controls :src="(message.body as VoiceMessageBody).audioUrl"
                    controlslist="nodownload noplaybackrate nomute"></audio>
                <p class="text-gray-700 pl-3"> &gt; {{ (message.body as VoiceMessageBody).transcription }}</p>
            </template>
        </div>
        <div class="chat-footer opacity-50" v-if="isLatest">
            Прочитано в 12:46
        </div>
    </div>
</template>