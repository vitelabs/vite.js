const path = require('path');
const webpack = require('webpack');

const Buffer_Path = path.join(__dirname, './node_modules/buffer/index.js');
const target = process.env.build_target;

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
        index: path.join(__dirname, './src/index.ts')
    },
    output: {
        filename: `[name].${target}.js`,
        path: path.join(__dirname, './dist'),
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
            // exclude: /node_modules/,
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
        extensions: ['.js', '.json', '.ts']
    }
};
