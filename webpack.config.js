const path = require('path')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const HTMLPlugin = require('html-webpack-plugin')
const webpack = require('webpack')
const ExtractPlugin = require('extract-text-webpack-plugin')

const isDev = process.env.NODE_ENV === 'development'

const config = {
    target: 'web',
    entry:path.join(__dirname, 'src/index.js'),
    output: {
        filename: 'bundle.js',
        path: path.join(__dirname, 'dist')
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            },
            {
                test: /\.jsx$/,
                loader: 'babel-loader'
            },
            {
                test: /\.(jpg|png|jpeg|gif|svg)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 1024,
                            name: '[name].[ext]'
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        new VueLoaderPlugin(),
        new webpack.DefinePlugin({
            'process.env': {
                NODE_EVN: isDev ? '"development"' : '"production"'
            }
        }),
        new HTMLPlugin()
    ]
}

if (isDev) {
    config.module.rules.push({
        test: /\.styl/,
        use: [
            'style-loader',
            'css-loader',
            'stylus-loader'
        ]
    })
    config.mode = 'development'
    config.devtool = '#cheap-module-eval-source-map'
    config.devServer = {
        port: 8084,
        host: '0.0.0.0',
        overlay: {
            errors: true,
        },
        hot: true,   // 只刷新更改组件的代码不刷新页面
        // open: true    打包完后打开浏览器
    }
    config.plugins.push(
        new webpack.HotModuleReplacementPlugin(),  // 热加载替换插件
        new webpack.NoEmitOnErrorsPlugin()         // 不发出错误插件提示
    )
} else {
    config.mode = 'production',
    config.entry = {
        app: path.join(__dirname, 'src/index.js'),
        vendor: ['vue']
    }
    config.output.filename = '[name].[chunkhash:8].js'
    config.module.rules.push(
        {
            test: /\.styl/,
            use: ExtractPlugin.extract({
                fallback: 'style-loader',
                use: [
                    'css-loader',
                    {
                        loader: 'postcss-loader',
                        options: {
                            sourceMap: true
                        }
                    },
                    'stylus-loader'
                ]
            })
        }
    )
    config.plugins.push(
        new ExtractPlugin('styles.[chunkhash:8].css'),
        // 内部文件单独打包出来
        new webpack.optimize.RuntimeChunkPlugin({
            name: 'vendor'
        }),
        // 单独打包框架的代码（vue之类的
        new webpack.optimize.RuntimeChunkPlugin({
            name: 'runtime'
        })
    )
}

module.exports = config