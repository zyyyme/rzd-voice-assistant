import os

import requests

from db.database import get_db


def search_in_annoy(query: str):
    db = get_db()
    vectors = requests.get(os.getenv('SEARCH_URL', 'http://localhost:8001') + f'/search?query={query}').json()['result']

    documents = db.knowledgebase.find({'$or': [
        {'reason_embedding': {'$in': vectors}},
        {'fault_embedding': {'$in': vectors}}
    ]})

    processed = {
        'text': documents[0]['solution'],
        'documents': list(map(lambda x: {
            'id': x['_id'],
            'fault': x['fault'],
            'reason': x['reason'],
            'solution': x['solution'],
            'series': x['series']
        }, documents))
    }

    return processed