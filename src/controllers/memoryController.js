/**
 * Memory Controller
 * Handles vector-based memory search operations
 */

import { searchEmbeddings } from "../services/memoryService.js";

const VECTOR_DIMENSIONS = 1536; // OpenAI's text-embedding-ada-002 dimensions

/**
 * Search for similar content using vector embeddings
 */
export async function searchMemory(req, res) {
    try {
        const { query_vector, limit = 5, threshold = 0.3 } = req.body;

        // Input validation
        if (!query_vector) {
            return res.status(400).json({ 
                error: "query_vector is required",
                details: "Please provide a vector embedding for the search query"
            });
        }

        if (!Array.isArray(query_vector)) {
            return res.status(400).json({ 
                error: "Invalid query_vector format",
                details: "query_vector must be a JSON array of numbers"
            });
        }

        if (query_vector.length !== VECTOR_DIMENSIONS) {
            return res.status(400).json({ 
                error: "Invalid vector dimensions",
                details: `Query vector must have exactly ${VECTOR_DIMENSIONS} dimensions, got ${query_vector.length}`
            });
        }

        if (query_vector.some(num => typeof num !== 'number')) {
            return res.status(400).json({ 
                error: "Invalid vector values",
                details: "All elements in query_vector must be numbers"
            });
        }

        // Validate limit and threshold
        if (limit && (typeof limit !== 'number' || limit < 1)) {
            return res.status(400).json({ 
                error: "Invalid limit",
                details: "limit must be a positive number"
            });
        }

        if (threshold && (typeof threshold !== 'number' || threshold < 0 || threshold > 1)) {
            return res.status(400).json({ 
                error: "Invalid threshold",
                details: "threshold must be a number between 0 and 1"
            });
        }

        const results = await searchEmbeddings(query_vector, limit, threshold);
        
        res.json({
            results,
            metadata: {
                count: results.length,
                dimensions: VECTOR_DIMENSIONS,
                threshold
            }
        });
    } catch (error) {
        console.error("Error in searchMemory:", error);
        
        if (error.message === 'No results found') {
            return res.status(404).json({ 
                error: "No matches found",
                details: "No content matched your search criteria"
            });
        }

        res.status(500).json({ 
            error: "Internal Server Error",
            details: error.message
        });
    }
}