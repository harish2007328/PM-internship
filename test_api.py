import urllib.request
import urllib.error
import json

url = "http://localhost:8000/register"
payload = {
    "name": "Test User",
    "email": "test@example.com",
    "caste": "General",
    "location": "Mumbai",
    "family_income": "< 2L",
    "major": "Computer Science",
    "skills": "Python, React"
}

def test_post():
    print("Testing POST /register...")
    data = json.dumps(payload).encode('utf-8')
    req = urllib.request.Request(url, data=data, method='POST')
    req.add_header('Content-Type', 'application/json')
    try:
        with urllib.request.urlopen(req) as response:
            print(f"Status: {response.getcode()}")
            print(f"Response: {response.read().decode()}")
    except urllib.error.HTTPError as e:
        print(f"Status: {e.code}")
        print(f"Response: {e.read().decode()}")
    except Exception as e:
        print(f"Error: {e}")

def test_options():
    print("\nTesting OPTIONS /register (Preflight)...")
    req = urllib.request.Request(url, method='OPTIONS')
    req.add_header('Origin', 'http://localhost:5178')
    req.add_header('Access-Control-Request-Method', 'POST')
    req.add_header('Access-Control-Request-Headers', 'Content-Type')
    try:
        with urllib.request.urlopen(req) as response:
            print(f"Status: {response.getcode()}")
            print(f"Headers: {dict(response.info())}")
    except urllib.error.HTTPError as e:
        print(f"Status: {e.code}")
        print(f"Response: {e.read().decode()}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_post()
    test_options()
