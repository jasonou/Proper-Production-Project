const {createLogger, format, transports} = require('winston');
const {combine, timestamp, printf, colorize, label} = format;
const path = require('path');

const LOG_LEVEL = (process.env.NODE_ENV === 'production') ? 'info' : 'debug';

const messageFormat = printf(
    (info) =>
      `[${info.timestamp}] [${info.level}] [${info.label}]: ${info.message}`
);

const logger = createLogger({
  level: LOG_LEVEL,
  handleExceptions: true,
  format: combine(
      label({label: path.basename(process.mainModule.filename)}),
      timestamp({format: 'YYY-MM-DD HH:mm:ss'})
  ),
  transports: [
    new transports.Console({
      format: combine(
          colorize(),
          messageFormat
      ),
    }),
    new transports.File({
      filename: `./logs/${LOG_LEVEL}.log`,
      format: combine(
          messageFormat
      ),
    }),
  ],
  exitOnError: false,
});

logger.stream = {
  write: (message) => logger.info(message),
};

module.exports = logger;
