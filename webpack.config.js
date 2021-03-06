const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const CompressionPlugin = require("compression-webpack-plugin");
const webpack = require('webpack');
const path = require('path');

const htmlWebpackPlugin = new HtmlWebpackPlugin({
    template: './src/index.html',
});

const extractSass = new ExtractTextPlugin({
    filename: './style/[name].[contenthash].css',
});

const uglifyPlugin =  new UglifyJSPlugin({
    parallel: true,
});

const compressionPlugin = new CompressionPlugin({
    asset: "[path].gz[query]",
    algorithm: "gzip",
    test: /\.(js|html)$/,
    threshold: 10240,
    minRatio: 0.8
});

module.exports = {
    entry: [
        './src/index.js',
        './src/style/main.scss',
    ],
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },
    module: {
        rules: [{
                test: /.js?$/,
                include: [
                    path.resolve(__dirname, 'src'),
                ],
                exclude: [
                    path.resolve(__dirname, 'node_modules'),
                    path.resolve(__dirname, 'bower_components'),
                ],
                loader: 'babel-loader',
                query: {
                    presets: ['es2015'],
                },
            },
            {
                test: /\.(css|sass|scss)$/,
                use: extractSass.extract({
                    use: ['css-loader', 'sass-loader'],
                    // use style-loader in development
                    fallback: 'style-loader',
                }),
            },
            {
                test: /\.(jpg|png|gif|svg)$/,
                use: {
                    loader: 'url-loader',
                    options: {
                        limit: 10000,
                        name: 'images/[name].[ext]',
                        publicPath: '../',
                    },
                },
            },
            {
                test: /\.(ttf|eot|woff2?)$/,
                use: {
                    loader: 'url-loader',
                    options: {
                        liimit: 10000,
                        name: 'fonts/[hash].[ext]',
                        publicPath: '../',
                    }
                },
            },
        ],
    },
    resolve: {
        extensions: ['.json', '.js', '.jsx', '.css'],
    },
    devtool: 'source-map',
    devServer: {
        contentBase: './dist',
    },
    plugins: [
        new webpack.NoEmitOnErrorsPlugin(),
        htmlWebpackPlugin,
        extractSass,
        uglifyPlugin,
        compressionPlugin,
    ],
};
