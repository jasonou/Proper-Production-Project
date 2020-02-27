const redis = require('redis');
const logger = require('./logger');

const redisConfig = {
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || '6379',
  password: process.env.REDIS_PASSWORD || 'password',
};

const redisClient = redis.createClient(redisConfig);
const redisConnection = `${redisConfig.host}:${redisConfig.port}`;

redisClient.on('connect', () => {
  logger.info(`[REDIS] [CONNECTING]: ${redisConnection}`);
});

redisClient.on('ready', () => {
  logger.info(`[REDIS] [READY]: ${redisConnection}`);
});

redisClient.on('reconnecting', (res) => {
  logger.info(`[REDIS] [RECONNECTING]: ${redisConnection}`);
});

redisClient.on('error', (err) => {
  logger.error(`[REDIS] [ERROR]: ${err}`);
});

redisClient.on('end', () => {
  logger.info(`[REDIS] [END]: ${redisConnection}`);
});

module.exports = redisClient;
