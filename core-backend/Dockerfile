FROM python:3

WORKDIR .

COPY requirements.txt ./
RUN pip install -r requirements.txt

COPY ./ ./

# TODO: update
CMD [ "uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000" ]
