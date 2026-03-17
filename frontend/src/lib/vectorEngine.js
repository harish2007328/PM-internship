import { insforge } from './insforge';

export const getEmbedding = async (text) => {
    if (!text) return null;
    
    // Cache Layer: Prevent redundant expensive AI calls
    const cacheKey = `emb_${btoa(text).substring(0, 32)}`; // Simple hash-like key
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
        try {
            return JSON.parse(cached);
        } catch (e) {
            localStorage.removeItem(cacheKey);
        }
    }

    try {
        const response = await insforge.ai.embeddings.create({
            model: 'openai/text-embedding-3-small',
            input: text
        });
        
        if (response.data && response.data[0]) {
            const embedding = response.data[0].embedding;
            // Store in cache for 24 hours (logic simplified to skip TTL for now, standard localStorage)
            localStorage.setItem(cacheKey, JSON.stringify(embedding));
            return embedding;
        }
        throw new Error("No embedding returned from AI");
    } catch (err) {
        console.error("Cloud AI Embedding failed:", err);
        throw err;
    }
};

export const cosineSimilarity = (vecA, vecB) => {
    if (!vecA || !vecB) return 0;
    
    // Handle string inputs from database (PostgREST returns vector as string)
    const a = typeof vecA === 'string' ? JSON.parse(vecA) : vecA;
    const b = typeof vecB === 'string' ? JSON.parse(vecB) : vecB;

    if (!Array.isArray(a) || !Array.isArray(b)) return 0;

    const dotProduct = a.reduce((acc, val, i) => acc + (val * (b[i] || 0)), 0);
    const normA = Math.sqrt(a.reduce((acc, val) => acc + val * val, 0));
    const normB = Math.sqrt(b.reduce((acc, val) => acc + val * val, 0));
    
    if (normA === 0 || normB === 0) return 0;
    return dotProduct / (normA * normB);
};
