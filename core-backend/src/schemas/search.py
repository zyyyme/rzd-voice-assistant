from pydantic import BaseModel


class SearchResponse(BaseModel):
    text: str
    document_id: str


class ClarificationResponse(BaseModel):
    text: str