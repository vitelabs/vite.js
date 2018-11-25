const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const TypedocWebpackPlugin = require('typedoc-webpack-plugin');

const plugins = [new TypedocWebpackPlugin({
    out: './docs',
    module: 'commonjs',
    target: 'es5',
    exclude: '**/node_modules/**/*.*',
    experimentalDecorators: true,
    excludeExternals: true
})];
const path = require('path');
// {
//                 from: /\~ViteJS.version/,
//                 to: version
//             }

module.exports = {
    plugins,
    mode: 'production',
    output: {
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
        minimizer: [
            // we specify a custom UglifyJsPlugin here to get source maps in production
            new UglifyJsPlugin({
                cache: true,
                parallel: true,
                uglifyOptions: {
                    compress: false,
                    ecma: 6,
                    mangle: true
                },
                sourceMap: false
            })
        ]
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