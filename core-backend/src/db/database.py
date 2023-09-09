import os

from pymongo import MongoClient


def get_db():
    client = MongoClient(
        host=os.getenv('DB_HOST', 'localhost'),
        port=os.getenv('DB_PORT', 27017)
    )
    db = client.rzd_hack

    return db
