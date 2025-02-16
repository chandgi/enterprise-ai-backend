import express from 'express';
import { getEmbedding, storeEmbedding } from '../controllers/embedController.js';

const router = express.Router();

router.get('/embedding/:id', getEmbedding); // Get embedding by ID
router.post('/embedding', storeEmbedding); // Store embedding

export default router;