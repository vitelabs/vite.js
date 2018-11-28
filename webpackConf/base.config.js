const path=require('path');


const baseDir = path.resolve(process.cwd(), './src');

module.exports = {
    // plugins,
    mode: 'production',
    entry: {
        const: path.resolve(baseDir, './const/address.ts'),
        provider: path.resolve(baseDir, './provider/index.ts'),
        services: path.resolve(baseDir, './services/index.ts'),
        utils: path.resolve(baseDir, './utils/index.ts'),
        wallet: path.resolve(baseDir, './wallet/index.js'),
    },
    output: {
        filename:'[name].js',
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
            const: path.resolve(__dirname, '../src/const/'),
            utils: path.resolve(__dirname, '../src/utils/')
        },
        extensions: ['.js', '.json', '.ts']
    }

};