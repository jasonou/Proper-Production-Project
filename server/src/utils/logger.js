const {createLogger, format, transports} = require('winston');
const {combine, timestamp, printf, colorize, label} = format;
const path = require('path');

const LOG_LEVEL = (process.env.NODE_ENV === 'production') ? 'error' : 'debug';

const messageFormat = printf(
    (info) =>
      `[${info.timestamp}] [${info.level}] [${info.label}]: ${info.message}`
);

const logger = createLogger({
  transports: [
    new transports.Console({
      level: LOG_LEVEL,
      handleExceptions: true,
      format: combine(
          label({label: path.basename(process.mainModule.filename)}),
          timestamp({format: 'YYYY-MM-DD HH:mm:ss'}),
          colorize(),
          messageFormat
      ),
    }),
  ],
  exitOnError: false,
});

logger.debugStream = {
  write: (message) => logger.debug(message),
};

logger.errorStream = {
  write: (message) => logger.error(message),
};

module.exports = logger;
