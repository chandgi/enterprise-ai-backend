// controllers/ollamaController.js
import { pullOllamaModel, deleteOllamaModel, listRunningModels, queryOllama } from '../services/ollamaService.js';

/**
 * Pull an Ollama model with streaming progress
 */
export const pullModel = async (req, res) => {
    try {
        const { model } = req.params;
        console.debug(`Pulling Ollama model: ${model}`);

        const stream = await pullOllamaModel(model);
        res.setHeader('Content-Type', 'application/x-ndjson');
        stream.pipe(res);
    } catch (error) {
        console.error('Error in pull model controller:', error);
        res.status(500).json({ error: error.message });
    }
};

/**
 * List running Ollama models
 */
export const listRunning = async (req, res) => {
    try {
        console.debug('Listing Ollama models running');
        const result = await listRunningModels();
        res.json(result);
    } catch (error) {
        console.error('Error in list running models controller:', error);
        if (error.message.includes('Timeout')) {
            res.status(408).json({ error: error.message });
        } else {
            res.status(400).json({ error: error.message });
        }
    }
};

/**
 * Delete an Ollama model
 */
export const deleteModel = async (req, res) => {
    try {
        const { model } = req.params;
        console.debug(`Deleting Ollama model: ${model}`);
        
        const result = await deleteOllamaModel(model);
        res.json(result);
    } catch (error) {
        console.error('Error in delete model controller:', error);
        res.status(400).json({ error: error.message });
    }
};

/**
 * Query Ollama model
 */
export const askOllama = async (req, res) => {
    try {
        const { model } = req.params;
        const { prompt } = req.body;

        if (!prompt) {
            return res.status(400).json({ error: "Prompt is required" });
        }

        console.debug(`Querying model ${model} with prompt: ${prompt}`);
        const response = await queryOllama(model, prompt);
        res.json(response);
    } catch (error) {
        console.error('Ollama query error:', error);
        if (error.message.includes('Timeout')) {
            res.status(408).json({ error: error.message });
        } else {
            res.status(500).json({ error: error.message || 'Internal Server Error' });
        }
    }
};