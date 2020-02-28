const redis = require('redis');
const logger = require('./logger');

const redisConfig = {
  host: 'redis',
  port: 6379,
  password: process.env.REDIS_PASSWORD,
};

const redisClient = redis.createClient(redisConfig);

redisClient.on('connect', () => logger.debug(`[REDIS] [CONNECTING]`));
redisClient.on('ready', () => logger.info(`[REDIS] [READY]: redis:6379`));
redisClient.on('reconnecting', () => logger.debug(`[REDIS] [RECONNECTING]`));
redisClient.on('error', (err) => logger.error(`[REDIS] [ERROR]: ${err}`));
redisClient.on('end', () => logger.debug(`[REDIS] [END]: redis:6379`));

module.exports = redisClient;
