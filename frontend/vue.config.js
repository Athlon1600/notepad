const path = require("path");
const PrerenderSpaPlugin = require('prerender-spa-plugin');

module.exports = {
    devServer: {
        proxy: {
            '^/(api|notes)': {
                target: 'http://localhost:3000',
                changeOrigin: true
            }
        }
    },
    configureWebpack: function (config) {
        return {
            plugins: [
                new PrerenderSpaPlugin({
                    staticDir: path.resolve(__dirname, 'dist'),
                    routes: ['/']
                }),
            ]
        }
    },
    pluginOptions: {
        "style-resources-loader": {
            preProcessor: "scss",
            patterns: [path.resolve(__dirname, "./src/assets/style.scss")]
        }
    },
    chainWebpack: config => {
        config
            .plugin('html')
            .tap(args => {
                args[0].title = 'Online Notepad - store your notes online'
                return args
            })
    }
};
