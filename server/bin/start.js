const Server = require('../server');

Server.start(process.env.PORT || 3000);

process.on('SIGINT', () => Server.stop('SIGINT'));
process.on('SIGTERM', () => Server.stop('SIGTERM'));
