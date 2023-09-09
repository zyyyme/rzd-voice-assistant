import shutil
import tempfile
from tempfile import NamedTemporaryFile
from pathlib import Path
from typing import List, Dict, Optional

import whisper
from fastapi import FastAPI, UploadFile
from pydantic import BaseModel


app = FastAPI(title="Triton Inference Client")

app.model = whisper.load_model("/models/tiny.pt").to("cuda")

class InferenceInput(BaseModel):
    text: str

@app.get("/ping")
def ping():
    return "Pong"


@app.post("/speech2text")
def speech2text(file: UploadFile):
    
    try:
        suffix = Path(file.filename).suffix
        with NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
                shutil.copyfileobj(file.file, tmp)
    finally:
        file.file.close()
        
    audio = whisper.load_audio(tmp.name)
    audio = whisper.pad_or_trim(audio)

    # make log-Mel spectrogram and move to the same device as the model
    mel = whisper.log_mel_spectrogram(audio).to(app.model.device)

    # decode the audio
    options = whisper.DecodingOptions(language="Russian")
    result = whisper.decode(app.model, mel, options)

    return {"text": result.text}