from fastapi import FastAPI
from annoy import AnnoyIndex

from vectorizer import vectorize

app = FastAPI()

u = AnnoyIndex(768, 'angular')
u.load('index.ann')

@app.get('/search')
def search(query: str):
    vectorized = vectorize(query)

    return {'result': [u.get_item_vector(i) for i in u.get_nns_by_vector(vectorized, 5)]}
