import { Speech2TextResponse } from '../../types/api'
import { api } from './'

export function speech2text (audio: Blob): Promise<Speech2TextResponse> {
    const form = new FormData()
    form.append('audio', audio)
    return api.post('/speech-to-text/decode', form, { headers: { 'Content-Type': 'multipart/form-data' } })
}

export async function text2speech (text: string): Promise<Blob> {
    const data = await api.get('/text-to-speech', { params: { text } })
    return new Blob()
}

export function getText2SpeechLink (text: string) {
    const url = 'http://178.205.132.246:8079' //import.meta.env.VITE_API_URL
    return `${url}/text2speech?text=${text}`
}