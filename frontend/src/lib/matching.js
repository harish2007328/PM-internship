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

// Advanced Semantic Vector Matching (Cloud + Keyword Hybrid)
export const calculateVectorScore = async (user, job) => {
  try {
    const keywordScore = calculateMatchScore(user.skills || '', job.required_skills || '');

    // Stage 1: High-Speed Database Vector Match
    if (user.embedding && job.embedding) {
      const semanticScore = cosineSimilarity(user.embedding, job.embedding);
      
      // If skills are identical, ensure a perfect 1.0
      if (keywordScore === 1.0) return 1.0;
      
      // Hybrid: 85% Semantic Intelligence + 15% Strict Keyword Overlap
      return (semanticScore * 0.85) + (keywordScore * 0.15);
    }

    // Stage 2: Background Fallback (Only if sync hasn't occurred)
    const userText = `${user.major} student skilled in ${user.skills}`;
    const jobText = `${job.role} at ${job.company} requiring ${job.required_skills}`;

    const userVec = await getEmbedding(userText);
    const jobVec = await getEmbedding(jobText);

    const semanticScore = cosineSimilarity(userVec, jobVec);
    return (semanticScore * 0.85) + (keywordScore * 0.15);
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
