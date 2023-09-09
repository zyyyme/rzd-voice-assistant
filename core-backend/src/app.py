from fastapi import FastAPI

from routers.knowledge_base import r as knowledge_base_router
from routers.speech_to_text import r as stt_router
from routers.search import r as search_router

app = FastAPI()
app.include_router(knowledge_base_router)
app.include_router(search_router)
app.include_router(stt_router)


@app.get('/ping')
def ping():
    return 'pong'