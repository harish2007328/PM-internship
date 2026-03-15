import pandas as pd
import traceback
import os
import sys

# Add the current directory to path just in case
sys.path.append(os.getcwd())

try:
    from engine import find_matches
    print("Engine imported successfully")
except Exception as e:
    print(f"FAILED to import engine: {e}")
    traceback.print_exc()
    sys.exit(1)

try:
    USERS_CSV = 'users.csv'
    df = pd.read_csv(USERS_CSV)
    user_id = 'e94623d6-1c25-43c2-8038-bdfe373034a3'
    user_row = df[df['user_id'] == user_id]
    
    if user_row.empty:
        print(f"User {user_id} not found in CSV")
        sys.exit(1)
        
    user_profile = user_row.iloc[0].to_dict()
    print(f"Calling find_matches for {user_profile['name']}...")
    matches = find_matches(user_profile)
    print(f"SUCCESS: Found {len(matches)} matches")
except Exception as e:
    print(f"ERROR during find_matches execution: {e}")
    traceback.print_exc()
