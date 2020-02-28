const Server = require('../server');

Server.start(process.env.PORT);

process.on('SIGINT', () => Server.stop('SIGINT'));
process.on('SIGTERM', () => Server.stop('SIGTERM'));
