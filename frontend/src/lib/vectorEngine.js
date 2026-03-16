import { pipeline, env } from '@xenova/transformers';

let extractor = null;

// Configure Transformers.js environment before anything else
env.allowLocalModels = false;
env.useBrowserCache = true;
// Force the use of the WASM backend and disable multi-threading for initialization stability
if (env.backends && env.backends.onnx) {
    env.backends.onnx.wasm.numThreads = 1;
}

export const initVectorModel = async () => {
    if (extractor) return extractor;
    try {
        // Load the feature extraction pipeline
        extractor = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
        return extractor;
    } catch (err) {
        console.error("Failed to load AI model:", err);
        throw err;
    }
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
