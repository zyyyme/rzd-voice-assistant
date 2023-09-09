FROM nvcr.io/nvidia/pytorch:21.12-py3 as builder
FROM tiangolo/uvicorn-gunicorn-fastapi:python3.8

# install python reqs
RUN pip install --no-cache-dir aiofiles
RUN pip install --no-cache-dir -U openai-whisper

RUN apt update && apt install ffmpeg --yes

RUN pip install blobfile
ENV PYTHONPATH=$PYTHONPATH:/src

COPY ./vocab/openai_public.py /usr/local/lib/python3.8/site-packages/tiktoken_ext/openai_public.py

CMD ["uvicorn", "api:app", "--host", "0.0.0.0", "--port", "80"]