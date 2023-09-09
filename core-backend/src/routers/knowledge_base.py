from fastapi import APIRouter

from services import knowledge_base
from schemas.knowledge_base import KnowledgeBaseResponse

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