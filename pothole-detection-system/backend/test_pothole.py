import requests
import os

# Configuration
API_URL = "http://localhost:8000/upload/"
# Use a dummy small image or any existing jpg in the directory
# Let's create a small dummy byte stream if no file is found, but usually there's one in uploads
SAMPLE_IMAGE_PATH = os.path.join(os.path.dirname(__file__), "app", "uploads", "test_sample.jpg")

def test_upload():
    print(f"Testing upload to {API_URL}...")
    
    # Try to find a real image to use for testing
    real_sample_path = os.path.join(os.path.dirname(__file__), "app", "uploads", "20260211_193321_35f5f794.jpg")
    if os.path.exists(real_sample_path):
        current_sample_path = real_sample_path
        print(f"Using real sample image: {real_sample_path}")
    else:
        # Fallback to dummy if none found (will likely fail YOLO but test endpoint)
        current_sample_path = SAMPLE_IMAGE_PATH
        if not os.path.exists(current_sample_path):
            os.makedirs(os.path.dirname(current_sample_path), exist_ok=True)
            with open(current_sample_path, "wb") as f:
                f.write(b"\xFF\xD8\xFF\xE0" + b"\x00" * 100 + b"\xFF\xD9")
            print(f"Created fallback dummy image at {current_sample_path}")

    try:
        with open(current_sample_path, "rb") as f:
            image_bytes = f.read()
            
        print("Sending request...")
        response = requests.post(API_URL, data=image_bytes)
        
        if response.status_code == 200:
            print("Success!")
            print("Response:", response.json())
            print("\nCheck your dashboard now to see if the new detection appeared.")
        else:
            print(f"Failed! Status code: {response.status_code}")
            print("Response:", response.text)
            
    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == "__main__":
    test_upload()
