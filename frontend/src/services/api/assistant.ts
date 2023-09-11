import { v4 as uuid } from 'uuid'
import { api } from './'

const conversationAPiUrl = import.meta.env.VITE_CONVERSATION_API_URL

import { hasApiMocked, hasConversationMocked } from '../../utils/config'
import { DocumentMessageBody, Message } from '../../types/chat'
import {
  SearchResponse,
  CheckConverstionResponse,
  QaResponse,
  KnowledgeBaseArticle
} from '../../types/api'


export async function searchByQuery(query: string): Promise<SearchResponse> {
  return await api.get<any, SearchResponse>('/search', { params: { query } })
}

const conversationMock = { text: 'Не понял, уточни, пожалуйста', ok: false }

export async function checkConversation(history: Message[]): Promise<CheckConverstionResponse> {
  let sessionId = sessionStorage.getItem('sessionId')
  if (!sessionId) {
    sessionId = uuid()
    sessionStorage.setItem('sessionId', sessionId)
  }
 
  if (hasConversationMocked) return conversationMock
  let resp
  try {
    resp = await api.post<null, CheckConverstionResponse>(
        conversationAPiUrl + '/refine',
      { history },
      { headers: {
        'X-Session': sessionId
      } }
    )
  } catch (error) {
    return conversationMock
  }
  return resp
}

export async function getQaAnswer(
  document: KnowledgeBaseArticle,
  userQuery: string
): Promise<QaResponse> {
  if (hasConversationMocked) return conversationMock
  const { fault, reason, solution } = document
  return api.post(conversationAPiUrl +'/qa', { fault, reason, solution, user_query: userQuery })
}
