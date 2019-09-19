const path = require('path');
const webpack = require('webpack');

const baseDir = path.join(__dirname, './src');
const target = process.env.build_target;
const Buffer_Path = path.join(__dirname, './node_modules/buffer/index.js');

const plugins = [
    new webpack.DefinePlugin({ 'processSilence': process.env.NODE_ENV && process.env.NODE_ENV.indexOf('test') === 0 ? 0 : 1 }),
    new webpack.IgnorePlugin(/^\.\/wordlists\/(?!english)/, /bip39\/src/)
];
if (target === 'web') {
    plugins.push(new webpack.NormalModuleReplacementPlugin(/\/buffer\//, function (resource) {
        resource.request = Buffer_Path;
    }));
}

module.exports = {
    plugins,
    target,
    mode: 'production',
    entry: {
        abi: path.join(baseDir, '/abi/index.ts'),
        addrAccount: path.join(baseDir, '/addrAccount/index.ts'),
        account: path.join(baseDir, '/account/index.ts'),
        accountBlock: path.join(baseDir, '/accountBlock/index.ts'),
        client: path.join(baseDir, '/client/index.ts'),
        communication: path.join(baseDir, '/communication/index.js'),
        constant: path.join(baseDir, '/constant/index.ts'),
        error: path.join(baseDir, '/error/index.ts'),
        hdAccount: path.join(baseDir, '/hdAccount/index.ts'),
        hdAddr: path.join(baseDir, '/hdAddr/index.ts'),
        keystore: path.join(baseDir, '/keystore/index.ts'),
        subscription: path.join(baseDir, '/subscription/index.ts'),
        privToAddr: path.join(baseDir, '/privToAddr/index.ts'),
        utils: path.join(baseDir, '/utils/index.ts'),
        vitejs: path.join(baseDir, '/vitejs/index.ts'),
        WS: path.join(baseDir, 'WS/index.js'),
        HTTP: path.join(baseDir, 'HTTP/index.js'),
        IPC: path.join(baseDir, 'IPC/index.js')
    },
    output: {
        globalObject: 'this',
        libraryTarget: 'umd',
        umdNamedDefine: true,
        library: '$vite_[name]',
        filename: `[name].${ target }.js`,
        path: path.join(__dirname, 'dist')
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
        rules: [ {
            test: /\.ts$/,
            exclude: /node_modules/,
            use: {
                loader: 'ts-loader',
                options: { configFile: 'tsconfig.json' }
            }
        }, {
            test: /\.js$/,
            exclude: /node_modules/,
            use: {
                loader: 'babel-loader',
                options: { presets: ['@babel/preset-env'] }
            }
        } ]
    },
    resolve: {
        alias: {
            '~@vite/vitejs-abi': path.join(__dirname, '/src/abi/'),
            '~@vite/vitejs-account': path.join(__dirname, '/src/account/'),
            '~@vite/vitejs-addraccount': path.join(__dirname, '/src/addrAccount/'),
            '~@vite/vitejs-accountblock': path.join(__dirname, '/src/accountBlock/'),
            '~@vite/vitejs-client': path.join(__dirname, '/src/client/'),
            '~@vite/vitejs-communication': path.join(__dirname, '/src/communication/'),
            '~@vite/vitejs-constant': path.join(__dirname, '/src/constant/'),
            '~@vite/vitejs-error': path.join(__dirname, '/src/error/'),
            '~@vite/vitejs-hdaccount': path.join(__dirname, '/src/hdAccount/'),
            '~@vite/vitejs-hdaddr': path.join(__dirname, '/src/hdAddr/'),
            '~@vite/vitejs-keystore': path.join(__dirname, '/src/keystore/'),
            '~@vite/vitejs-subscription': path.join(__dirname, '/src/subscription/'),
            '~@vite/vitejs-privtoaddr': path.join(__dirname, '/src/privToAddr/'),
            '~@vite/vitejs-utils': path.join(__dirname, '/src/utils/'),
            '~@vite/vitejs': path.join(__dirname, '/src/vitejs/')
        },
        extensions: [ '.js', '.json', '.ts' ]
    }
};
