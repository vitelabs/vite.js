// const merge = require('webpack-merge');
const env = process.env.NODE_ENV || 'development';

let envConfig = env === 'providers' ? require('./webpackConf/providers.config') : require('./webpackConf/base.config');

module.exports = envConfig;
