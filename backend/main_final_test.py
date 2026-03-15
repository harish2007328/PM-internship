from fastapi import FastAPI, HTTPException, Body, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import pandas as pd
import os
import traceback
import uuid
from engine import find_matches, index_jobs, get_shortlisted_candidates
from pydantic import BaseModel
from typing import List, Optional

app = FastAPI()

# Enable CORS for React frontend (Targeting the specific dev server address)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5178", "http://127.0.0.1:5178"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.middleware("http")
async def catch_exceptions_middleware(request: Request, call_next):
    try:
        response = await call_next(request)
        return response
    except Exception as exc:
        print(f"!!! CRITICAL BACKEND ERROR: {str(exc)} !!!")
        traceback.print_exc()
        return JSONResponse(
            status_code=500,
            content={"detail": "Internal Server Error", "error": str(exc)},
            headers={
                "Access-Control-Allow-Origin": "http://localhost:5178",
                "Access-Control-Allow-Credentials": "true",
            }
        )

USERS_CSV = 'users.csv'
JOBS_CSV = 'jobs.csv'

class UserProfile(BaseModel):
    name: str
    email: str
    caste: str
    location: str
    family_income: str
    major: str
    skills: str

class InternshipPost(BaseModel):
    company: str
    role: str
    sector: str
    required_skills: str
    location: str
    stipend: int

@app.on_event("startup")
async def startup_event():
    # Ensure CSVs exist
    if not os.path.exists(USERS_CSV):
        pd.DataFrame(columns=['user_id', 'name', 'email', 'caste', 'location', 'family_income', 'major', 'skills']).to_csv(USERS_CSV, index=False)
    if not os.path.exists(JOBS_CSV):
        pd.DataFrame(columns=['job_id', 'company', 'role', 'sector', 'required_skills', 'location', 'stipend']).to_csv(JOBS_CSV, index=False)

@app.post("/register")
async def register_user(profile: UserProfile):
    print(f"--- Received Registration Request ---")
    print(f"Profile: {profile.dict()}")
    user_id = str(uuid.uuid4())
    new_user = {
        "user_id": user_id,
        "name": profile.name,
        "email": profile.email,
        "caste": profile.caste,
        "location": profile.location,
        "family_income": profile.family_income,
        "major": profile.major,
        "skills": profile.skills
    }
    
    try:
        # Load existing users or create if missing
        if os.path.exists(USERS_CSV):
            df = pd.read_csv(USERS_CSV)
        else:
            df = pd.DataFrame(columns=['user_id', 'name', 'email', 'caste', 'location', 'family_income', 'major', 'skills'])
            
        df = pd.concat([df, pd.DataFrame([new_user])], ignore_index=True)
        df.to_csv(USERS_CSV, index=False)
        print(f"User saved successfully. Total users: {len(df)}")
        return {"status": "success", "user_id": user_id}
    except Exception as e:
        print(f"Error saving user: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/internships")
async def post_internship(job: InternshipPost):
    job_id = str(uuid.uuid4())
    new_job = {
        "job_id": job_id,
        "company": job.company,
        "role": job.role,
        "sector": job.sector,
        "required_skills": job.required_skills,
        "location": job.location,
        "stipend": job.stipend
    }
    
    df = pd.read_csv(JOBS_CSV)
    df = pd.concat([df, pd.DataFrame([new_job])], ignore_index=True)
    df.to_csv(JOBS_CSV, index=False)
    
    # Re-index jobs
    index_jobs()
    
    return {"status": "success", "job_id": job_id}

@app.get("/matches/{user_id}")
async def get_user_matches(user_id: str):
    print(f"Fetching matches for user_id: {user_id}")
    try:
        users_df = pd.read_csv(USERS_CSV)
        user_row = users_df[users_df['user_id'] == user_id]
        
        if user_row.empty:
            print(f"Warning: User {user_id} not found in {USERS_CSV}")
            return []
        
        user_profile = user_row.iloc[0].to_dict()
        print(f"User Profile for matching: {user_profile}")
        
        matches = find_matches(user_profile)
        if matches:
            print(f"Success: Found {len(matches)} matches. Top score: {matches[0]['score']}")
        else:
            print(f"Warning: No matches found for user {user_id}")
            
        return matches
    except Exception as e:
        print(f"ERROR in get_user_matches: {str(e)}")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/applicants/{job_id}")
async def get_job_applicants(job_id: str):
    # This simulates getting all applicants for a job and selecting the best 3
    # based on the 3x Rule
    
    jobs_df = pd.read_csv(JOBS_CSV)
    job_row = jobs_df[jobs_df['job_id'] == job_id]
    
    if job_row.empty:
        raise HTTPException(status_code=404, detail="Job not found")
    
    job_profile = job_row.iloc[0].to_dict()
    users_df = pd.read_csv(USERS_CSV)
    
    if users_df.empty:
        return []
    
    # Calculate scores for all users for this specific job
    # For simulation, we'll use the find_matches logic in reverse or just score everyone
    # Simplified: we'll match users to this job
    
    # In a real scenario, you'd vectorize everyone or have them indexed.
    # Here we'll just score them on the fly for the demo
    from engine import model, get_user_text, get_job_text, cosine_similarity
    
    job_text = get_job_text(job_profile)
    job_vec = model.encode([job_text])
    
    user_texts = [get_user_text(row) for _, row in users_df.iterrows()]
    user_vecs = model.encode(user_texts)
    
    scores = cosine_similarity(job_vec, user_vecs)[0]
    users_df['score'] = scores
    
    shortlist = get_shortlisted_candidates(job_id, users_df)
    return shortlist

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
