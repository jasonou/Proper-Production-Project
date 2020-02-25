const redis = require('redis');
const logger = require('./logger');

const redisConfig = {
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || '6379',
  password: process.env.REDIS_PASSWORD || 'password',
};

const redisClient = redis.createClient(redisConfig);

redisClient.on('error', (err) => {
  logger.error('[REDIS] [ERROR] ===== ', err);
});

module.exports = redisClient;
