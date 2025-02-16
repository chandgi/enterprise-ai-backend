import redisClient from "../config/redis.js";

export const cacheMiddleware = async (req, res, next) => {
  const key = JSON.stringify(req.body); // Use request body as cache key

  try {
    const cachedData = await redisClient.get(key);
    if (cachedData) {
      return res.json(JSON.parse(cachedData)); // Return cached response
    }
    req.cacheKey = key; // Pass key to request
    next();
  } catch (error) {
    console.error("Redis Cache Error:", error);
    next(); // Continue even if cache fails
  }
};

export const cacheResponse = async (req, res, data) => {
  if (!req.cacheKey) return;
  try {
    await redisClient.set(req.cacheKey, JSON.stringify(data), "EX", 600); // Store for 10 mins
  } catch (error) {
    console.error("Failed to store cache:", error);
  }
};
export const clearCache = async (req, res) => {
  try {
    const keys = await redisClient.keys("*"); // Get all keys
    if (keys.length > 0) {
      await redisClient.del(keys); // Delete all keys
      res.status(200).json({ message: "Cache cleared successfully" });
    } else {
      res.status(404).json({ message: "No cache found to clear" });
    }
  } catch (error) {
    console.error("Failed to clear cache:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};