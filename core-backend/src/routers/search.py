from fastapi import APIRouter

from schemas.search import *

r = APIRouter(prefix='/search', tags=['search'])


@r.get('/', response_model=SearchResponse)
def search_documents(query: str):
    pass


@r.get('/clarify', response_model=ClarificationResponse)
def clarify_documents(query: str):
    pass