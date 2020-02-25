const winston = require('winston');

const options = {
  file: {
    level: 'info',
    name: 'file.info',
    filename: `./logs/info.log`,
    handleExceptions: true,
    json: true,
    maxsize: 5242880,
    maxFiles: 100,
    colorize: true,
  },
  console: {
    level: 'debug',
    handleExceptions: true,
    json: false,
    colorize: true,
  },
};

const logger = winston.createLogger({
  transports: [
    new winston.transports.Console(options.console),
    new winston.transports.File(options.file),
  ],
  exitOnError: false,
});

logger.stream = {
  write: (message) => logger.info(message),
};

module.exports = logger;
