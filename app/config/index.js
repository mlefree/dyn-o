let config = {};

let envFile = './env/development';
if (process.env.NODE_ENV === 'test') {
  envFile = './env/test';
} else if (process.env.NODE_ENV === 'production') {
  envFile = './env/production';
}
config = require(envFile);

console.log('### App configEnv: ', process.env.NODE_ENV, JSON.stringify(config));
module.exports = config;
