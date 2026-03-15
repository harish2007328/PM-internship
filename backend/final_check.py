import os
import pandas as pd
import pickle
from engine import find_matches

user = {
    'location': 'Tenkasi',
    'skills': 'C++, Cloud Computing, Machine Learning, Python', # Matches Microsoft perfectly
    'major': 'Computer Science'
}

matches = find_matches(user)
print("FINAL SORTING VERIFICATION:")
print("-" * 30)

for i, m in enumerate(matches[:5]):
    category = "STIPEND" if i < 3 else "NEARNESS"
    print(f"{i+1}. [{category}] {m['company']} - {m['role']} ({m['location']})")
    print(f"   Score: {m['score']*100:.1f}% | Stipend: {m['stipend']} | Risk: {m['financial_risk']}")

# Validation checks
top_score = matches[0]['score']
if top_score == 1.0:
    print("\nSUCCESS: Matches reach exactly 100% accuracy.")
else:
    print(f"\nNOTE: Top score is {top_score*100:.1f}%. Check skill string alignment.")

stipends = [m['stipend'] for m in matches[:3]]
if stipends == sorted(stipends, reverse=True):
    print("SUCCESS: Top 3 are ranked by highest stipend.")
else:
    print("WARNING: Top 3 sorting by stipend might be affected by skill overlap threshold.")
