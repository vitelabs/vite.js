const path = require('path');
const webpack = require('webpack');

const baseDir = path.join(__dirname, './src');
const target = process.env.build_target;

const plugins = [
    new webpack.DefinePlugin({ 'processSilence': process.env.NODE_ENV && process.env.NODE_ENV.indexOf('test') === 0 ? 0 : 1 }),
    new webpack.IgnorePlugin({ resourceRegExp: /^\.\/wordlists\/(?!english)/, contextRegExp: /bip39\/src/ })
];
if (target === 'web') {
    plugins.push(new webpack.ProvidePlugin({ process: 'process/browser', Buffer: [ 'buffer', 'Buffer' ] }));
}

module.exports = {
    plugins,
    target,
    mode: 'production',
    entry: {
        abi: path.join(baseDir, '/abi/index.ts'),
        accountBlock: path.join(baseDir, '/accountBlock/index.ts'),
        communication: path.join(baseDir, '/communication/index.js'),
        constant: path.join(baseDir, '/constant/index.ts'),
        error: path.join(baseDir, '/error/index.ts'),
        viteAPI: path.join(baseDir, '/viteAPI/index.ts'),
        keystore: path.join(baseDir, '/keystore/index.ts'),
        wallet: path.join(baseDir, '/wallet/index.ts'),
        utils: path.join(baseDir, '/utils/index.ts'),
        vitejs: path.join(baseDir, '/vitejs/index.ts'),
        WS: path.join(baseDir, '/WS/index.js'),
        HTTP: path.join(baseDir, '/HTTP/index.js'),
        IPC: path.join(baseDir, '/IPC/index.js')
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
            exclude: /node_modules(?!(\/bip39)|(\/scryptsy))/,
            use: {
                loader: 'ts-loader',
                options: { configFile: 'tsconfig.json' }
            }
        }, {
            test: /\.js$/,
            exclude: /node_modules(?!(\/bip39)|(\/scryptsy))/,
            use: {
                loader: 'babel-loader',
                options: { presets: ['@babel/preset-env'] }
            }
        } ]
    },
    resolve: {
        alias: {
            '~@vite/vitejs-utils': path.join(__dirname, '/src/utils/'),
            '~@vite/vitejs-abi': path.join(__dirname, '/src/abi/'),
            '~@vite/vitejs-communication': path.join(__dirname, '/src/communication/'),
            '~@vite/vitejs-error': path.join(__dirname, '/src/error/'),
            '~@vite/vitejs-constant': path.join(__dirname, '/src/constant/'),
            '~@vite/vitejs-keystore': path.join(__dirname, '/src/keystore/'),
            '~@vite/vitejs-viteapi': path.join(__dirname, '/src/viteAPI/'),
            '~@vite/vitejs-wallet': path.join(__dirname, '/src/wallet/'),
            '~@vite/vitejs-accountblock': path.join(__dirname, '/src/accountBlock/'),
            '~@vite/vitejs-ipc': path.join(__dirname, '/src/IPC/'),
            '~@vite/vitejs-http': path.join(__dirname, '/src/HTTP/'),
            '~@vite/vitejs-ws': path.join(__dirname, '/src/WS/'),
            '~@vite/vitejs': path.join(__dirname, '/src/vitejs/')
        },
        fallback: {
            vm: require.resolve('vm-browserify'),
            stream: require.resolve('stream-browserify'),
            crypto: require.resolve('crypto-browserify'),
            buffer: require.resolve('buffer/'),
            process: require.resolve('process/browser')
        },
        extensions: [ '.js', '.json', '.ts' ]
    }
};
