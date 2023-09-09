from fastapi import APIRouter
from fastapi.responses import FileResponse, StreamingResponse

r = APIRouter(prefix='/text-to-speech', tags=['text-to-speech'])


@r.get('/encode')
def encode_text(text: str):
    def iterfile():
        with open('test.wav', mode='rb') as file_like:
            yield from file_like

    return StreamingResponse(iterfile(), media_type='audio/wav')