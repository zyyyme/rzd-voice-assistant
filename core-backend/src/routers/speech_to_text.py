import os
import random

import requests
from fastapi import APIRouter, UploadFile

from schemas.speech_to_text import *

r = APIRouter(prefix='/speech-to-text', tags=['speech-to-text'])


@r.post('/decode', response_model=DecodeResponse)
def decode_voice(audio: UploadFile):
    # return {'decoded_text': random.choice(['Бочок течет, посрать некуда, срочно', '¥å®ik gåy'])}
    res = requests.post(os.getenv('STT_URL', 'http://178.205.132.246:8080') + '/speech2text', files={'file': audio.file}).json()['text']

    return {'decoded_text': res}


@r.get('/validate', response_model=ValidatedResponse)
def validate_decoded(question: str):
    pass