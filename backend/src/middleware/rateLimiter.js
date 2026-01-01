const rateLimit = require("express-rate-limit");
const redisClient = require("../config/redis");

/**
 * Redis store adapter for express-rate-limit v8
 * Implements the store interface required by express-rate-limit
 */
class RedisStore {
  constructor(redisClient, prefix = "rl:") {
    this.client = redisClient;
    this.prefix = prefix;
  }

  async increment(key) {
    const redisKey = this.prefix + key;
    try {
      const count = await this.client.incr(redisKey);
      if (count === 1) {
        // Set expiry on first increment (1 minute window)
        await this.client.expire(redisKey, 60);
      }
      return { totalHits: count };
    } catch (error) {
      console.error("Redis rate limit increment error:", error);
      // On error, allow the request (fail open)
      return { totalHits: 1 };
    }
  }

  async decrement(key) {
    const redisKey = this.prefix + key;
    try {
      await this.client.decr(redisKey);
    } catch (error) {
      console.error("Redis rate limit decrement error:", error);
    }
  }

  async resetKey(key) {
    const redisKey = this.prefix + key;
    try {
      await this.client.del(redisKey);
    } catch (error) {
      console.error("Redis rate limit reset error:", error);
    }
  }

  async shutdown() {
    // Optional: cleanup if needed
  }
}

/**
 * General API rate limiter
 * 100 requests per minute per IP
 */
const generalLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100, // 100 requests per window
  message: {
    success: false,
    message: "Too many requests from this IP, please try again later.",
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  store: new RedisStore(redisClient, "rl:general:"), // Different prefix to separate from auth limiter
  skip: (req) => {
    // Skip rate limiting for health checks
    return req.path === "/health" || req.path === "/";
  },
});

/**
 * Authentication endpoints rate limiter
 * 5 requests per minute per IP (stricter for auth)
 */
const authLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5, // 5 requests per window
  message: {
    success: false,
    message: "Too many authentication attempts, please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
  store: new RedisStore(redisClient, "rl:auth:"), // Different prefix to separate from general limiter
  skipSuccessfulRequests: false,
});

/**
 * Per-user rate limiter using Redis
 * 200 requests per minute per user
 * This should be used after authentication middleware
 */
const userLimiter = async (req, res, next) => {
  if (!req.user || !req.user._id) {
    return next(); // Skip if user is not authenticated
  }

  const userId = req.user._id.toString();
  const redisKey = `rl:user:${userId}`;

  try {
    const count = await redisClient.incr(redisKey);
    if (count === 1) {
      await redisClient.expire(redisKey, 60); // 60 seconds window
    }

    if (count > 200) {
      return res.status(429).json({
        success: false,
        message: "Too many requests, please try again later.",
      });
    }

    // Add rate limit headers
    res.setHeader("X-RateLimit-Limit", "200");
    res.setHeader("X-RateLimit-Remaining", Math.max(0, 200 - count));
    res.setHeader(
      "X-RateLimit-Reset",
      new Date(Date.now() + 60000).toISOString()
    );

    next();
  } catch (error) {
    console.error("User rate limit error:", error);
    // On error, allow the request (fail open)
    next();
  }
};

module.exports = {
  generalLimiter,
  authLimiter,
  userLimiter,
};
