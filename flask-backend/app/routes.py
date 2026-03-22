from flask import Blueprint, jsonify, Response
from .database import issues
import json
from bson import json_util

main_bp = Blueprint('main', __name__)

@main_bp.route('/')
def index():
    return jsonify({
        "message": "Welcome to the Smart City Infrastructure API",
        "status": "online",
        "collections_ready": ["assigned_issues", "potholes", "streetlights", "issues", "bridges"]
    })

@main_bp.route('/test-db')
def test_db():
    try:
        # Fetch one sample document from the 'issues' collection
        sample_issue = issues.find_one()
        
        if sample_issue:
            # Safely serialize ALL MongoDB types directly to a JSON string
            response_data = {
                "status": "success",
                "message": "Connected to database successfully",
                "data": sample_issue
            }
            return Response(
                json_util.dumps(response_data),
                mimetype='application/json'
            )
        else:
            return Response(
                json_util.dumps({
                    "status": "success",
                    "message": "Connected to database, but collection 'issues' is empty",
                    "data": None
                }),
                mimetype='application/json'
            )
    except Exception as e:
        return Response(
            json_util.dumps({
                "status": "error",
                "message": f"Database interaction failed: {str(e)}"
            }),
            mimetype='application/json',
            status=500
        )
