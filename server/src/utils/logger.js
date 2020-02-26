const {createLogger, format, transports} = require('winston');
const {combine, timestamp, printf, colorize, json, label} = format;
require('winston-daily-rotate-file');
const path = require('path');

const LOG_LEVEL = (process.env.NODE_ENV === 'production') ? 'info' : 'debug';

const messageFormat = printf(
    (info) => `${info.timestamp} ${info.level} [${info.label}]: ${info.message}`
);

let fileFormat;
if (process.env.NODE_ENV === 'production') {
  fileFormat = combine(
      json(),
      messageFormat
  );
} else {
  fileFormat = combine(
      messageFormat
  );
}

const logger = createLogger({
  level: LOG_LEVEL,
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
    new transports.DailyRotateFile({
      filename: `./logs/${LOG_LEVEL}-%DATE%.log`,
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFile: '14d',
      format: fileFormat,
    }),
  ],
  exitOnError: false,
});

logger.stream = {
  write: (message) => logger.info(message),
};

module.exports = logger;
