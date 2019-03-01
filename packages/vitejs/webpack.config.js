// const merge = require('webpack-merge');
const env = process.env.NODE_ENV || 'development';

let envConfig = env === 'es5' ? require('./webpackConf/es5.config.js') : require('./webpackConf/base.config');

module.exports = envConfig;
