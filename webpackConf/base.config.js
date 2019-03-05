const path = require('path');
const webpack = require('webpack');

const baseDir = path.resolve(process.cwd(), './src');
const target = process.env.build_target;
const Buffer_Path = path.join(__dirname, '../node_modules/buffer/index.js');

module.exports = {
    plugins:[
        new webpack.NormalModuleReplacementPlugin(/\/buffer\//, function(resource) {
            resource.request = Buffer_Path;
        }),
        new webpack.DefinePlugin({
            'processSilence': process.env.NODE_ENV && process.env.NODE_ENV.indexOf('test') === 0 ? 0 : 1
        }),
    ],
    target,
    mode: 'production',
    entry: {
        index: path.resolve(baseDir, './index.ts')
    },
    output: {
        filename:`[name].${target}.js`,
        path: path.join(__dirname, '../dist/vitejs'),
        libraryTarget: 'umd',
        library: 'vitejs',
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
        // minimizer: [new TerserPlugin({
        //     test: /\.j|ts(\?.*)?$/i
        // })]
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
            provider: path.resolve(__dirname, '../src/provider/'),
            netProcessor: path.resolve(__dirname, '../src/netProcessor/')
        },
        extensions: ['.js', '.json', '.ts']
    }
};
