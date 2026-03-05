from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from datetime import datetime
import os
import uuid
import sqlite3

from .yolo_inference import detect_pothole

app = FastAPI()

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
DB_PATH = os.path.join(BASE_DIR, "pothole.db")

os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Serve uploaded images
app.mount("/uploads", StaticFiles(directory=UPLOAD_FOLDER), name="uploads")

# -------------------- Database Setup --------------------
def init_db():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS issues (
            id TEXT PRIMARY KEY,
            image TEXT,
            confidence REAL,
            count INTEGER,
            time TEXT,
            status TEXT,
            solver_name TEXT,
            resolved_time TEXT
        )
    """)

    conn.commit()
    conn.close()

init_db()

# -------------------- Upload Endpoint (ESP32 Compatible) --------------------
@app.post("/upload/")
async def upload_image(request: Request):
    image_bytes = await request.body()

    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    unique_id = str(uuid.uuid4())[:8]
    filename = f"{timestamp}_{unique_id}.jpg"

    upload_path = os.path.join(UPLOAD_FOLDER, filename)

    # Temporarily save image for detection
    with open(upload_path, "wb") as f:
        f.write(image_bytes)

    # Run detection
    result = detect_pothole(upload_path)

    # 🔥 Only keep image if pothole detected
    if result["count"] >= 1:

        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()

        cursor.execute("""
            INSERT INTO issues (id, image, confidence, count, time, status, solver_name, resolved_time)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            unique_id,
            f"uploads/{filename}",
            result["confidence"],
            result["count"],
            timestamp,
            "unsolved",
            None,
            None
        ))

        conn.commit()
        conn.close()

        return {
            "ai_result": result,
            "message": "Pothole detected and saved"
        }

    else:
        # ❌ No pothole → delete image
        os.remove(upload_path)

        return {
            "ai_result": result,
            "message": "No pothole detected - image discarded"
        }



# -------------------- Get All Issues --------------------
@app.get("/detections/")
def get_detections():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM issues")
    rows = cursor.fetchall()
    conn.close()

    issues = []

    for row in rows:
        issues.append({
            "id": row[0],
            "image": row[1],
            "confidence": row[2],
            "count": row[3],
            "time": row[4],
            "status": row[5],
            "solver_name": row[6],
            "resolved_time": row[7],
        })

    return issues

# -------------------- Solve Issue --------------------
class SolveRequest(BaseModel):
    solver_name: str
    resolved_time: str

@app.post("/solve/{issue_id}")
def solve_issue(issue_id: str, data: SolveRequest):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    cursor.execute("""
        UPDATE issues
        SET status = ?, solver_name = ?, resolved_time = ?
        WHERE id = ?
    """, (
        "solved",
        data.solver_name,
        data.resolved_time,
        issue_id
    ))

    conn.commit()
    conn.close()

    return {"message": "Issue marked as solved"}
