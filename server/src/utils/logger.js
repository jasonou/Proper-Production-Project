const winston = require('winston');
require('winston-daily-rotate-file');
const LOG_LEVEL = process.env.LOG_LEVEL || 'debug';

let logFormat;
if (process.env.NODE_ENV === 'production') {
  logFormat = winston.format.combine(
      winston.format.timestamp(),
      winston.format.align(),
      winston.format.printf(
          (info) => `${info.timestamp} ${info.level}: ${info.message}`
      )
  );
} else {
  logFormat = winston.format.combine(
      winston.format.colorize(),
      winston.format.timestamp(),
      winston.format.align(),
      winston.format.printf(
          (info) => `${info.timestamp} ${info.level}: ${info.message}`
      )
  );
}

const options = {
  file: {
    level: LOG_LEVEL,
    filename: `./logs/server-%DATE%.log`,
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '14d',
  },
  console: {
    level: 'info',
  },
};

const logger = winston.createLogger({
  format: logFormat,
  transports: [
    new winston.transports.Console(options.console),
    new winston.transports.DailyRotateFile(options.file),
  ],
  exitOnError: false,
});

logger.stream = {
  write: (message) => logger.info(message),
};

module.exports = logger;
