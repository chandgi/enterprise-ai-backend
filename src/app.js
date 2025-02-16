import express from "express";
import cors from "cors";
import morgan from "morgan";
import { EventEmitter } from 'events';
import swaggerUi from 'swagger-ui-express';
import { readFileSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import session from 'express-session';
import { createClient } from 'redis';
import { RedisStore } from 'connect-redis';
import passport from './config/passport.js';
import { rateLimit } from 'express-rate-limit';
import { errorHandler } from './middleware/errorHandler.js';
import { connectDB } from './config/db.js';
import dotenv from "dotenv";
dotenv.config();

// Dynamic import for helmet (if needed)
const helmet = (await import('helmet')).default;

// Get directory name in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = join(__filename, '..');

// Load swagger document
const swaggerDocument = JSON.parse(readFileSync(join(__dirname, 'swagger.json'), 'utf8'));

const app = express();
const eventEmitter = new EventEmitter();

// Middleware
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
  }));
app.use(morgan('dev'));
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Redis client and session store
const redisClient = createClient({
    url: process.env.REDIS_URL
});

redisClient.on('error', (err) => console.error('Redis Error:', err));

// IMPORTANT: Connect to Redis before using it!
await redisClient.connect();

// Use the RedisStore with express-session
app.use(session({
    store: new RedisStore({ client: redisClient }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // Set to true if using HTTPS
}));

// Passport initialization
app.use(passport.initialize());
app.use(passport.session());

// Swagger UI setup
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Routes
import chatRoutes from './routes/chatRoutes.js';
import embedRoutes from './routes/embedRoutes.js';
import ollamaRoutes from './routes/ollamaRoutes.js';
import memoryRoutes from './routes/memoryRoutes.js';
import authRoutes from "./routes/authRoutes.js";

app.use("/api/auth", authRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/embed', embedRoutes);
app.use('/api/ollama', ollamaRoutes);
app.use("/api/memory", memoryRoutes);

// Error handling middleware
app.use(errorHandler);

export { app, eventEmitter, connectDB, redisClient };
