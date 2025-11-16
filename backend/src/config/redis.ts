import Redis from 'ioredis';
import config from './index';
import logger from '../utils/logger';

interface RedisAPI {
  getClient: () => Redis | undefined;
  get: (key: string) => Promise<string | null>;
  set: (key: string, value: string, expireSeconds?: number) => Promise<boolean>;
  del: (key: string) => Promise<boolean>;
  exists: (key: string) => Promise<boolean>;
  disconnect: () => Promise<void>;
}

let redisClient: RedisAPI;

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
  class RedisClient implements RedisAPI {
    private client: Redis;
    private static instance: RedisClient;
    private constructor() {
      this.client = new Redis(config.redis.url, {
        maxRetriesPerRequest: 3,
        retryStrategy: (times) => Math.min(times * 50, 2000),
      });
      this.client.on('connect', () => logger.info('Redis connected'));
      this.client.on('error', (err) => logger.error('Redis error:', err));
      this.client.on('close', () => logger.warn('Redis connection closed'));
    }
    static getInstance(): RedisClient { if (!RedisClient.instance) RedisClient.instance = new RedisClient(); return RedisClient.instance; }
    getClient(): Redis { return this.client; }
    async get(key: string) { return this.client.get(key); }
    async set(key: string, value: string, expireSeconds?: number) { if (expireSeconds) await this.client.setex(key, expireSeconds, value); else await this.client.set(key, value); return true; }
    async del(key: string) { await this.client.del(key); return true; }
    async exists(key: string) { return (await this.client.exists(key)) === 1; }
    async disconnect() { await this.client.quit(); }
  }
  redisClient = RedisClient.getInstance();
}

export default redisClient;
