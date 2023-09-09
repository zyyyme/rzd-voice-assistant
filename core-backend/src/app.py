from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routers.knowledge_base import r as knowledge_base_router
from routers.speech_to_text import r as stt_router
from routers.search import r as search_router
from routers.text_to_speech import r as tts_router

app = FastAPI()
app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
        expose_headers=["*"],
    )

app.include_router(knowledge_base_router)
app.include_router(search_router)
app.include_router(stt_router)
app.include_router(tts_router)


@app.get('/ping')
def ping():
    return 'pong'