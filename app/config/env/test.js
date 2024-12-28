const { defaultConfig } = require('./_default');
const path = require('path');

defaultConfig.deploy.isInTestMode = true; // disable server port listener
defaultConfig.deploy.isInTraceMode = true;
defaultConfig.deploy.traceConsoleLevel = 'debug';
defaultConfig.deploy.traceLogLevel = 'debug';

defaultConfig.deploy.confFile = path.join(__dirname, '../../../conf/conf.example.json');

module.exports = defaultConfig;
