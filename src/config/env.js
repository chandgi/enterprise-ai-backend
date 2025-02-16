import dotenv from "dotenv";

dotenv.config();

const ENV = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: process.env.PORT || 5000,

  // Database Config
  PG_HOST: process.env.PG_HOST || "localhost",
  PG_PORT: process.env.PG_PORT || 5432,
  PG_USER: process.env.PG_USER || "postgres",
  PG_PASSWORD: process.env.PG_PASSWORD || "yourpassword",
  PG_DATABASE: process.env.PG_DATABASE || "enterprise_ai",

  // Redis Config
  REDIS_HOST: process.env.REDIS_HOST || "127.0.0.1",
  REDIS_PORT: process.env.REDIS_PORT || 6379,
  REDIS_PASSWORD: process.env.REDIS_PASSWORD || "",

  // AI Model & Vector Database
  OLLAMA_HOST: process.env.OLLAMA_HOST || "http://localhost:11434",
  PGVECTOR_TABLE: process.env.PGVECTOR_TABLE || "documents",

  // Authentication & Security
  JWT_SECRET: process.env.JWT_SECRET || "your_secret_key",
  SESSION_SECRET: process.env.SESSION_SECRET || "your_session_secret",
  API_KEY: process.env.API_KEY || "your_api_key",

  // Caching & Performance
  CACHE_TTL: process.env.CACHE_TTL || 600, // 10 minutes

  // Logging
  LOG_LEVEL: process.env.LOG_LEVEL || "info",
};

export default ENV;
