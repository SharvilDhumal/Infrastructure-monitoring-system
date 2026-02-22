@echo off
echo Starting Backend Server...
cd backend
python -m uvicorn app.main:app --reload --port 8000
pause
