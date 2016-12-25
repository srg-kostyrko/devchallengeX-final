const webpack = require('webpack')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

exports.devServer = function (options) {
  return {
    devServer: {
      historyApiFallback: true,

      // Unlike the cli flag, this doesn't set
      // HotModuleReplacementPlugin!
      hot: true,
      inline: true,

      // Display only errors to reduce the amount of output.
      stats: 'errors-only',

      // Parse host and port from env to allow customization.
      host: options.host, // Defaults to `localhost`
      port: options.port // Defaults to 8080
    },
    plugins: [
      new webpack.HotModuleReplacementPlugin({
        multiStep: true
      })
    ]
  }
}

exports.setupCSS = function (paths) {
  return {
    module: {
      loaders: [
        {
          test: /\.css$/,
          loaders: ['style', 'css'],
          include: paths
        }
      ]
    }
  }
}

exports.extractCSS = function (paths) {
  return {
    module: {
      loaders: [
        {
          test: /\.css$/,
          loader: ExtractTextPlugin.extract('style', 'css')
        }
      ]
    },
    plugins: [
      new ExtractTextPlugin('[name].[chunkhash].css')
    ]
  }
}

exports.minify = function () {
  return {
    plugins: [
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: false
        }
      })
    ]
  }
}

exports.setFreeVariable = function (key, value) {
  const env = {}
  env[key] = JSON.stringify(value)

  return {
    plugins: [
      new webpack.DefinePlugin(env)
    ]
  }
}

exports.clean = function (path) {
  return {
    plugins: [
      new CleanWebpackPlugin([path], {
        root: process.cwd()
      })
    ]
  }
}
