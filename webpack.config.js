const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const merge = require('webpack-merge')
const validate = require('webpack-validator')
const parts = require('./libs/parts')

const pkg = require('./package.json')
const PATHS = {
  app: path.join(__dirname, 'app'),
  style: path.join(__dirname, 'app', 'main.css'),
  build: path.join(__dirname, 'build')
}

const common = {
  entry: {
    style: PATHS.style,
    app: PATHS.app,
    vendor: Object.keys(pkg.dependencies || {})
  },
  output: {
    path: PATHS.build,
    filename: '[name].js'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loaders: ['babel?cacheDirectory'],
        include: PATHS.app
      },
      {
        test: /\.(jpg|png)$/,
        loader: 'file?name=[path][name].[hash].[ext]'
      },
      {
        test: /\.svg(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'file'
      },
      {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'url',
        query: {
          name: 'font/[hash].[ext]',
          limit: 5000,
          mimetype: 'application/font-woff'
        }
      },
      {
        test: /\.ttf$|\.eot$/,
        loader: 'file',
        query: {
          name: 'font/[hash].[ext]'
        }
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'DevChallange final',
      template: 'app/index.html'
    }),
    new webpack.ProvidePlugin({
      WaveSurfer: 'wavesurfer.js',
      'window.WaveSurfer': 'wavesurfer.js',
      '$': 'jquery',
      'jQuery': 'jquery',
      'window.jQuery': 'jquery'
    })
  ]
}

let config
const TARGET = process.env.npm_lifecycle_event
process.env.BABEL_ENV = TARGET

switch (TARGET) {
  case 'build':
    config = merge(
      common,
      {
        devtool: 'source-map',
        output: {
          path: PATHS.build,
          filename: '[name].[chunkhash].js',
          chunkFilename: '[chunkhash].js'
        }
      },
      parts.setFreeVariable(
        'process.env.NODE_ENV',
        'production'
      ),
      parts.clean(PATHS.build),
      parts.minify(),
      parts.extractCSS(PATHS.style)
    )
    break
  default:
    config = merge(
      common,
      {
        devtool: 'eval-source-map'
      },
      parts.setupCSS(PATHS.style),
      parts.devServer({
        host: process.env.HOST,
        port: process.env.PORT
      })
    )
}

module.exports = validate(config)
