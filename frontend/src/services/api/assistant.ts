import { v4 as uuid } from 'uuid'
import { api } from './'

import { hasApiMocked } from '../../utils/config'
import { DocumentMessageBody, Message } from '../../types/chat'
import { SearchResponse, CheckConverstionResponse, QaResponse, KnowledgeBaseArticle } from '../../types/api'

export async function searchByQuery (query: string): Promise<SearchResponse> {
    return await api.get<any, SearchResponse>('/search', { params: { query } })
}

export async function checkConversation (history: Message[]): Promise<CheckConverstionResponse> {
    if (import.meta.env.VITE_IS_MOCKED_CONVERSATION) return { text: 'Ну и что?', ok: true }
    return api.post('/check', { history })
}

export async function getQaAnswer(document: KnowledgeBaseArticle, userQuery: string): Promise<QaResponse> {
    if (import.meta.env.VITE_IS_MOCKED_CONVERSATION) return { answer: 'Я не понимаю, спроси еще' }
    const { fault, reason, solution } = document
    return api.post('/qa', { fault, reason, solution, user_query: userQuery })
}