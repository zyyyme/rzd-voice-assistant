import { ref } from 'vue'
import mitt, { Emitter } from 'mitt'
import { Message } from "../types/chat"

interface UseChatConfig {
}

export const BusEvents = {
    USER_MESSAGE: 'user-message'
  } as const

type IBusEvents = {
    [BusEvents.USER_MESSAGE]: {
        message: Message
    }
}

export const bus: Emitter<IBusEvents> = mitt()

export function useChat (config?: UseChatConfig) {
    const history = ref<Message[]>([])

    function onUserMessage (message: Message) {
        console.log('onUserMessage:', message);
        history.value.push(message)
        bus.emit(BusEvents.USER_MESSAGE, { message })
    }
    
    return {
        onUserMessage,
        history,
        bus
    }
}