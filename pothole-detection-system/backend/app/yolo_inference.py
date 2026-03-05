import os
from ultralytics import YOLO

# Get current directory (backend/app)
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Build correct absolute path to model
MODEL_PATH = os.path.join(BASE_DIR, "models", "pothole.pt")

# Load YOLO model
model = YOLO(MODEL_PATH)


def detect_pothole(image_path):
    results = model(image_path, conf=0.45)

    count = 0
    confidences = []

    for r in results:
        if r.boxes is None:
            continue

        for box in r.boxes:
            count += 1
            confidences.append(float(box.conf[0]))

    return {
        "detected": count > 0,
        "count": count,
        "confidence": max(confidences) if confidences else 0
    }
