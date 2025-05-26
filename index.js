require('./helpers/env');
const app = require('./app');
const logger = require('./helpers/get-logger')(__filename);

const env = process.env.NODE_ENV || 'development';
const port = process.env.HTTP_PORT || 4000;

async function main() {
  app.listen(process.env.HTTP_PORT);
  logger.info('App in (%s) mode started successfully on the port %s', env, port);
}

main();
