const path = require('path');
const pkg = require(path.resolve(__dirname, '..', '..', '..', 'package.json'));

const defaultString = (d, v) => {
  return d ? d : v;
};

const defaultConfig = {
  deploy: {
    port: defaultString(process.env.PORT, 3051),
    env: defaultString(process.env.NODE_ENV, 'development'),
    version: defaultString(pkg.version, '0.0.0'),
    isInTestMode: (defaultString(process.env.IS_TESTED, 'false') === 'true'),
    isInTraceMode: (defaultString(process.env.TRACE, 'false') === 'true'),
    traceConsoleLevel: (defaultString(process.env.TRACE_CONSOLE_LEVEL, 'info')),
    traceLogLevel: (defaultString(process.env.TRACE_LOG_LEVEL, 'info')),
    confFile: defaultString(process.env.CONF_PATH, path.join(__dirname, '../../../conf/conf.gitignored.json')),
    dnsToDig: defaultString(process.env.DNS_TO_DIG, '@dns200.anycast.me')
  }
};

module.exports = { defaultConfig, defaultString };
