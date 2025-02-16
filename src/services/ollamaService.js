/**
 * Ollama Service
 * Handles communication with the Ollama API for model management and interaction.
 */

import axios from 'axios';
import { PassThrough } from 'stream';

const OLLAMA_API_URL = 'http://localhost:11434/api';
const TIMEOUT = 300000; // 5 minutes timeout

/**
 * Pull an Ollama model with streaming progress
 * @param {string} modelName - Name of the model to pull (e.g., 'llama2')
 * @returns {PassThrough} Stream of progress updates in NDJSON format
 */
export async function pullOllamaModel(modelName) {
    const stream = new PassThrough();
    
    (async () => {
        try {
            const response = await axios.post(
                `${OLLAMA_API_URL}/pull`,
                { name: modelName },
                { 
                    responseType: 'stream',
                    timeout: TIMEOUT
                }
            );

            response.data.on('data', (chunk) => {
                try {
                    stream.write(chunk.toString() + '\n');
                } catch (e) {
                    console.error('Error parsing stream chunk:', e);
                    stream.write(JSON.stringify({ error: `Error parsing stream chunk: ${e.message}` }) + '\n');
                }
            });

            response.data.on('end', async () => {
                try {
                    // Update model lists after streaming is done
                    const models = await listOllamaModels();
                    stream.write(JSON.stringify({ status: 'complete', models }) + '\n');
                    stream.end();
                } catch (e) {
                    console.error('Error updating model lists:', e);
                    stream.write(JSON.stringify({ error: `Error updating model lists: ${e.message}` }) + '\n');
                    stream.end();
                }
            });

        } catch (error) {
            console.error('Error in Ollama model pull:', error);
            if (error.code === 'ECONNABORTED') {
                stream.write(JSON.stringify({ error: `Timeout error in Ollama model pull: ${error.message}` }) + '\n');
            } else {
                stream.write(JSON.stringify({ error: `Error in Ollama model pull: ${error.message}` }) + '\n');
            }
            stream.end();
        }
    })();

    return stream;
}

/**
 * List running Ollama models
 * @returns {Promise<Object>} List of currently running model instances
 */
export async function listRunningModels() {
    try {
        const response = await axios.get(`${OLLAMA_API_URL}/ps`, {
            timeout: TIMEOUT
        });
        return response.data;
    } catch (error) {
        console.error('Error in Ollama ps:', error);
        if (error.code === 'ECONNABORTED') {
            throw new Error(`Timeout error in Ollama ps: ${error.message}`);
        }
        throw error;
    }
}

/**
 * Delete an Ollama model
 * @param {string} modelName - Name of the model to delete
 * @returns {Promise<Object>} Status of the deletion
 */
export async function deleteOllamaModel(modelName) {
    try {
        await axios.delete(`${OLLAMA_API_URL}/delete`, {
            data: { name: modelName },
            timeout: TIMEOUT
        });
        return { status: 'success' };
    } catch (error) {
        console.error('Error in deleting Ollama model:', error);
        throw error;
    }
}

/**
 * List all available Ollama models
 * @returns {Promise<Object>} List of available models and their details
 */
export async function listOllamaModels() {
    try {
        const response = await axios.get(`${OLLAMA_API_URL}/tags`, {
            timeout: TIMEOUT
        });
        return response.data;
    } catch (error) {
        console.error('Error listing Ollama models:', error);
        throw error;
    }
}

/**
 * Query an Ollama model
 * @param {string} model - Name of the model to query
 * @param {string} prompt - The prompt to send to the model
 * @returns {Promise<Object>} Model's response
 */
export async function queryOllama(model, prompt) {
    try {
        const response = await axios.post(
            `${OLLAMA_API_URL}/generate`,
            {
                model,
                prompt,
                stream: false
            },
            {
                timeout: TIMEOUT
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error in Ollama query:', error);
        if (error.code === 'ECONNABORTED') {
            throw new Error(`Timeout error in Ollama query: ${error.message}`);
        }
        throw error;
    }
}