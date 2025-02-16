import { redisClient } from '../config/redis.js';
import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool();

export const storeEmbedding = async (data) => {
    const query = 'INSERT INTO embeddings(data) VALUES($1) RETURNING *';
    const values = [data];
    const result = await pool.query(query, values);
    const storedEmbedding = result.rows[0];

    // Cache the stored embedding in Redis (using the embedding ID as the key)
    redisClient.setex(`embedding:${storedEmbedding.id}`, 3600, JSON.stringify(storedEmbedding)); // Cache for 1 hour
    return storedEmbedding;
};

export const getEmbedding = async (id) => {
    // Check Redis cache for the embedding
    return new Promise((resolve, reject) => {
        redisClient.get(`embedding:${id}`, async (err, cachedEmbedding) => {
            if (err) {
                return reject(err);
            }

            if (cachedEmbedding) {
                console.log('Returning cached embedding');
                return resolve(JSON.parse(cachedEmbedding)); // Return cached embedding
            }

            try {
                // If not found in cache, retrieve from database
                const query = 'SELECT * FROM embeddings WHERE id = $1';
                const values = [id];
                const result = await pool.query(query, values);
                const embedding = result.rows[0];

                if (embedding) {
                    // Cache the result in Redis
                    redisClient.setex(`embedding:${id}`, 3600, JSON.stringify(embedding)); // Cache for 1 hour
                    resolve(embedding);
                } else {
                    reject(new Error('Embedding not found'));
                }
            } catch (error) {
                reject(new Error('Failed to get embedding'));
            }
        });
    });
};