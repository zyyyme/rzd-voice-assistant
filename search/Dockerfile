FROM python:3

WORKDIR .

COPY requirements.txt ./
RUN pip install -r requirements.txt -vvv

COPY ./src ./

# TODO: update
CMD [ "uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8002" ]
