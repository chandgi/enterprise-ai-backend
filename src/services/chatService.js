// services/chatService.js
import axios from 'axios';
import { PassThrough } from 'stream';

const OLLAMA_BASE_URL = process.env.OLLAMA_API_URL || 'http://localhost:11434/api';

/**
 * Resolves the appropriate client configuration based on the model and context size
 */
function resolveClientConfig(model, numCtx) {
    const config = {
        baseURL: OLLAMA_BASE_URL,
        timeout: 60000, // 60 seconds timeout
        headers: {
            'Content-Type': 'application/json'
        }
    };
    
    if (numCtx) {
        config.params = { num_ctx: numCtx };
    }
    
    return config;
}

/**
 * Fetches a list of available chat models from Ollama.
 */
export async function getChatList() {
    try {
        const response = await axios.get(`${OLLAMA_BASE_URL}/tags`);
        
        if (!response.data || !Array.isArray(response.data.models)) {
            throw new Error("Invalid response from Ollama");
        }

        return response.data.models;
    } catch (error) {
        console.error("Error fetching chat models:", error.message);
        throw error;
    }
}

/**
 * Generates a chat completion from a list of messages.
 * Supports both streaming and non-streaming responses.
 */
export async function generateFromMsgs(model, messages, stream = false, numCtx = null) {
    const client = resolveClientConfig(model, numCtx);
    
    // Normalize messages input
    const normalizedMessages = typeof messages === 'string' 
        ? [{ role: 'user', content: messages }] 
        : messages;

    try {
        // Prepare the chat history
        let prompt = "";
        for (const msg of normalizedMessages) {
            prompt += `${msg.role === 'assistant' ? 'Assistant' : 'Human'}: ${msg.content}\n`;
        }
        prompt += "Assistant:";

        if (stream) {
            const outputStream = new PassThrough();
            const response = await axios.post(
                `${OLLAMA_BASE_URL}/generate`,
                {
                    model,
                    prompt,
                    stream: true,
                    system: "You are a helpful AI assistant."
                },
                { ...client, responseType: 'stream' }
            );

            response.data.on('data', (chunk) => {
                try {
                    const lines = chunk.toString().split('\n').filter(Boolean);
                    for (const line of lines) {
                        const data = JSON.parse(line);
                        outputStream.write(JSON.stringify({
                            response: data.response,
                            model: model,
                            created_at: new Date().toISOString(),
                            done: data.done
                        }) + '\n');
                    }
                } catch (e) {
                    console.error('Error parsing stream chunk:', e);
                    outputStream.write(JSON.stringify({ 
                        error: `Error parsing stream chunk: ${e.message}` 
                    }) + '\n');
                }
            });

            response.data.on('end', () => {
                outputStream.end();
            });

            return outputStream;
        } else {
            const response = await axios.post(
                `${OLLAMA_BASE_URL}/generate`,
                {
                    model,
                    prompt,
                    stream: true,
                    system: "You are a helpful AI assistant."
                },
                { ...client, responseType: 'stream' }
            );

            return new Promise((resolve, reject) => {
                let fullResponse = '';
                
                response.data.on('data', (chunk) => {
                    try {
                        const lines = chunk.toString().split('\n').filter(Boolean);
                        for (const line of lines) {
                            const data = JSON.parse(line);
                            if (!data.done) {
                                fullResponse += data.response;
                            }
                        }
                    } catch (e) {
                        console.error('Error parsing response chunk:', e);
                        reject(new Error('Failed to parse response'));
                    }
                });

                response.data.on('end', () => {
                    resolve({
                        response: fullResponse,
                        model: model,
                        created_at: new Date().toISOString()
                    });
                });

                response.data.on('error', (error) => {
                    reject(error);
                });
            });
        }
    } catch (error) {
        console.error('Error in generateFromMsgs:', error.message);
        if (error.response) {
            console.error('Response data:', error.response.data);
            console.error('Response status:', error.response.status);
        }
        throw new Error(error.response?.data?.error || 'Failed to generate response');
    }
}

/**
 * Generates embeddings for text input.
 * Supports both single string and array of strings.
 */
export async function generateEmbeddings(model, text) {
    const client = resolveClientConfig(model);
    
    try {
        console.info(`Embedding with client config:`, client);
        
        const response = await axios.post(
            `${OLLAMA_BASE_URL}/embeddings`,
            {
                model,
                prompt: Array.isArray(text) ? text[0] : text // Ollama only supports single text embedding
            },
            client
        );

        if (!response.data || !response.data.embedding) {
            throw new Error('Invalid response from Ollama embeddings API');
        }

        return response.data.embedding;
    } catch (error) {
        console.error('Error in text embeddings:', error);
        if (error.code === 'ECONNABORTED') {
            throw new Error(`Timeout error in embedding generation: ${error.message}`);
        }
        throw error;
    }
}