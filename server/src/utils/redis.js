const redis = require('redis');
const logger = require('./logger');

const REDIS_URL = process.env.REDIS_URL;
const redisClient = redis.createClient({url: REDIS_URL});

redisClient.on('connect', () => logger.debug(`[REDIS] [CONNECTING]`));
redisClient.on('ready', () => logger.info(`[REDIS] [READY]: ${REDIS_URL}`));
redisClient.on('reconnecting', () => logger.debug(`[REDIS] [RECONNECTING]`));
redisClient.on('error', (err) => logger.error(`[REDIS] [ERROR]: ${err}`));
redisClient.on('end', () => logger.debug(`[REDIS] [END]: ${REDIS_URL}`));

module.exports = redisClient;
