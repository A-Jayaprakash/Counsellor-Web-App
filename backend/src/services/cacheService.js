const redisClient = require("../config/redis");

/**
 * Cache service utility functions for Redis
 */

/**
 * Get cached data
 * @param {string} key - Cache key
 * @returns {Promise<any>} - Cached data or null
 */
const get = async (key) => {
  try {
    const data = await redisClient.get(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error(`Redis GET error for key ${key}:`, error);
    return null;
  }
};

/**
 * Set cached data with TTL
 * @param {string} key - Cache key
 * @param {any} value - Data to cache
 * @param {number} ttlSeconds - Time to live in seconds
 * @returns {Promise<boolean>} - Success status
 */
const set = async (key, value, ttlSeconds) => {
  try {
    const stringValue = JSON.stringify(value);
    if (ttlSeconds) {
      await redisClient.setEx(key, ttlSeconds, stringValue);
    } else {
      await redisClient.set(key, stringValue);
    }
    return true;
  } catch (error) {
    console.error(`Redis SET error for key ${key}:`, error);
    return false;
  }
};

/**
 * Delete cached data
 * @param {string} key - Cache key
 * @returns {Promise<boolean>} - Success status
 */
const del = async (key) => {
  try {
    await redisClient.del(key);
    return true;
  } catch (error) {
    console.error(`Redis DEL error for key ${key}:`, error);
    return false;
  }
};

/**
 * Delete multiple cache keys by pattern
 * @param {string} pattern - Pattern to match (e.g., "user:*")
 * @returns {Promise<number>} - Number of keys deleted
 */
const delByPattern = async (pattern) => {
  try {
    const keys = await redisClient.keys(pattern);
    if (keys.length === 0) return 0;
    return await redisClient.del(keys);
  } catch (error) {
    console.error(`Redis DEL pattern error for ${pattern}:`, error);
    return 0;
  }
};

/**
 * Cache wrapper for async functions
 * @param {string} key - Cache key
 * @param {Function} fetchFn - Function to fetch data if not cached
 * @param {number} ttlSeconds - Time to live in seconds
 * @returns {Promise<any>} - Cached or fetched data
 */
const getOrSet = async (key, fetchFn, ttlSeconds) => {
  try {
    // Try to get from cache
    const cached = await get(key);
    if (cached !== null) {
      return cached;
    }

    // Fetch fresh data
    const data = await fetchFn();
    
    // Cache the data
    if (data !== null && data !== undefined) {
      await set(key, data, ttlSeconds);
    }

    return data;
  } catch (error) {
    console.error(`Redis getOrSet error for key ${key}:`, error);
    // On error, try to fetch fresh data
    return await fetchFn();
  }
};

module.exports = {
  get,
  set,
  del,
  delByPattern,
  getOrSet,
};

