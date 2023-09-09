from pydantic import BaseModel


class SearchResponse(BaseModel):
    text: str
    documents: list[dict]


class ClarificationResponse(BaseModel):
    text: str