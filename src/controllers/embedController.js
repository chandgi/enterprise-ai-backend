import * as embedService from '../services/embedService.js';

export const storeEmbedding = async (req, res) => {
    const { data } = req.body;
    try {
        const embedding = await embedService.storeEmbedding(data);
        res.status(201).json(embedding);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getEmbedding = async (req, res) => {
    const { id } = req.params;
    try {
        const embedding = await embedService.getEmbedding(id);
        res.status(200).json(embedding);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};