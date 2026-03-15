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
import requests

INS_BASE_URL = "https://74jktci8.us-east.insforge.app"
INS_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3OC0xMjM0LTU2NzgtOTBhYi1jZGVmMTIzNDU2NzgiLCJlbWFpbCI6ImFub25AaW5zZm9yZ2UuY29tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM2MDIwOTV9.AE1Ikve7elC-CX8Y8uQ8bp-ir1494q9FKcRB3L2IFmA"
INS_SERVICE_KEY = "ik_bb646cff87008cd5e8726ab3a6d1e3cb"

def sync_from_cloud():
    """Download data from InsForge to local CSVs for matching performance"""
    print("[CLOUD] Syncing from InsForge Cloud...")
    headers = {
        "apikey": INS_SERVICE_KEY,
        "Authorization": f"Bearer {INS_ANON_KEY}",
        "Content-Type": "application/json"
    }
    
    tables = {
        "pm_users": USERS_CSV,
        "pm_jobs": JOBS_CSV,
        "pm_applications": APPLICATIONS_CSV,
        "pm_selections": SELECTIONS_CSV
    }
    
    for table, csv_file in tables.items():
        try:
            url = f"{INS_BASE_URL}/rest/v1/{table}"
            response = requests.get(url, headers=headers)
            if response.ok:
                data = response.json()
                df = pd.DataFrame(data)
                df.to_csv(csv_file, index=False)
                print(f"[OK] Synced {table} -> {csv_file}")
            else:
                print(f"[ERROR] Failed to sync {table}: {response.text}")
        except Exception as e:
            print(f"[WARN] Error syncing {table}: {e}")

def cloud_save(table, record):
    """Save a single record to InsForge Cloud"""
    headers = {
        "apikey": INS_SERVICE_KEY,
        "Authorization": f"Bearer {INS_ANON_KEY}",
        "Content-Type": "application/json",
        "Prefer": "return=minimal"
    }
    url = f"{INS_BASE_URL}/rest/v1/{table}"
    try:
        # InsForge expects array for inserts
        requests.post(url, headers=headers, json=[record])
    except Exception as e:
        print("!!! Cloud save error:", e)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173", "http://127.0.0.1:5173",
        "http://localhost:5174", "http://127.0.0.1:5174",
        "http://localhost:5175", "http://127.0.0.1:5175",
        "http://localhost:5178", "http://127.0.0.1:5178",
        "http://localhost:5179", "http://127.0.0.1:5179",
        "http://localhost:3000", "http://127.0.0.1:3000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


USERS_CSV = 'users.csv'
JOBS_CSV = 'jobs.csv'
APPLICATIONS_CSV = 'applications.csv'
SELECTIONS_CSV = 'selections.csv'

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

class ApplicationRequest(BaseModel):
    user_id: str
    job_id: str

@app.on_event("startup")
async def startup_event():
    try:
        # Initial sync from cloud
        sync_from_cloud()
        
        # Ensure folders/files exist (fallback/init)
        if not os.path.exists(USERS_CSV):
            pd.DataFrame(columns=['user_id', 'name', 'email', 'caste', 'location', 'family_income', 'major', 'skills']).to_csv(USERS_CSV, index=False)
        if not os.path.exists(JOBS_CSV):
            pd.DataFrame(columns=['job_id', 'company', 'role', 'sector', 'required_skills', 'location', 'stipend']).to_csv(JOBS_CSV, index=False)
    except Exception as e:
        print("[!] STARTUP ERROR:")
        traceback.print_exc()
        raise e
    
    if not os.path.exists(APPLICATIONS_CSV):
        pd.DataFrame(columns=['user_id', 'job_id', 'timestamp']).to_csv(APPLICATIONS_CSV, index=False)
    if not os.path.exists(SELECTIONS_CSV):
        pd.DataFrame(columns=['user_id', 'job_id', 'timestamp']).to_csv(SELECTIONS_CSV, index=False)

@app.post("/register")
async def register_user(profile: UserProfile):
    print(f"--- Received Registration Request ---")
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
        df = pd.read_csv(USERS_CSV) if os.path.exists(USERS_CSV) else pd.DataFrame()
        df = pd.concat([df, pd.DataFrame([new_user])], ignore_index=True)
        df.to_csv(USERS_CSV, index=False)
        
        # Sync to Cloud
        cloud_save("pm_users", new_user)
        
        return {"status": "success", "user_id": user_id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/apply")
async def apply_to_job(app_req: ApplicationRequest):
    print(f"User {app_req.user_id} applying to Job {app_req.job_id}")
    try:
        df = pd.read_csv(APPLICATIONS_CSV)
        # Check if already applied
        if not df[(df['user_id'] == app_req.user_id) & (df['job_id'] == app_req.job_id)].empty:
            return {"status": "already_applied"}
            
        new_app = {
            "user_id": app_req.user_id,
            "job_id": app_req.job_id,
            "timestamp": pd.Timestamp.now().isoformat()
        }
        df = pd.concat([df, pd.DataFrame([new_app])], ignore_index=True)
        df.to_csv(APPLICATIONS_CSV, index=False)
        
        # Sync to Cloud
        cloud_save("pm_applications", new_app)
        
        return {"status": "success"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/select")
async def select_candidate(app_req: ApplicationRequest):
    print(f"Company selecting User {app_req.user_id} for Job {app_req.job_id}")
    try:
        df = pd.read_csv(SELECTIONS_CSV)
        # Check if already selected
        if not df[(df['user_id'] == app_req.user_id) & (df['job_id'] == app_req.job_id)].empty:
            return {"status": "already_selected"}
            
        new_selection = {
            "user_id": app_req.user_id,
            "job_id": app_req.job_id,
            "timestamp": pd.Timestamp.now().isoformat()
        }
        df = pd.concat([df, pd.DataFrame([new_selection])], ignore_index=True)
        df.to_csv(SELECTIONS_CSV, index=False)
        
        # Sync to Cloud
        cloud_save("pm_selections", new_selection)
        
        return {"status": "success"}
    except Exception as e:
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
    
    # Sync to Cloud
    cloud_save("pm_jobs", new_job)
    
    index_jobs()
    return {"status": "success", "job_id": job_id}

@app.get("/internships")
async def get_all_internships():
    try:
        df = pd.read_csv(JOBS_CSV)
        return df.to_dict('records')
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/users")
async def get_all_users():
    try:
        df = pd.read_csv(USERS_CSV)
        return df.to_dict('records')
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/user/{user_id}")
async def get_user(user_id: str):
    try:
        users_df = pd.read_csv(USERS_CSV)
        user_row = users_df[users_df['user_id'] == user_id]
        if user_row.empty:
            raise HTTPException(status_code=404, detail="User not found")
        return user_row.iloc[0].to_dict()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/matches/{user_id}")
async def get_user_matches(user_id: str):
    try:
        users_df = pd.read_csv(USERS_CSV)
        user_row = users_df[users_df['user_id'] == user_id]
        if user_row.empty:
            return []
        
        user_profile = user_row.iloc[0].to_dict()
        matches = find_matches(user_profile)
        
        # Check application and selection status
        apps_df = pd.read_csv(APPLICATIONS_CSV)
        sels_df = pd.read_csv(SELECTIONS_CSV)
        
        user_apps = apps_df[apps_df['user_id'] == user_id]['job_id'].tolist()
        user_sels = sels_df[sels_df['user_id'] == user_id]['job_id'].tolist()
        
        for match in matches:
            match['has_applied'] = match['job_id'] in user_apps
            match['is_selected'] = match['job_id'] in user_sels
            
        return matches
    except Exception as e:
        print(f"ERROR in /matches/{user_id}: {str(e)}")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/applicants/{job_id}")
async def get_job_applicants(job_id: str):
    # Retrieve only users who actually applied
    try:
        apps_df = pd.read_csv(APPLICATIONS_CSV)
        sels_df = pd.read_csv(SELECTIONS_CSV)
        applicant_ids = apps_df[apps_df['job_id'] == job_id]['user_id'].tolist()
        selected_ids = sels_df[sels_df['job_id'] == job_id]['user_id'].tolist()
        
        if not applicant_ids:
            return []
            
        users_df = pd.read_csv(USERS_CSV)
        applicants = users_df[users_df['user_id'].isin(applicant_ids)].copy()
        
        jobs_df = pd.read_csv(JOBS_CSV)
        job_row = jobs_df[jobs_df['job_id'] == job_id]
        if job_row.empty:
            raise HTTPException(status_code=404, detail="Job not found")
            
        job_profile = job_row.iloc[0].to_dict()
        
        # Calculate scores
        from engine import match_bulk_users
        applicants['score'] = match_bulk_users(applicants, job_profile)
        
        applicants_list = []
        for _, row in applicants.iterrows():
            app_dict = row.to_dict()
            app_dict['is_selected'] = app_dict['user_id'] in selected_ids
            # Convert skills string to list
            if isinstance(app_dict.get('skills'), str):
                app_dict['skills'] = [s.strip() for s in app_dict['skills'].split(',')]
            applicants_list.append(app_dict)
                
        # Sort by score for display
        applicants_list.sort(key=lambda x: x['score'], reverse=True)
        return applicants_list
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
