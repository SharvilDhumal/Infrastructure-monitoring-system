from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from datetime import datetime
import os
import uuid
from pymongo import MongoClient

from .yolo_inference import detect_pothole

from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

app = FastAPI()

@app.get("/")
def read_root():
    return {"status": "ok", "message": "Pothole Detection API is Running"}

# -------------------- CORS --------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------- Paths --------------------
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
UPLOAD_FOLDER = os.path.join(BASE_DIR, "uploads")

os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Serve uploaded images
app.mount("/uploads", StaticFiles(directory=UPLOAD_FOLDER), name="uploads")

# -------------------- MongoDB Setup --------------------
MONGO_URI = os.getenv("MONGO_URI")
if not MONGO_URI:
    # Fallback to local for development if .env is missing, 
    # but for production it MUST be in .env
    MONGO_URI = "mongodb://localhost:27017/auth-db"
    print("WARNING: MONGO_URI not found in .env, using fallback.")

client = MongoClient(MONGO_URI)
db = client["auth-db"]
potholes_col = db["potholes"]

# -------------------- Upload Endpoint (ESP32 Compatible) --------------------
@app.post("/upload/")
async def upload_image(request: Request):
    image_bytes = await request.body()

    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    unique_id = str(uuid.uuid4())[:8]
    filename = f"{timestamp}_{unique_id}.jpg"

    upload_path = os.path.join(UPLOAD_FOLDER, filename)

    # Temporarily save image
    try:
        # Save temp image
        with open(upload_path, "wb") as f:
            f.write(image_bytes)

        # Run detection
        result = detect_pothole(upload_path)

        # 🔥 Only keep image if pothole detected
        if result.get("count", 0) >= 1:
            issue_data = {
                "id": unique_id,
                "image": f"uploads/{filename}",
                "confidence": result.get("confidence", 0),
                "count": result.get("count", 0),
                "time": timestamp,
                "status": "unsolved",
                "solver_name": None,
                "resolved_time": None
            }
            
            potholes_col.insert_one(issue_data)

            return {
                "ai_result": result,
                "message": "Pothole detected and saved"
            }

        else:
            # ❌ No pothole → delete image
            if os.path.exists(upload_path):
                os.remove(upload_path)

            return {
                "ai_result": result,
                "message": "No pothole detected - image discarded"
            }
    except Exception as e:
        print(f"Error during image upload or processing: {e}")
        return {"status": "error", "message": str(e)}, 500
    finally:
        # Ensure the temporary image is removed if it still exists and no pothole was detected
        if os.path.exists(upload_path) and result.get("count", 0) < 1:
            os.remove(upload_path)


# -------------------- Get All Issues --------------------
@app.get("/detections/")
def get_detections():
    issues = list(potholes_col.find({}, {"_id": 0}))
    return issues

# -------------------- Solve Issue --------------------
class SolveRequest(BaseModel):
    solver_name: str
    resolved_time: str

@app.post("/solve/{issue_id}")
def solve_issue(issue_id: str, data: SolveRequest):
    result = potholes_col.update_one(
        {"id": issue_id},
        {"$set": {
            "status": "solved",
            "solver_name": data.solver_name,
            "resolved_time": data.resolved_time
        }}
    )

    if result.matched_count == 0:
        return {"message": "Issue not found"}, 404

    return {"message": "Issue marked as solved"}
    

