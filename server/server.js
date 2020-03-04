const express = require('express');

const morgan = require('morgan');
const logger = require('./src/utils/logger');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const session = require('express-session');
const compression = require('compression');

const redisClient = require('./src/utils/redis');
const RedisStore = require('connect-redis')(session);

require('./src/utils/db');

const api = require('./src/api');

const app = express();
app.use(express.json());

app.use(compression());

const LOG_FORMAT = (process.env.NODE_ENV === 'production') ? 'combined' : 'dev';
app.use(morgan(LOG_FORMAT, {
  skip: (req, res) => res.statusCode < 400,
  stream: logger.errorStream,
}));
app.use(morgan(LOG_FORMAT, {
  skip: (req, res) => res.statusCode >= 400,
  stream: logger.debugStream,
}));

app.use(helmet());

const FIFTEEN_MINUTES_IN_MS = 15 * 60 * 1000;
const REQUEST_LIMIT = 200;
app.use(rateLimit({
  windowMs: FIFTEEN_MINUTES_IN_MS,
  max: REQUEST_LIMIT,
}));

const ONE_DAY_SESSION_TTL = 24 * 60 * 60;
app.use(session({
  secret: process.env.REDIS_SESSION_SECRET || 'redisSessionSecret',
  name: '_serverSession',
  resave: false,
  saveUninitialized: true,
  cookie: {secure: false},
  store: new RedisStore({client: redisClient, ttl: ONE_DAY_SESSION_TTL}),
}));

app.get('/', (req, res) => res.sendStatus(200));
app.get('/health', (req, res) => res.sendStatus(200));
app.use(api);

let server;
module.exports = {
  start() {
    const NODE_PORT = 3000;
    server = app.listen(NODE_PORT, () => {
      console.log(
          `[${process.env.NODE_ENV}] Server Started on Port: ${NODE_PORT}`,
      );
    });
    return app;
  },
  stop(signal) {
    server.close(() => {
      logger.debug(`[${signal}] Server Stopped...`);
      redisClient.quit();
      logger.debug(`[${signal}] Redis Client Stopped...`);
      process.exit(0);
    });
  },
};
