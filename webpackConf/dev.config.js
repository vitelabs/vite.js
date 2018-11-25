const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const plugins = [
];
const TypedocWebpackPlugin = require('typedoc-webpack-plugin');

(process.env.analyzer === 'true') && plugins.push(new BundleAnalyzerPlugin());
plugins.push( new TypedocWebpackPlugin({}));
module.exports = {
    devtool: 'source-map',
    mode: 'development'
};
