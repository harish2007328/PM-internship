import requests
import json

USER_ID = "some-user-id" # Need a real one from users.csv

def test():
    try:
        # Get a real user_id first
        users = requests.get("http://127.0.0.1:8000/users").json()
        if not users:
            print("No users found")
            return
        user_id = users[0]['user_id']
        print(f"Testing for user_id: {user_id}")
        
        matches = requests.get(f"http://127.0.0.1:8000/matches/{user_id}").json()
        if matches:
            print(f"First match keys: {matches[0].keys()}")
            print(f"Required Skills: {matches[0].get('required_skills')}")
        else:
            print("No matches found")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test()
