import express from "express";
import { listModels, generate, embed } from "../controllers/chatController.js";

const router = express.Router();

// Route to fetch available chat models
router.get("/list", listModels);

// Route to generate AI response
// Note: :model param will be automatically decoded by Express
router.post("/:model/generate", (req, res, next) => {
    // Decode the model parameter
    req.params.model = decodeURIComponent(req.params.model);
    next();
}, generate);

// Route to generate embeddings
router.post("/:model/embed", (req, res, next) => {
    // Decode the model parameter
    req.params.model = decodeURIComponent(req.params.model);
    next();
}, embed);

export default router;
