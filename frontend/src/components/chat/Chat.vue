<script setup lang="ts">
import { ref } from 'vue'
import { DocumentMessageBody, Message, MessageBody, MessageType, TextMessageBody, VoiceMessageBody } from '../../types/chat'
import { useChat, BusEvents, bus } from '../../composables/useChat'
import { useChatStore } from '../../stores/chat'
import { searchByQuery } from '../../services/api/assistent'

import UserMessage from './UserMessage.vue'
import AssistantMessage from './AssistantMessage.vue'
import { storeToRefs } from 'pinia'


// Pinia: Chat Store
const chatStore = useChatStore()
const { isQuering } = storeToRefs(chatStore)

const startMessage: Message = {
    author: 'assistent',
    type: 'text',
    body: { text: 'Привет! Задай вопрос, можешь даже голосом' }
}

const mock: Message[] = [
    startMessage,
    {
        author: 'assistent',
        type: 'text',
        body: { text: 'Да норм. Че дальше?' }
    },
    {
        author: 'user',
        type: 'voice',
        body: { audioUrl: '/audio/sample.m4a', transcription: 'Kek' }
    },
    {
        author: 'assistent',
        type: 'text',
        body: { text: 'Да норм. Че дальше?' }
    },
    {
        author: 'user',
        type: 'text',
        body: { text: 'Хуяльше. Ты гей!' }
    },
    {
        author: 'assistent',
        type: 'text',
        body: { text: 'Да норм. Че дальше?' }
    },
    {
        author: 'user',
        type: 'text',
        body: { text: 'Хуяльше. Ты гей!' }
    },
    {
        author: 'assistent',
        type: 'text',
        body: { text: 'Да норм. Че дальше?' }
    },
    {
        author: 'user',
        type: 'text',
        body: { text: 'Хуяльше. Ты гей!' }
    }]

const messages = ref<Message[]>([startMessage])

function addMessage (newMessage: Message) {
    messages.value.push(newMessage)
    // TODO: add scroll down

    // let newMessage: Message = {
    // } 
   
}

async function onUserMessageSubmit (userMessage: Message) {
    addMessage(userMessage)
    if (chatStore.assistantState === 'idle') {
        const query = userMessage.type === 'text' ? ( userMessage.body as TextMessageBody).text : (userMessage.body as VoiceMessageBody).transcription
        if (!query) return 

        messages.value.push({ 
            type: 'document',
            author: 'assistent',
            body: null
        })

        chatStore.$patch( state => state.isQuering = true)

        try {
            const result = await searchByQuery(query)    
            messages.value[messages.value.length - 1] = { 
                type: 'document',
                author: 'assistent',
                body: {
                    text: result.text,
                    referenceId: result.documents[0].id
                }
            }
        } catch (error) {
            console.log(error);
        }
        
        chatStore.$patch( state => state.isQuering = false)
        
    } else { 
        // Alredy quered
    }
}

bus.on(BusEvents.USER_MESSAGE, (m) => onUserMessageSubmit(m.message))

</script>

<template>
    <div class="container overflow-y-auto">
        <template v-for="(message, idx) in messages">
            <AssistantMessage v-if="message.author === 'assistent'"  :message="message" :is-quering="(idx === messages.length - 1) && isQuering"/>
            <UserMessage v-else :is-latest="idx === messages.length - 1" :message="message" />
        </template>
    </div>
</template>