from pydantic import BaseModel

class KnowledgeBaseElement(BaseModel):
    fault: str
    reason: str
    solution: str
    id: str


class KnowledgeBaseResponse(BaseModel):
    docs: list[KnowledgeBaseElement]
    page: int
    limit: int
    total: int
    pages: int