import { v4 as uuid } from 'uuid'

import { api } from './'

import { hasApiMocked } from '../../utils/config'
import { DocumentMessageBody } from '../../types/chat'
import { SearchResponse } from '../../types/api'

const responseQueryMock: DocumentMessageBody = {
    text: 'Да ну тебя, не буду отвечать',
    referenceId: '1',
    id: '1'
}

export async function searchByQuery (query: string): Promise<SearchResponse> {
    // if (hasApiMocked()) return responseQueryMock
    const result = await api.get<any, SearchResponse>('/search', { params: { query } })
    return result
    // const messageBody: DocumentMessageBody = {
    //     text: result.text,
    //     referenceId: result.documents[0].id,
    //     id: uuid()
    // }
    // return messageBody
}