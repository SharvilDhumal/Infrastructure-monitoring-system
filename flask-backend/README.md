# Flask Smart City Backend

This is a production-ready Flask backend connected to MongoDB Atlas.

## Folder Structure
```
flask-backend/
├── app/
│   ├── __init__.py    # App initialization & CORS
│   ├── config.py      # Environment configuration
│   ├── database.py    # Reusable MongoDB module
│   └── routes.py      # API endpoints & JSON serialization
├── .env               # Environment variables (DB credentials)
├── .env.example       # Template for .env
├── requirements.txt   # Python dependencies
└── run.py             # Entry point to start the server
```

## Setup Instructions

1. **Install Dependencies**:
   Open your terminal in the `flask-backend` directory and run:
   ```bash
   pip install -r requirements.txt
   ```

2. **Configure Environment**:
   Ensure your `.env` file has the correct `MONGO_URI`. I have already set this up for you with your provided string.

3. **Run the Server**:
   ```bash
   python run.py
   ```

## API Endpoints
- **GET /**: Health check and ready collections.
- **GET /test-db**: Fetches a sample document from the `issues` collection to verify the database connection.

## Features
- **PyMongo Integration**: Uses `bson.json_util` for robust serialization of MongoDB types like `ObjectId`.
- **CORS Enabled**: Ready for frontend integration.
- **Scalable Structure**: Modular design for adding more routes and logic easily.
