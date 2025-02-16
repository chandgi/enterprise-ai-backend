import jwt from "jsonwebtoken";
import ENV from "../config/env.js";

export const authenticateUser = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Access Denied. No Token Provided." });
  }

  try {
    const decoded = jwt.verify(token, ENV.JWT_SECRET);
    req.user = decoded; // Attach user payload to request
    next();
  } catch (error) {
    return res.status(403).json({ error: "Invalid or Expired Token" });
  }
};
export const authorizeAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Access Denied. Admins Only." });
  }
  next();
};