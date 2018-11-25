const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const plugins = [
];


(process.env.analyzer === 'true') && plugins.push(new BundleAnalyzerPlugin());

module.exports = {
    devtool: 'source-map',
    mode: 'development'
};
