FROM python:3

WORKDIR .

COPY requirements.txt ./
RUN pip install -r requirements.txt -vvv

COPY ./src ./

RUN pip install --upgrade openai

CMD [ "uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8002" ]
