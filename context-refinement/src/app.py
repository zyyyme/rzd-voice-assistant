from fastapi import FastAPI
from pydantic import BaseModel
from typing import List, Literal, Dict
from oai import configure_openai, SYSTEM_PROMPT
import openai



app = FastAPI()


@app.on_event("startup")
def startup():
    configure_openai()


class Speech(BaseModel):
    role: Literal["assistent", "user"]
    text: str


class Request(BaseModel):
    context: List[Speech]


class Response(BaseModel):
    text: str
    ok: bool


def convert_speech_to_message(speech: Speech) -> Dict[str, str]:
    return {"role": "user" if speech.role == "user" else "assistant", "content": speech.text}


@app.post('/refine')
def refine(request: Request) -> Response:
    messages = [{"role": "system", "content": SYSTEM_PROMPT}]
    messages.extend(convert_speech_to_message(speech) for speech in request.context)

    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=messages,
    )

    return Response(ok=False, text=response["choices"][0]["message"]["content"])
