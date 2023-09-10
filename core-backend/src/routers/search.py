import os

import requests
from fastapi import APIRouter

from schemas.search import *
from services.search import search_in_annoy

r = APIRouter(prefix='/search', tags=['search'])


@r.get('/', response_model=SearchResponse)
def search_documents(query: str):
    data = search_in_annoy(query)
    print(data)
    return data


@r.get('/clarify', response_model=ClarificationResponse)
def clarify_documents(query: str):
    pass