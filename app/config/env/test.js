const { defaultConfig } = require('./_default');

defaultConfig.deploy.isInTestMode = true; // disable server port listener
defaultConfig.deploy.isInTraceMode = true;
defaultConfig.deploy.traceConsoleLevel = 'debug';
defaultConfig.deploy.traceLogLevel = 'debug';

module.exports = defaultConfig;
