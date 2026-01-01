const jwt = require("jsonwebtoken");
const User = require("../models/User");
const cacheService = require("../services/cacheService");

// Cache TTL for user data (15 minutes)
const USER_CACHE_TTL = 15 * 60;

const authMiddleware = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({
        message: "No authentication token, access denied",
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    // Try to get user from cache first
    const cacheKey = `user:${userId}`;
    let user = await cacheService.get(cacheKey);

    if (!user) {
      // Cache miss - fetch from database
      const userDoc = await User.findById(userId).select("-password");

      if (!userDoc) {
        return res.status(401).json({
          message: "User not found, token invalid",
        });
      }

      // Cache the user data as plain object
      user = userDoc.toObject ? userDoc.toObject() : userDoc;
      await cacheService.set(cacheKey, user, USER_CACHE_TTL);
    }
    // user is already a plain object from cache or database

    // Attach user to request
    req.user = user;
    req.userId = user._id;
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid token" });
    }
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired" });
    }
    res.status(500).json({ message: "Server error in authentication" });
  }
};

module.exports = authMiddleware;
