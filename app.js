console.log(new Date(), '### App is starting.');
require('dotenv').config();

const config = require('./app/config');
const { logger } = require('./app/factories/logger');

logger.info('### App launched');

const app = require('./app/factories/express');

const listen = () => {
  if (config.deploy.isInTestMode) {
    logger.warn('App warn - Be careful! We are in IS_TESTED’s mode, we do not listen on port.', config.deploy.isInTestMode);
    return;
  }

  app.listen(config.deploy.port);
  logger.info('### App started on port', config.deploy.port);
};

const startedApp = (async () => {
  logger.info('App should be ready soon...');
  try {
    listen();
  } catch (err) {
    logger.error('App Launching Issue : ', err);
  }
  return app;
})();

module.exports = startedApp;
