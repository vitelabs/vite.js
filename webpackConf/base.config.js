const TypedocWebpackPlugin = require('typedoc-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const path=require('path');
console.log(path.join(__dirname, '../ViteJS'));
const plugins = [new TypedocWebpackPlugin({
    out: path.resolve(__dirname,'./docs'),
    module: 'commonjs',
    target: 'es5',
    exclude: '**/node_modules/**/*.*',
    experimentalDecorators: true,
    excludeExternals: true
})];

const baseDir = path.resolve(process.cwd(), './src');

module.exports = {
    plugins,
    mode: 'production',
    entry: {
        const: path.resolve(baseDir, './const/index.ts'),
        provider: path.resolve(baseDir, './provider/index.ts'),
        services: path.resolve(baseDir, './services/index.ts'),
        utils: path.resolve(baseDir, './utils/index.ts'),
        wallet: path.resolve(baseDir, './wallet/index.js'),
    },
    output: {
        filename:'[name].[hash].js',
        path: path.join(__dirname, '../ViteJS'),
        libraryTarget: 'umd',
        library: 'ELEMENT',
        umdNamedDefine: true
    },
    optimization: {
        splitChunks: {
            cacheGroups: {
                default: {
                    minChunks: 2,
                    priority: -20,
                    reuseExistingChunk: true
                }
            }
        },
        minimizer: [new TerserPlugin()]
    },
    module: {
        rules: [{
            test: /\.ts$/,
            exclude: /node_modules/,
            use: {
                loader: 'ts-loader',
                options: {
                    configFile: 'tsconfig.json'
                }
            }
        }, {
            test: /\.js$/,
            exclude: /node_modules/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: ['@babel/preset-env']
                }
            }
        }],
    },
    resolve: {
        alias: {
            const: path.resolve(__dirname, '../src/const/'),
            utils: path.resolve(__dirname, '../src/utils/')
        },
        extensions: ['.js', '.json', '.ts']
    }

};