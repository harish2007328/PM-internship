import os
import pandas as pd
import numpy as np
import pickle
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.feature_extraction.text import TfidfVectorizer

# Initialize model with fallback
# Advanced Tfidf settings to handle C++, Machine Learning, etc.
advanced_tfidf = TfidfVectorizer(
    token_pattern=r"[a-zA-Z0-9+#]{1,}", 
    ngram_range=(1, 3), 
    sublinear_tf=True,
    stop_words='english'
)

# Force TF-IDF for stability in environment
USE_TRANSFORMERS = False
model = advanced_tfidf

# Global vectorizer cache for TF-IDF fallback
_vectorizer_cache = None

def get_model():
    global _vectorizer_cache
    if not USE_TRANSFORMERS:
        if _vectorizer_cache is None:
            if os.path.exists('vectorizer.pkl'):
                with open('vectorizer.pkl', 'rb') as f:
                    _vectorizer_cache = pickle.load(f)
            else:
                _vectorizer_cache = model
        return _vectorizer_cache
    return model

USERS_CSV = 'users.csv'
JOBS_CSV = 'jobs.csv'
VECTORS_FILE = 'job_vectors.npy'
METADATA_FILE = 'jobs_data.pkl'

def get_user_text(user_row):
    """Focus vectorization exclusively on user skills"""
    return str(user_row.get('skills', '')).lower()

def get_job_text(job_row):
    """Focus vectorization exclusively on job required skills"""
    return str(job_row.get('required_skills', '')).lower()

def index_jobs():
    """Phase 2: Pre-compute job vectors"""
    if not os.path.exists(JOBS_CSV):
        print(f"Error: {JOBS_CSV} not found")
        return
    
    df = pd.read_csv(JOBS_CSV)
    texts = [get_job_text(row) for _, row in df.iterrows()]
    
    if USE_TRANSFORMERS:
        vectors = model.encode(texts)
    else:
        # Fit and transform with Tfidf
        vectors = model.fit_transform(texts).toarray()
        # Save the vectorizer to use during matching
        with open('vectorizer.pkl', 'wb') as f:
            pickle.dump(model, f)
    
    # Save as .npy for fast loading in engine
    np.save(VECTORS_FILE, vectors)
    with open(METADATA_FILE, 'wb') as f:
        pickle.dump(df, f)
    
    # Export as combined .pkl for user testing as requested
    with open('job_vectors_export.pkl', 'wb') as f:
        pickle.dump({"vectors": vectors, "metadata": df}, f)
    
    print(f"Indexed {len(df)} jobs and exported job_vectors_export.pkl.")

def calculate_match_score(user_profile, job_profile):
    """Unified scoring logic for both Student Feed and Company Console"""
    user_text = get_user_text(user_profile)
    job_text = get_job_text(job_profile)
    
    current_model = get_model()
    
    # Base Semantic Score
    if USE_TRANSFORMERS:
        u_vec = current_model.encode([user_text])
        j_vec = current_model.encode([job_text])
        base_score = float(cosine_similarity(u_vec, j_vec)[0][0])
    else:
        # Fallback for local testing without transformers
        u_vec = current_model.transform([user_text]).toarray()
        j_vec = current_model.transform([job_text]).toarray()
        base_score = float(cosine_similarity(u_vec, j_vec)[0][0])
    
    # Boosting Logic
    user_skills = set(s.strip().lower() for s in str(user_profile.get('skills', '')).replace(';', ',').split(',') if s.strip())
    job_skills = set(s.strip().lower() for s in str(job_profile.get('required_skills', '')).replace(';', ',').split(',') if s.strip())
    
    final_score = base_score
    if job_skills and job_skills.issubset(user_skills):
        final_score = max(final_score, 1.0)
    elif len(job_skills.intersection(user_skills)) > 0:
        overlap_ratio = len(job_skills.intersection(user_skills)) / len(job_skills)
        final_score = min(1.0, final_score + (overlap_ratio * 0.1))
        
    return final_score

def find_matches(user_profile, top_k=None):
    """Phase 3: Vectorized Matchmaker Engine (High Performance)"""
    if not os.path.exists(JOBS_CSV) or not os.path.exists(VECTORS_FILE):
        return []

    # Load Meta and Vectors
    with open(METADATA_FILE, 'rb') as f:
        jobs_df = pickle.load(f)
    job_vectors = np.load(VECTORS_FILE)
    
    # Encode user ONCE
    user_text = get_user_text(user_profile)
    current_model = get_model()
    
    if USE_TRANSFORMERS:
        user_vector = current_model.encode([user_text])
    else:
        user_vector = current_model.transform([user_text]).toarray()
    
    # Compute all base scores at once
    base_scores = cosine_similarity(user_vector, job_vectors)[0]
    
    user_loc = str(user_profile.get('location', '')).lower()
    user_skills = set(s.strip().lower() for s in str(user_profile.get('skills', '')).replace(';', ',').split(',') if s.strip())
    
    results = []
    
    for i, (_, job_row) in enumerate(jobs_df.iterrows()):
        job = job_row.to_dict()
        base_score = float(base_scores[i])
        
        # Apply Boosting Logic
        job_skills = set(s.strip().lower() for s in str(job.get('required_skills', '')).replace(';', ',').split(',') if s.strip())
        score = base_score
        if job_skills and job_skills.issubset(user_skills):
            score = max(score, 1.0)
        elif job_skills and len(job_skills.intersection(user_skills)) > 0:
            overlap_ratio = len(job_skills.intersection(user_skills)) / len(job_skills)
            score = min(1.0, score + (overlap_ratio * 0.1))
            
        # Risk Logic
        job_loc = str(job.get('location', '')).lower()
        financial_risk = "LOW"
        risk_message = "Same City (Zero Risk)"
        
        tier1 = ["mumbai", "delhi", "bangalore", "hyderabad", "chennai", "pune"]
        tier3 = ["tenkasi", "kanpur", "jaipur", "lucknow", "nagpur", "indore", "surat", "thane", "ahmedabad"]
        
        user_tier = "Tier 3" if user_loc in tier3 else ("Tier 1" if user_loc in tier1 else "Tier 2")
        job_tier = "Tier 1" if job_loc in tier1 else ("Tier 3" if job_loc in tier3 else "Tier 2")

        if user_loc != job_loc:
            stipend = int(job.get('stipend', 0))
            if user_tier == "Tier 3" and job_tier == "Tier 1":
                financial_risk = "CRITICAL"
                risk_message = "CRITICAL: Tier 3 to Tier 1 migration risk"
            elif stipend < 15000:
                financial_risk = "HIGH"
                risk_message = "HIGH: Relocation cost exceeds stipend"
            else:
                financial_risk = "MODERATE"
                risk_message = "MODERATE: Relocation required"
        
        results.append({
            **job,
            "score": score,
            "financial_risk": financial_risk,
            "risk_message": risk_message,
            "tier": job_tier
        })

    results.sort(key=lambda x: x['score'], reverse=True)
    return results[:top_k] if top_k is not None else results


def get_shortlisted_candidates(job_id, candidates_df):
    """Phase 4: 3x Rule Shortlisting with Tagging"""
    # Initialize all as not shortlisted
    candidates_df['shortlist_type'] = None
    
    # Sort for scoring accuracy
    sorted_df = candidates_df.sort_values(by='score', ascending=False)
    
    # 1. Tag Top 2 by Merit
    top_merit_indices = sorted_df.head(2).index
    candidates_df.loc[top_merit_indices, 'shortlist_type'] = 'Merit'
    
    # 2. Tag Top 1 from Reserved Category (OBC/SC/ST/EWS)
    reserved_categories = ['OBC', 'SC', 'ST', 'EWS']
    # Filter candidates who are reserved AND not already tagged as Merit
    reserved_pool = sorted_df[
        (sorted_df['caste'].isin(reserved_categories)) & 
        (~sorted_df.index.isin(top_merit_indices))
    ]
    
    if not reserved_pool.empty:
        top_reserved_idx = reserved_pool.head(1).index
        candidates_df.loc[top_reserved_idx, 'shortlist_type'] = 'Reserved'
        
    # Return only candidates who were actually shortlisted (Top 2 Merit + 1 Reserved)
    shortlisted_df = candidates_df[candidates_df['shortlist_type'].notna()]
    return shortlisted_df.sort_values(by='score', ascending=False).to_dict('records')

def match_bulk_users(user_df, job_profile):
    """Efficiently score multiple users against one job (Vectorized)"""
    if user_df.empty:
        return []
    
    current_model = get_model()
    job_text = get_job_text(job_profile)
    
    # job vector
    if USE_TRANSFORMERS:
        job_vector = current_model.encode([job_text])
    else:
        job_vector = current_model.transform([job_text]).toarray()
    
    # user vectors
    user_texts = [get_user_text(row) for _, row in user_df.iterrows()]
    if USE_TRANSFORMERS:
        user_vectors = current_model.encode(user_texts)
    else:
        user_vectors = current_model.transform(user_texts).toarray()
    
    # Base semantic scores
    base_scores = cosine_similarity(user_vectors, job_vector).flatten()
    
    job_skills = set(s.strip().lower() for s in str(job_profile.get('required_skills', '')).replace(';', ',').split(',') if s.strip())
    
    final_scores = []
    for i, (_, user_row) in enumerate(user_df.iterrows()):
        base_score = float(base_scores[i])
        user_skills = set(s.strip().lower() for s in str(user_row.get('skills', '')).replace(';', ',').split(',') if s.strip())
        
        score = base_score
        if job_skills and job_skills.issubset(user_skills):
            score = max(score, 1.0)
        elif job_skills and len(job_skills.intersection(user_skills)) > 0:
            overlap_ratio = len(job_skills.intersection(user_skills)) / len(job_skills)
            score = min(1.0, score + (overlap_ratio * 0.1))
        final_scores.append(score)
        
    return final_scores
