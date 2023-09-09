import json

from db.database import get_db


db = get_db()

data = ''
with open('scripts/dump.json', 'r') as f:
    data = json.load(f)


for serie, faults in data.items():
    print(serie)
    series = serie.split(',')

    for fault in faults:
        db.knowledgebase.insert_one({**fault, 'series': series})