const express = require('express');
const config = require('../config');
const { logger } = require('../factories/logger');
const morgan = require('morgan');

const _app = express();

module.exports = (function () {

  logger.info('App trace enabled: ', config.deploy.isInTraceMode);
  logger.info('App version: ', config.deploy.env, config.deploy.version);

  if (config.deploy.isInTraceMode) {
    const log = {
      stream: {
        write: function (message) {
          return logger.debug('Express debug: ', message);
        },
      },
    };
    _app.use(morgan('tiny', log));
  }

  const eRouter = express.Router();
  const routerV1 = require('../config/routes/routes.v1')(eRouter);
  _app.use('/v1', routerV1);
  _app.use(function (req, res, next) {
    res.status(404).send();
  });

  logger.info('App routed.');

  return _app;
})();
