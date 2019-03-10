const path = require('path');
const webpack = require('webpack');

const baseDir = path.join(__dirname, './src');
const target = process.env.build_target;
const Buffer_Path = path.join(__dirname, './node_modules/buffer/index.js');

module.exports = {
    plugins:[
        new webpack.NormalModuleReplacementPlugin(/\/buffer\//, function(resource) {
            resource.request = Buffer_Path;
        }),
        new webpack.DefinePlugin({
            'processSilence': process.env.NODE_ENV && process.env.NODE_ENV.indexOf('test') === 0 ? 0 : 1
        })
    ],
    target,
    mode: 'production',
    entry: {
        abi: path.join(baseDir, '/abi/index.ts'),
        account: path.join(baseDir, '/account/index.ts'),
        accountBlock: path.join(baseDir, '/accountBlock/index.ts'),
        client: path.join(baseDir, '/client/index.ts'),
        communication: path.join(baseDir, '/communication/index.js'),
        constant: path.join(baseDir, '/constant/index.ts'),
        error: path.join(baseDir, '/error/index.ts'),
        hdAccount: path.join(baseDir, '/hdAccount/index.ts'),
        hdAddr: path.join(baseDir, '/hdAddr/index.ts'),
        keystore: path.join(baseDir, '/keystore/index.ts'),
        netProcessor: path.join(baseDir, '/netProcessor/index.ts'),
        privToAddr: path.join(baseDir, '/privToAddr/index.ts'),
        utils: path.join(baseDir, '/utils/index.ts'),
        vitejs: path.join(baseDir, '/vitejs/index.ts'),
        WS: path.join(baseDir, 'WS/index.js'),
        HTTP: path.join(baseDir, 'HTTP/index.js'),
        IPC: path.join(baseDir, 'IPC/index.js')
    },
    output: {
        libraryTarget: 'umd',
        umdNamedDefine: true,
        filename: `[name].${target}.js`,
        path: path.join(__dirname, 'packages/dist'),
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
            abi: path.join(__dirname, '/src/abi/'),
            account: path.join(__dirname, '/src/account/'),
            addrAccount: path.join(__dirname, '/src/addrAccount/'),
            accountBlock: path.join(__dirname, '/src/accountBlock/'),
            client: path.join(__dirname, '/src/client/'),
            communication: path.join(__dirname, '/src/communication/'),
            constant: path.join(__dirname, '/src/constant/'),
            error: path.join(__dirname, '/src/error/'),
            hdAccount: path.join(__dirname, '/src/hdAccount/'),
            hdAddr: path.join(__dirname, '/src/hdAddr/'),
            keystore: path.join(__dirname, '/src/keystore/'),
            netProcessor: path.join(__dirname, '/src/netProcessor/'),
            privToAddr: path.join(__dirname, '/src/privToAddr/'),
            utils: path.join(__dirname, '/src/utils/'),
            vitejs: path.join(__dirname, '/src/vitejs/')
        },
        extensions: ['.js', '.json', '.ts']
    }
};