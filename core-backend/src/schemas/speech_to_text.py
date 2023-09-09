from pydantic import BaseModel


class DecodeResponse(BaseModel):
    decoded_text: str


class ValidatedResponse(BaseModel):
    original_text: str
    validation_questions: list[str]