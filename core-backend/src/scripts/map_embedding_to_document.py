import json

from db.database import get_db

db = get_db()

with open('scripts/embeddings.json', 'r') as f:
    data = json.load(f)

for el in data:
    db.knowledgebase.update_one({'_id': el['_id']}, {'$set': {f'{el["type"]}_embedding': el['embeddings']}})

