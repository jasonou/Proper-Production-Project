const Server = require('../server');

Server.start();

process.on('SIGINT', () => Server.stop('SIGINT'));
process.on('SIGTERM', () => Server.stop('SIGTERM'));
