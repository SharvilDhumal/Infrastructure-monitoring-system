from pymongo import MongoClient
import sys
from .config import Config

class Database:
    def __init__(self):
        self.client = None
        self.db = None
        self.connect()

    def connect(self):
        try:
            self.client = MongoClient(Config.MONGO_URI)
            # Specify the database name
            self.db = self.client["auth-db"]
            # Trigger a connection attempt
            self.client.admin.command('ping')
            print("Successfully connected to MongoDB Atlas!")
        except Exception as e:
            print(f"Error connecting to MongoDB: {e}")
            sys.exit(1)

    def get_collection(self, collection_name):
        return self.db[collection_name]

# Global database instance
db_instance = Database()

# Access methods for specific collections
assigned_issues = db_instance.get_collection("assigned_issues")
potholes = db_instance.get_collection("potholes")
streetlights = db_instance.get_collection("streetlights")
issues = db_instance.get_collection("issues")
bridges = db_instance.get_collection("bridges")
