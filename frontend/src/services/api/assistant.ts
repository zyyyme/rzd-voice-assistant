import { v4 as uuid } from 'uuid'
import { api } from './'

import { hasApiMocked } from '../../utils/config'
import { DocumentMessageBody, Message } from '../../types/chat'
import { SearchResponse, CheckConverstionResponse } from '../../types/api'

const responseQueryMock: DocumentMessageBody = {
    text: 'Да ну тебя, не буду отвечать',
    referenceId: '1',
    id: '1'
}

export async function searchByQuery (query: string): Promise<SearchResponse> {
    return await api.get<any, SearchResponse>('/search', { params: { query } })
}

export async function checkConversation (history: Message[]): Promise<CheckConverstionResponse> {
    if (import.meta.env.VITE_IS_MOCKED_CONVERSATION) return { text: 'Ну и что?', ok: true }
    return api.post('/check', { history })
}