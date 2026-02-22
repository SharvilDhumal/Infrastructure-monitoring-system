import sqlite3
import os

DB_PATH = r"c:\Users\User\OneDrive\collage work\pothole-detection-system\backend\app\pothole.db"

if not os.path.exists(DB_PATH):
    print("Database file not found!")
else:
    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        cursor.execute("SELECT count(*) FROM issues")
        count = cursor.fetchone()[0]
        print(f"Total issues: {count}")
        
        cursor.execute("SELECT id, status FROM issues LIMIT 5")
        rows = cursor.fetchall()
        for row in rows:
            print(f"ID: {row[0]}, Status: {row[1]}")
            
        conn.close()
    except Exception as e:
        print(f"Error reading database: {e}")
