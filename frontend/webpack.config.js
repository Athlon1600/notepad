const {VueLoaderPlugin} = require("vue-loader");
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
                    'postcss-loader',
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

    // requires extra dependencies
    // error while loading shared libraries: libX11-xcb.so.1: cannot open shared object file: No such file or directory
    // webpackConfig.plugins.push(prerender);
}

module.exports = webpackConfig;
