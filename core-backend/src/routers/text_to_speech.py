import os

import requests
from fastapi import APIRouter
from fastapi.responses import FileResponse, StreamingResponse

r = APIRouter(prefix='/text-to-speech', tags=['text-to-speech'])


@r.get('/encode')
def encode_text(text: str):
    with requests.get(os.getenv('TTS_URL', 'http://178.205.132.246:8079') + f'/text2speech?text={text}') as r:
        r.raise_for_status()
        with open('stub.wav', 'wb') as f:
            for chunk in r.iter_content(chunk_size=8192):
                # If you have chunk encoded response uncomment if
                # and set chunk_size parameter to None.
                # if chunk:
                f.write(chunk)

    def iterfile():
        with open('stub.wav', mode='rb') as file_like:
            yield from file_like

    return StreamingResponse(iterfile(), media_type='audio/wav')