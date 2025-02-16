// utils/vectorUtils.js
export const calculateCosineSimilarity = (vecA, vecB) => {
    const dotProduct = vecA.reduce((sum, val, i) => sum + val * vecB[i], 0);
    const magnitudeA = Math.sqrt(vecA.reduce((sum, val) => sum + val ** 2, 0));
    const magnitudeB = Math.sqrt(vecB.reduce((sum, val) => sum + val ** 2, 0));
    return dotProduct / (magnitudeA * magnitudeB);
};

export const normalizeVector = (vector) => {
    const magnitude = Math.sqrt(vector.reduce((sum, val) => sum + val ** 2, 0));
    return vector.map(val => val / magnitude);
};
export const calculateDistance = (vecA, vecB) => {
    return Math.sqrt(vecA.reduce((sum, val, i) => sum + (val - vecB[i]) ** 2, 0));
};