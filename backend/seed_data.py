import pandas as pd
import uuid

USERS_CSV = 'users.csv'
JOBS_CSV = 'jobs.csv'

# Demo Students
students = [
    {"name": "Aravind Kumar", "email": "aravind@demo.in", "caste": "General", "location": "Bangalore", "family_income": "5L - 8L", "major": "Computer Science", "skills": "React, Node.js, Python, SQL, AWS"},
    {"name": "Sara Sharma", "email": "sara@demo.in", "caste": "OBC", "location": "Delhi", "family_income": "2L - 5L", "major": "AI & Data Science", "skills": "Python, Machine Learning, Data Synthesis, PyTorch, SQL"},
    {"name": "Ishaan Mehta", "email": "ishaan@demo.in", "caste": "SC", "location": "Mumbai", "family_income": "< 2L", "major": "ECE", "skills": "Mechanical Design, AutoCAD, PLC, Python, Communication"},
    {"name": "Riya Iyer", "email": "riya@demo.in", "caste": "General", "location": "Tenkasi", "family_income": "> 8L", "major": "Business Management", "skills": "Figma, UI/UX, Design Thinking, Photoshop, Communication"}
]

# Demo Jobs
jobs = [
    {"company": "TechNova AI", "role": "AI Specialist", "sector": "IT", "required_skills": "Python, Machine Learning, PyTorch, Data Synthesis", "location": "Bangalore", "stipend": 25000},
    {"company": "BuildSmart Infra", "role": "Mechanical Intern", "sector": "Core", "required_skills": "AutoCAD, SolidWorks, Mechanical Design, Project Management", "location": "Mumbai", "stipend": 18000},
    {"company": "FinEdge Systems", "role": "Backend Dev", "sector": "Finance", "required_skills": "Java, Spring Boot, SQL, AWS, Backend Architecture", "location": "Hyderabad", "stipend": 30000},
    {"company": "DesignX Studio", "role": "UI/UX Intern", "sector": "IT", "required_skills": "Figma, UI Design, Design Thinking, React, Prototyping", "location": "Chennai", "stipend": 15000},
    {"company": "Global Connect", "role": "PM Intern", "sector": "IT", "required_skills": "Communication, Leadership, Market Research, Excel, Project Management", "location": "Delhi", "stipend": 20000}
]

def seed():
    # Load or Create Users
    try:
        users_df = pd.read_csv(USERS_CSV)
    except:
        users_df = pd.DataFrame(columns=["user_id", "name", "email", "caste", "location", "family_income", "major", "skills"])

    for s in students:
        if s['name'] not in users_df['name'].values:
            s['user_id'] = str(uuid.uuid4())
            users_df = pd.concat([users_df, pd.DataFrame([s])], ignore_index=True)
    
    users_df.to_csv(USERS_CSV, index=False)
    print("Seeded Students.")

    # Load or Create Jobs
    try:
        jobs_df = pd.read_csv(JOBS_CSV)
    except:
        jobs_df = pd.DataFrame(columns=["job_id", "company", "role", "sector", "required_skills", "location", "stipend"])

    for j in jobs:
        if j['company'] not in jobs_df['company'].values:
            j['job_id'] = str(uuid.uuid4())
            jobs_df = pd.concat([jobs_df, pd.DataFrame([j])], ignore_index=True)
    
    jobs_df.to_csv(JOBS_CSV, index=False)
    print("Seeded Jobs.")

if __name__ == "__main__":
    seed()
