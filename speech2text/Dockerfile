FROM nvcr.io/nvidia/pytorch:21.12-py3 as builder
FROM tiangolo/uvicorn-gunicorn-fastapi:python3.8

# install python reqs
RUN pip install --no-cache-dir aiofiles
RUN pip install --no-cache-dir -U openai-whisper

RUN apt update && apt install ffmpeg --yes

ENV PYTHONPATH=$PYTHONPATH:/src
ENV PYTHONPATH=$PYTHONPATH:/tiktoken

CMD ["uvicorn", "api:app", "--host", "0.0.0.0", "--port", "80"]