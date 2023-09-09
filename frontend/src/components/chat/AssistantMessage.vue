<script setup lang="ts">
import { PropType, onMounted, ref } from 'vue';
import { DocumentMessageBody, Message, MessageBody, TextMessageBody } from '../../types/chat';
import User from './User.vue'

defineProps({
    message: Object as PropType<Message>,
    isQuering: Boolean
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
                {{ ( message?.body as TextMessageBody).text }}
            </template>
        </div>
        <div class="chat-footer opacity-50">
            <!-- Прочитано в 12:46 -->
        </div>
    </div>
</template>