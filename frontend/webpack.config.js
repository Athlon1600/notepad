const webpack = require('webpack');
const { VueLoaderPlugin } = require("vue-loader");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const PrerenderSPAPlugin = require('prerender-spa-plugin-next')

const path = require("path");

const isProd = (process.env.NODE_ENV === 'production');

const webpackConfig = {
    mode: isProd ? 'production' : 'development',
    entry: './src/main.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                },
            },
            {
                test: /\.vue$/,
                loader: "vue-loader",
            },
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            },
            {
                test: /\.scss$/,
                use: [
                    'style-loader',
                    'css-loader',
                    'sass-loader'
                ]
            }
        ],
    },
    plugins: [
        new VueLoaderPlugin(),
        new HtmlWebpackPlugin({
            title: "Notepad.mx",
            template: "public/index.html",
            inject: true,
            minify: false,
            hash: true
        })
    ],
    devServer: {
        proxy: [
            {
                context: ['/api', '/notes'],
                target: 'http://localhost:3000',
                changeOrigin: true
            }
        ]
    },
    resolve: {
        extensions: [".js", ".vue"],
    },
};

if (isProd) {

    const prerender = new PrerenderSPAPlugin({
        routes: ['/']
    });

    config.plugins.push(prerender);
}

module.exports = webpackConfig;