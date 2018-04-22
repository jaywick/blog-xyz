const serverDevConfig = require('./webpack-dev.config')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

const config = Object.assign(serverDevConfig, {
    devtool: undefined,
    plugins: serverDevConfig.plugins.concat([
        new UglifyJSPlugin(),
        new OptimizeCssAssetsPlugin({
            assetNameRegExp: /\.css$/g,
            cssProcessor: require('cssnano'),
            cssProcessorOptions: { discardComments: { removeAll: true } },
            canPrint: true,
        }),
    ])
})

module.exports = config;
