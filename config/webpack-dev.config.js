const webpack = require('webpack');
const path = require('path');
const fs = require('fs');
const ExtractTextPlugin = require('extract-text-webpack-plugin')

var nodeModules = {}
fs.readdirSync('node_modules')
	.filter(x => ['.bin'].indexOf(x) === -1)
	.forEach(x => nodeModules[x] = 'commonjs ' + x);

module.exports = {
	target: 'node',
	devtool: 'sourcemap',
	entry: './server.ts',
	externals: nodeModules,
	node: {
		console: false,
		global: false,
		process: false,
		Buffer: false,
		__filename: true,
		__dirname: true
	},
	output: {
		path: path.join(__dirname, '..', 'dist'),
		filename: 'server.js'
	},
	resolve: {
		extensions: ['.js', '.ts', '.tsx', '.css']
	},
	module: {
		loaders: [
			{
				test: /\.tsx?$/,
				loader: 'awesome-typescript-loader',
				options: {
					configFileName: './config/tsconfig.json'
				}
			},
			{
				test: /\.css$/,
				use: ExtractTextPlugin.extract({
					fallback: 'style-loader',
					use: 'css-loader',
				})
			},
		]
	},
	plugins: [
		new ExtractTextPlugin('../res/css/style.css'),
	],
}
