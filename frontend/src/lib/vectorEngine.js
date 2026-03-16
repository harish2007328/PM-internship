import { insforge } from './insforge';

export const getEmbedding = async (text) => {
    try {
        const response = await insforge.ai.embeddings.create({
            model: 'openai/text-embedding-3-small',
            input: text
        });
        
        if (response.data && response.data[0]) {
            return response.data[0].embedding;
        }
        throw new Error("No embedding returned from AI");
    } catch (err) {
        console.error("Cloud AI Embedding failed:", err);
        throw err;
    }
};

export const cosineSimilarity = (vecA, vecB) => {
    if (!vecA || !vecB) return 0;
    const dotProduct = vecA.reduce((acc, val, i) => acc + (val * (vecB[i] || 0)), 0);
    const normA = Math.sqrt(vecA.reduce((acc, val) => acc + val * val, 0));
    const normB = Math.sqrt(vecB.reduce((acc, val) => acc + val * val, 0));
    if (normA === 0 || normB === 0) return 0;
    return dotProduct / (normA * normB);
};
