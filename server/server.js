const express = require('express');

const morgan = require('morgan');
const logger = require('./src/utils/logger');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const session = require('express-session');
const compression = require('compression');

const redisClient = require('./src/utils/redis');
const RedisStore = require('connect-redis')(session);

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
  store: new RedisStore({client: redisClient, ttl: 86400}),
}));

app.get('/', (req, res) => res.sendStatus(200));
app.get('/health', (req, res) => res.sendStatus(200));
app.use(api);

let server;
module.exports = {
  start(port) {
    server = app.listen(port, () => {
      console.log(`[${process.env.NODE_ENV}] Server Started on Port: ${port}`);
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
