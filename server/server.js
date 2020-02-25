const express = require('express');

const morgan = require('morgan');
const logger = require('./src/utils/logger');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const session = require('express-session');

const redisClient = require('./src/utils/redis');
const RedisStore = require('connect-redis')(session);

const api = require('./src/api');

const app = express();
app.use(express.json());

const HTTPS_LOG_FORMAT = process.env.HTTP_LOG_FORMAT || 'dev';
app.use(morgan(HTTPS_LOG_FORMAT, {stream: logger.stream}));

app.use(helmet());

app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
}));

app.use(session({
  secret: process.env.REDIS_SESSION_SECRET || 'redisSessionSecret',
  name: '_serverSession',
  resave: false,
  saveUninitialized: true,
  cookie: {secure: false},
  store: new RedisStore({client: redisClient}),
}));

app.get('/', (req, res) => res.sendStatus(200));
app.get('/health', (req, res) => res.sendStatus(200));
app.use(api);

let server;
module.exports = {
  start(port) {
    server = app.listen(port, () => {
      logger.info(`[${process.env.NODE_ENV}] Server Started on Port: ${port}`);
    });
    return app;
  },
  stop(signal) {
    logger.info(`[${signal}] Stopping Server...`);
    server.close(() => logger.info(`[${signal}] Server Stopped...`));
  },
};
