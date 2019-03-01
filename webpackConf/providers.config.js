const path = require('path');
const webpack = require('webpack');

const baseDir = path.resolve(process.cwd(), './src');
const target = process.env.build_target;

module.exports = {
    plugins:[
        new webpack.DefinePlugin({
            'processSilence': process.env.NODE_ENV && process.env.NODE_ENV.indexOf('test') === 0 ? 0 : 1
        }),
    ],
    target,
    mode: 'production',
    entry: {
        providers: path.resolve(baseDir, 'provider/index.ts'),
        WS: path.resolve(baseDir, 'provider/WS.js'),
        HTTP: path.resolve(baseDir, 'provider/HTTP.js'),
        IPC: path.resolve(baseDir, 'provider/IPC.js')
    },
    output: {
        libraryTarget: 'umd',
        umdNamedDefine: true,
        filename:'[name].js',
        path: path.join(__dirname, '../dist/providers'),
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
        }
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
            client: path.resolve(__dirname, '../src/client/'),
            const: path.resolve(__dirname, '../src/const/'),
            utils: path.resolve(__dirname, '../src/utils/'),
            provider: path.resolve(__dirname, '../src/provider/')
        },
        extensions: ['.js', '.json', '.ts']
    }
};
