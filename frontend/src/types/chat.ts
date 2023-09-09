export type Author = 'assistent' | 'user'
export type MessageType = 'text' | 'document' | 'voice'  // 'че-та еще '

export interface Message {
    author: Author
    type: MessageType
    body: MessageBody // И тут же надо будет поддержать документ и войс
}

export type MessageBody = TextMessageBody | VoiceMessageBody | DocumentMessageBody | null

export interface VoiceMessageBody {
    transcription?: string,
    audioUrl: string,
    duration?: number
}

export interface TextMessageBody {
    text: string
}

export interface DocumentMessageBody {
    text: string,
    referenceId: string,
    id?: string
}