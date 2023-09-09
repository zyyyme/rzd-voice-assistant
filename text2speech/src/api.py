import torch
from pathlib import Path
from typing import List, Dict, Optional

from fastapi import FastAPI, UploadFile, status, HTTPException
from starlette.responses import StreamingResponse
from pydantic import BaseModel

app = FastAPI(title="Triton Inference Client")

app.model = torch.package.PackageImporter("/models/model.pt").load_pickle("tts_models", "model")


@app.get("/ping")
def ping():
    return "Pong"

def get_data_from_file(file_path: str):
    with open(file=file_path, mode="rb") as file_like:
        yield file_like.read()

@app.get("/text2speech")
def text2speech(text: str):
    
    sample_rate = 48000
    speaker='aidar'

    audio_paths = app.model.save_wav(text=str(text),
                                    speaker=speaker,
                                    sample_rate=sample_rate)
    
    file_content = get_data_from_file(audio_paths)
    
    return StreamingResponse(
            content=file_content,
            status_code=status.HTTP_200_OK,
            media_type="text/html",
        )