const Redis = require('ioredis');
const config = require('./index');
const logger = require('../utils/logger');

let redisClient;

if (!config.redis.enabled) {
  logger.info('Redis disabled via REDIS_ENABLED=false; using no-op stub');
  redisClient = {
    getClient: () => undefined,
    async get() { return null; },
    async set() { return true; },
    async del() { return true; },
    async exists() { return false; },
    async disconnect() { /* no-op */ },
  };
} else {
  class RedisClient {
    constructor() {
      this.client = new Redis(config.redis.url, {
        maxRetriesPerRequest: 3,
        retryStrategy: (times) => Math.min(times * 50, 2000),
      });
      this.client.on('connect', () => logger.info('Redis connected'));
      this.client.on('error', (err) => logger.error('Redis error:', err));
      this.client.on('close', () => logger.warn('Redis connection closed'));
    }

    static getInstance() {
      if (!RedisClient.instance) {
        RedisClient.instance = new RedisClient();
      }
      return RedisClient.instance;
    }

    getClient() { return this.client; }
    async get(key) { return this.client.get(key); }
    async set(key, value, expireSeconds) {
      if (expireSeconds) {
        await this.client.setex(key, expireSeconds, value);
      } else {
        await this.client.set(key, value);
      }
      return true;
    }
    async del(key) { await this.client.del(key); return true; }
    async exists(key) { return (await this.client.exists(key)) === 1; }
    async disconnect() { await this.client.quit(); }
  }
  
  redisClient = RedisClient.getInstance();
}

module.exports = redisClient;
