from pymongo import MongoClient
from pymongo.database import Database


def get_db():
    client = MongoClient()
    db = client.rzd_hack

    return db
