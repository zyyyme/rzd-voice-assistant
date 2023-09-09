from fastapi import APIRouter

from services import knowledge_base
from schemas.knowledge_base import KnowledgeBaseResponse, KnowledgeBaseElement

r = APIRouter(prefix='/knowledge-base', tags=['knowledge-base'])


@r.get('/', response_model=KnowledgeBaseResponse)
def get_all(train_series: str, page: int = 1, limit: int = 100):
    docs, total = knowledge_base.get_all(train_series, page, limit)
    return {
        'docs': docs,
        'page': page,
        'limit': limit,
        'total': total,
        'pages': total // limit
    }

@r.get('/{doc_id}', response_model=KnowledgeBaseElement)
def get_by_id(doc_id: str):
    return knowledge_base.get_by_id(doc_id)