const merge = require('webpack-merge');
const env=process.env.NODE_ENV||'development';

const base=require('./webpackConf/base.config');

let envConfig={};
try{
    envConfig=require(`./webpackConf/${env}.config.js`);
}catch(e){
    console.warn(`get ${env} config error,use base.config instead`);
}
module.exports=merge(base,envConfig);