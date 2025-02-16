/**
 * Memory Service
 * Handles vector-based memory operations using pgvector
 */

import pkg from 'pg';
const { Pool } = pkg;

// Initialize PostgreSQL connection pool
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
});

/**
 * Search for similar content using vector embeddings
 * @param {number[]} query_vector - The query vector to search with
 * @param {number} limit - Maximum number of results to return
 * @param {number} threshold - Maximum cosine distance for matches (0-1)
 * @returns {Promise<Array>} Array of matching content with distances
 */
export const searchEmbeddings = async (query_vector, limit = 5, threshold = 0.3) => {
    try {
        // Validate connection
        const client = await pool.connect();
        
        try {
            const searchQuery = `
                WITH vector_matches AS (
                    SELECT 
                        id,
                        content,
                        metadata,
                        embedding <=> $1 AS distance,
                        created_at
                    FROM ${process.env.PGVECTOR_TABLE || 'ai_embeddings'}
                    WHERE embedding <=> $1 < $2
                    ORDER BY distance
                    LIMIT $3
                )
                SELECT 
                    id,
                    content,
                    metadata,
                    distance,
                    created_at
                FROM vector_matches
                ORDER BY distance ASC;
            `;

            const { rows } = await client.query(searchQuery, [
                JSON.stringify(query_vector),
                threshold,
                limit
            ]);

            if (rows.length === 0) {
                throw new Error('No results found');
            }

            // Format results
            return rows.map(row => ({
                id: row.id,
                content: row.content,
                metadata: row.metadata,
                distance: parseFloat(row.distance.toFixed(4)),
                created_at: row.created_at
            }));

        } finally {
            client.release();
        }
    } catch (error) {
        if (error.message === 'No results found') {
            throw error;
        }
        
        console.error('Error in searchEmbeddings:', error);
        throw new Error('Failed to search embeddings: ' + error.message);
    }
};