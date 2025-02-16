/**
 * Ollama API Routes
 * These routes handle Ollama model management and interaction.
 * Base path: /api/ollama
 */

import express from 'express';
import { pullModel, listRunning, deleteModel, askOllama } from '../controllers/ollamaController.js';

const router = express.Router();

/**
 * Model Management Routes
 */

// POST /api/ollama/pull/:model
// Downloads and installs a new model from Ollama
// Streams the download progress as NDJSON
// Example: POST /api/ollama/pull/llama2
router.post('/pull/:model', pullModel);

// GET /api/ollama/ps
// Lists all currently running Ollama models
// Returns an array of active model instances
router.get('/ps', listRunning);

// DELETE /api/ollama/delete/:model
// Removes an installed model from Ollama
// Example: DELETE /api/ollama/delete/llama2
router.delete('/delete/:model', deleteModel);

/**
 * Model Interaction Routes
 */

// POST /api/ollama/ask/:model
// Sends a prompt to a specific model and returns its response
// Request body: { "prompt": "Your question here" }
// Example: POST /api/ollama/ask/llama2
router.post('/ask/:model', askOllama);

export default router;
