<script setup lang="ts">
import { nextTick, ref, onMounted } from 'vue'
import { DocumentMessageBody, Message, MessageBody, MessageType, TextMessageBody, VoiceMessageBody } from '../../types/chat'
import { useChat, BusEvents, bus } from '../../composables/useChat'
import { useChatStore } from '../../stores/chat'
import { checkConversation, getQaAnswer, searchByQuery } from '../../services/api/assistant'

import UserMessage from './UserMessage.vue'
import AssistantMessage from './AssistantMessage.vue'
import { StopIcon } from '@heroicons/vue/24/solid'

import { storeToRefs } from 'pinia'


// Pinia: Chat Store
const chatStore = useChatStore()
const { isQuering, assistantState } = storeToRefs(chatStore)

const chatContainer = ref()

const startMessage: Message = {
    author: 'assistant',
    type: 'text',
    body: { text: 'Привет! Задай вопрос, можешь даже голосом' }
}

const mock: Message[] = [
    startMessage,
    {
        author: 'assistant',
        type: 'text',
        body: { text: 'Да норм. Че дальше?' }
    },
    {
        author: 'user',
        type: 'voice',
        body: { audioUrl: '/audio/sample.m4a', transcription: 'Kek' }
    },
    {
        author: 'assistant',
        type: 'text',
        body: { text: 'Да норм. Че дальше?' }
    },
    {
        author: 'user',
        type: 'text',
        body: { text: 'Хуяльше. Ты гей!' }
    },
    {
        author: 'assistant',
        type: 'text',
        body: { text: 'Да норм. Че дальше?' }
    },
    {
        author: 'user',
        type: 'text',
        body: { text: 'Хуяльше. Ты гей!' }
    },
    {
        author: 'assistant',
        type: 'text',
        body: { text: 'Да норм. Че дальше?' }
    },
    {
        author: 'user',
        type: 'text',
        body: { text: 'Хуяльше. Ты гей!' }
    }]

const messages = ref<Message[]>([startMessage])

async function scrollChatToBottom() {
    await nextTick()
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
}

function addMessage(newMessage: Message) {
    messages.value.push(newMessage)
    scrollChatToBottom()
}

onMounted(()=> {
    chatStore.$patch(state => state.assistantState = 'idle')
})

async function onUserMessageSubmit(userMessage: Message) {
    const query = userMessage.type === 'text' ? (userMessage.body as TextMessageBody).text : (userMessage.body as VoiceMessageBody).transcription
    if (!query) return  

    addMessage(userMessage)

    if (assistantState.value === 'idle') {

        messages.value.push({
            type: 'document',
            author: 'assistant',
            body: null
        })

        chatStore.$patch(state => state.isQuering = true)

        // OpeanAi check conversation
        const assistantVerifyResponse = await checkConversation(messages.value)
        const isConversation = !assistantVerifyResponse.ok

        if (isConversation) {
            messages.value[messages.value.length - 1] = {
                type: 'text',
                author: 'assistant',
                body: {
                    text: assistantVerifyResponse.text
                }
            }
        } else {
            try {
                const result = await searchByQuery(query)
                messages.value[messages.value.length - 1] = {
                    type: 'document',
                    author: 'assistant',
                    body: {
                        text: result.text,
                        referenceId: result.documents[0].id,
                        documents: result.documents
                    }
                }
                chatStore.$patch(state => state.assistantState = 'qa')
                scrollChatToBottom()
            } catch (error) {
                console.log(error);
            }
        }

        chatStore.$patch(state => state.isQuering = false)

    } else if (assistantState.value === 'qa') {

        chatStore.$patch(state => state.isQuering = true)

        messages.value.push({
            type: 'text',
            author: 'assistant',
            body: null
        })

        const curruntMessages = [...messages.value]

        const lastDocumentMessage = curruntMessages.reverse().find(m => m.type === 'document')
        const document = (lastDocumentMessage?.body as DocumentMessageBody).documents[0] // TODO: change on slider
        const qaResponse = await getQaAnswer(document, query)

        messages.value[messages.value.length - 1] = {
            type: 'text',
            author: 'assistant',
            body: {
                text: qaResponse.answer,
            }
        }

        chatStore.$patch(state => state.isQuering = false)
    }
}

bus.on(BusEvents.USER_MESSAGE, (m) => onUserMessageSubmit(m.message))

function onQaStopClicked() {
    chatStore.$patch(state => state.assistantState = 'idle')
    messages.value.push(startMessage)
    scrollChatToBottom()
}

</script>

<template>
    <div class="container overflow-y-auto" ref="chatContainer">
        <template v-for="(message, idx) in messages">
            <AssistantMessage v-if="message.author === 'assistant'" :message="message"
                :is-quering="(idx === messages.length - 1) && isQuering" />
            <UserMessage v-else :is-latest="idx === messages.length - 1" :message="message" />
        </template>
        <div class="flex justify-center">
            <button v-if="assistantState === 'qa'" class="btn btn-outline btn-sm ml-3" @click="onQaStopClicked"> Остановить разговор <StopIcon class="w-4 h-4" /> </button>
        </div>
    </div>
</template>