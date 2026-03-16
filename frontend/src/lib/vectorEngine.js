import { pipeline } from '@xenova/transformers';

let extractor = null;

export const initVectorModel = async () => {
    if (extractor) return extractor;
    // Load the feature extraction pipeline
    // Uses the version of all-MiniLM-L6-v2 compatible with Transformers.js
    extractor = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
    return extractor;
};

export const getEmbedding = async (text) => {
    const model = await initVectorModel();
    const output = await model(text, { pooling: 'mean', normalize: true });
    return Array.from(output.data);
};

export const cosineSimilarity = (vecA, vecB) => {
    const dotProduct = vecA.reduce((acc, val, i) => acc + val * vecB[i], 0);
    const normA = Math.sqrt(vecA.reduce((acc, val) => acc + val * val, 0));
    const normB = Math.sqrt(vecB.reduce((acc, val) => acc + val * val, 0));
    if (normA === 0 || normB === 0) return 0;
    return dotProduct / (normA * normB);
};
