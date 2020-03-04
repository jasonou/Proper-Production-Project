const mongoose = require('mongoose');
const logger = require('./logger');

const MONGO_URI = process.env.MONGO_URI;

const mongoDB = async () => {
  await mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
  }).then(
      () => {
        logger.info(`[MONGO] [READY]: ${MONGO_URI}`);
      },
      (err) => {
        logger.error(`[MONGO] [ERROR]: ${err}`);
        throw err;
      },
  );
};

mongoDB().catch((err) => logger.error(err));
