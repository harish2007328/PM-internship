import { getEmbedding, cosineSimilarity } from './vectorEngine';

// Basic TF-IDF style matching logic for frontend (Keep for fast initial render)
export const calculateMatchScore = (userSkills, jobSkills) => {
  if (!userSkills || !jobSkills) return 0;
  
  const uSkills = userSkills.toLowerCase().replace(/;/g, ',').split(',').map(s => s.trim()).filter(s => s);
  const jSkills = jobSkills.toLowerCase().replace(/;/g, ',').split(',').map(s => s.trim()).filter(s => s);
  
  if (jSkills.length === 0) return 0.5; 
  
  const intersect = jSkills.filter(s => uSkills.includes(s));
  const baseScore = intersect.length / jSkills.length;
  
  if (intersect.length === jSkills.length) return 1.0;
  return Math.min(1.0, baseScore + (intersect.length > 0 ? 0.1 : 0));
};

// Advanced Semantic Vector Matching (Xenova / Transformers.js)
export const calculateVectorScore = async (user, job) => {
  try {
    // Exact text pattern from your previous logic
    const userText = `${user.major} student skilled in ${user.skills}`;
    // Job text representation
    const jobText = `${job.role} at ${job.company} requiring ${job.required_skills}`;

    const userVec = await getEmbedding(userText);
    const jobVec = await getEmbedding(jobText);

    const semanticScore = cosineSimilarity(userVec, jobVec);
    
    // Combine with keyword overlap for robustness
    const keywordScore = calculateMatchScore(user.skills, job.required_skills);
    
    // 70% Semantic (Vector) + 30% Key Match
    return (semanticScore * 0.7) + (keywordScore * 0.3);
  } catch (err) {
    console.warn("Vector scoring failed, falling back to keywords:", err);
    return calculateMatchScore(user.skills, job.required_skills);
  }
};

export const getFinancialRisk = (userLoc, jobLoc, stipend) => {
  const tier1 = ["mumbai", "delhi", "bangalore", "hyderabad", "chennai", "pune"];
  const tier3 = ["tenkasi", "kanpur", "jaipur", "lucknow", "nagpur", "indore", "surat", "thane", "ahmedabad"];
  
  const uLoc = (userLoc || '').toLowerCase();
  const jLoc = (jobLoc || '').toLowerCase();
  
  if (uLoc === jLoc) return { risk: "LOW", message: "Same City (Zero Risk)" };
  
  const uTier = tier3.includes(uLoc) ? 3 : (tier1.includes(uLoc) ? 1 : 2);
  const jTier = tier1.includes(jLoc) ? 1 : (tier3.includes(jLoc) ? 3 : 2);
  
  if (uTier === 3 && jTier === 1) return { risk: "CRITICAL", message: "CRITICAL: Tier 3 to Tier 1 migration risk" };
  if (stipend < 15000) return { risk: "HIGH", message: "HIGH: Relocation cost exceeds stipend" };
  
  return { risk: "MODERATE", message: "MODERATE: Relocation required" };
};
