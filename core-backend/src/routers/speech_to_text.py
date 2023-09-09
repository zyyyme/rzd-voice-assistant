from fastapi import APIRouter, UploadFile

from schemas.speech_to_text import *

r = APIRouter(prefix='/speech-to-text', tags=['speech-to-text'])


@r.post('/decode', response_model=DecodeResponse)
def decode_voice(audio: UploadFile):
    pass


@r.get('/validate', response_model=ValidatedResponse)
def validate_decoded(question: str):
    pass