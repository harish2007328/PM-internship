import pandas as pd
from engine import find_matches, get_shortlisted_candidates

def test_engine():
    print("--- Testing Matching Engine ---")
    
    # Mock user profile
    user = {
        'user_id': 'u1',
        'name': 'Test User',
        'major': 'Computer Science',
        'skills': 'Python, Machine Learning, SQL',
        'location': 'Mumbai',
        'caste': 'OBC'
    }
    
    # Mock candidates
    candidates = pd.DataFrame([
        {'user_id': 'c1', 'name': 'Alice', 'score': 0.95, 'caste': 'General'},
        {'user_id': 'c2', 'name': 'Bob', 'score': 0.90, 'caste': 'General'},
        {'user_id': 'c3', 'name': 'Charlie', 'score': 0.85, 'caste': 'SC'},
        {'user_id': 'c4', 'name': 'David', 'score': 0.80, 'caste': 'OBC'},
    ])
    
    print("\n1. Testing Shortlisting (3x Rule)...")
    shortlist = get_shortlisted_candidates('job1', candidates)
    for i, c in enumerate(shortlist):
        print(f"Candidate {i+1}: {c['name']} (Score: {c['score']}, Caste: {c['caste']})")
    
    assert len(shortlist) == 3
    assert shortlist[0]['name'] == 'Alice' # Top Merit
    assert shortlist[1]['name'] == 'Bob'   # Second Merit
    assert shortlist[2]['name'] == 'Charlie' # Top Reserved (SC)
    
    print("\nVerification Successful!")

if __name__ == "__main__":
    test_engine()
