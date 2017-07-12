var path = require('path')
var webpack = require('webpack')
var ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
    entry: [
        ...process.env.NODE_ENV === 'production' ? [] : ['webpack-dev-server/client?http://localhost:8080', 'webpack/hot/only-dev-server'],
        './scripts/app.tsx'
        ],
    output: process.env.NODE_ENV === 'development' ? {
        filename: 'wwwroot/app.js',
        publicPath: 'http://localhost:8080/'
    } : {
        filename: 'app.js',
        path: path.resolve(__dirname, 'wwwroot.prd/')
    },
    devtool: process.env.NODE_ENV === 'development' ? 'inline-source-map' : 'hidden-source-map',
    externals: process.env.NODE_ENV === 'development' ? {} : {
        "react": "React",
        "react-dom": "ReactDOM"
    },
    plugins: [
        ...process.env.NODE_ENV === 'development' ? [] : [ new webpack.DefinePlugin({'process.env': { NODE_ENV: JSON.stringify(process.env.NODE_ENV) }}), new webpack.optimize.UglifyJsPlugin() ],
        new ExtractTextPlugin(process.env.NODE_ENV === 'development' ? 'wwwroot/app.css' : 'app.css')
    ],
    resolve: {
        extensions: [".webpack.js", ".web.js", ".js", ".ts", ".tsx"]
    },
    module: {
        rules: [
            {
                test: /\.(css|sass|scss)$/,
                exclude: /(node_modules)/,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    loader: [
                        {
                            loader: 'typings-for-css-modules-loader',
                            query: {
                                minimize: (process.env.NODE_ENV === 'production'),
                                modules: true,
                                sourceMap: (process.env.NODE_ENV === 'development'),
                                importLoaders: 2,
                                localIdentName: '[path]_[name]_[local]'
                            },
                        },
                        {
                            loader: 'sass-loader',
                            query: {
                                sourceMap: (process.env.NODE_ENV === 'development'),
                                sourceMapContents: (process.env.NODE_ENV === 'development'),
                            },
                        }
                    ]
                })
            },
            {
                test: /\.tsx?$/,
                exclude: /(node_modules)/,
                use: [
                    'react-hot-loader',
                    'babel-loader?presets[]=env',
                    'ts-loader'
                ]
            },
            {
                test: /\.js?$/,
                exclude: /(node_modules)/,
                use: [
                    'babel-loader?presets[]=env',
                ]
            },
            {
                test: /\.(eot|svg|ttf|woff|woff2)$/,
                use: 'file-loader?name=fonts/[name].[ext]'
            },
            {
                test: /\.(jpe?g|png|gif)$/,
                use: 'file-loader?name=images/[name].[ext]'
            }
        ]
    }    
}