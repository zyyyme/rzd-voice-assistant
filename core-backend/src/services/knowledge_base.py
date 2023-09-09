from db.database import get_db


def get_all(train_series: str, page: int, limit: int):
    db = get_db()
    print(db)

    docs = list(db.knowledgebase.find({'series': train_series}).sort('_id').limit(limit).skip((page - 1) * limit))
    total = db.knowledgebase.count_documents({'series': train_series})
    for doc in docs:
        doc['id'] = str(doc['_id'])
        del doc['_id']

    return docs, total

def get_by_id(doc_id: str):
    db = get_db()
    doc = db.knowledgebase.find_one({'_id': doc_id})

    doc['id'] = doc.pop('_id')
    return doc