import pandas as pd
import uuid
import random

CITIES = [
    "Mumbai", "Delhi", "Bangalore", "Hyderabad", "Ahmedabad", "Chennai", "Kolkata", 
    "Surat", "Pune", "Jaipur", "Lucknow", "Kanpur", "Nagpur", "Indore", "Thane", "Tenkasi"
]

SECTORS = ["IT", "Finance", "Core Engineering", "Marketing", "UI/UX Design"]

ROLES = {
    "IT": ["SDE Intern", "Backend Developer Intern", "Frontend Developer Intern", "Data Science Intern", "Cloud Engineer Intern"],
    "Finance": ["Equity Research Intern", "Investment Banking Analyst", "Financial Modeling Intern", "Accounting Intern"],
    "Core Engineering": ["Mechanical Engineer Intern", "Civil Engineer Intern", "Electrical Engineer Intern", "Automobile Engineer Intern"],
    "Marketing": ["Digital Marketing Intern", "SEO Specialist Intern", "Content Writing Intern", "Social Media Manager"],
    "UI/UX Design": ["Product Designer Intern", "UX Researcher Intern", "Graphic Design Intern"]
}

SKILLS_POOL = {
    "IT": ["Python", "Java", "React", "Node.js", "SQL", "Machine Learning", "Cloud Computing", "C++", "JavaScript"],
    "Finance": ["Excel", "Financial Modeling", "Tally", "Accounting", "Statistics", "Valuation"],
    "Core Engineering": ["AutoCAD", "SolidWorks", "MATLAB", "Project Management", "Research", "Circuit Design"],
    "Marketing": ["Content Writing", "Social Media", "Digital Marketing", "Communication", "SEO", "Copywriting"],
    "UI/UX Design": ["Figma", "Photoshop", "Illustrator", "User Research", "Prototyping", "Design Thinking"]
}

COMPANIES = [
    "Google", "Microsoft", "Amazon", "Tesla", "Zepto", "HDFC Bank", "L&T", "Flipkart", 
    "Zomato", "Uber", "Adobe", "Meta", "Netflix", "Spotify", "Goldman Sachs", "J.P. Morgan",
    "Mahindra", "Tata Motors", "Infosys", "Wipro", "CRED", "Razorpay", "Swiggy", "Ola"
]

def generate_seed_data(count=30):
    jobs = []
    for _ in range(count):
        sector = random.choice(SECTORS)
        role = random.choice(ROLES[sector])
        company = random.choice(COMPANIES)
        location = random.choice(CITIES)
        stipend = random.randint(10000, 50000)
        
        # Pick 3-5 random skills from the sector pool
        req_skills = random.sample(SKILLS_POOL[sector], k=random.randint(3, 5))
        
        jobs.append({
            "job_id": str(uuid.uuid4()),
            "company": company,
            "role": role,
            "sector": sector,
            "required_skills": ", ".join(req_skills),
            "location": location,
            "stipend": stipend
        })
    
    df = pd.DataFrame(jobs)
    df.to_csv('jobs.csv', index=False)
    print(f"Generated {count} seed jobs in jobs.csv")

if __name__ == "__main__":
    generate_seed_data(30)
