const { loggerFactory } = require('mle-tools-node');
const config = require('../config');

loggerFactory.setUp(
  config.deploy.isInTraceMode,
  config.deploy.traceConsoleLevel,
  config.deploy.traceLogLevel
);

const logger = loggerFactory.getLogger();

module.exports = { loggerFactory, logger };
