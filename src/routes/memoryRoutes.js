/**
 * Memory Routes
 * Handles vector-based memory search using pgvector
 * Base path: /api/memory
 */

import express from "express";
import { searchMemory } from '../controllers/memoryController.js';

const router = express.Router();

/**
 * Search Routes
 */

// POST /api/memory/search
// Search for similar content using vector embeddings
// Request body: { query_vector: number[] }
// Returns: Array of matching content with distances
router.post('/search', searchMemory);

export default router;
