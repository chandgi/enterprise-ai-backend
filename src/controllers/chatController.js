import { getChatList, generateFromMsgs, generateEmbeddings } from '../services/chatService.js';

/**
 * Fetches a list of available chat models.
 */
export async function listModels(req, res) {
    try {
        const models = await getChatList();
        res.json({ models });
    } catch (error) {
        console.error("Error fetching chat models:", error.message);
        res.status(500).json({ error: "Failed to fetch chat models" });
    }
}

/**
 * Generates a chat response from Ollama.
 */
export async function generate(req, res) {
    try {
        const { model } = req.params;
        const { messages, stream = false, num_ctx } = req.body;

        if (!messages) {
            return res.status(400).json({ error: "Messages are required" });
        }

        console.log(`Generating response for model: ${model}`);

        if (stream) {
            const streamResponse = await generateFromMsgs(model, messages, true, num_ctx);
            res.setHeader('Content-Type', 'application/x-ndjson');
            streamResponse.pipe(res);
        } else {
            const response = await generateFromMsgs(model, messages, false, num_ctx);
            res.json(response);
        }
    } catch (error) {
        console.error("Error generating chat response:", error.message);
        const status = error.message.includes('Timeout') ? 408 : 500;
        res.status(status).json({ error: error.message });
    }
}

/**
 * Generates embeddings for text input.
 */
export async function embed(req, res) {
    try {
        const { model } = req.params;
        const { text } = req.body;

        if (!text || typeof text !== 'string') {
            return res.status(400).json({ error: "Text must be a string" });
        }

        const embedding = await generateEmbeddings(model, text);
        res.json({ embedding });
    } catch (error) {
        console.error("Error generating embeddings:", error.message);
        const status = error.message.includes('Timeout') ? 408 : 500;
        res.status(status).json({ error: error.message });
    }
}
