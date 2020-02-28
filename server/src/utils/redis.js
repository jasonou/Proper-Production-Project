const redis = require('redis');
const logger = require('./logger');

const redisConfig = {
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  password: process.env.REDIS_PASSWORD,
};

const redisClient = redis.createClient(redisConfig);
const redisCon = `${redisConfig.host}:${redisConfig.port}`;

redisClient.on('connect', () => logger.debug(`[REDIS] [CONNECTING]`));
redisClient.on('ready', () => logger.info(`[REDIS] [READY]: ${redisCon}`));
redisClient.on('reconnecting', () => logger.debug(`[REDIS] [RECONNECTING]`));
redisClient.on('error', (err) => logger.error(`[REDIS] [ERROR]: ${err}`));
redisClient.on('end', () => logger.debug(`[REDIS] [END]: ${redisCon}`));

module.exports = redisClient;
