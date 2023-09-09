import json
import string
import random

from db.database import get_db

def generate_id(length: int = 12):
    return ''.join([random.choice(string.digits + string.ascii_letters) for i in range(length)])


db = get_db()

data = ''
with open('scripts/dump.json', 'r') as f:
    data = json.load(f)


for serie, faults in data.items():
    print(serie)
    series = serie.split(',')

    for fault in faults:
        db.knowledgebase.insert_one({**fault, 'series': series, '_id': generate_id()})