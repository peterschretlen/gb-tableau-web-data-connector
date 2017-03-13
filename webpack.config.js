const webpack = require('webpack');
const path = require('path');

const BUILD_DIR = path.resolve(__dirname, 'src/public');
const APP_DIR = path.resolve(__dirname, 'src/app');

const config = {
  entry : {},
  output: {
    path: BUILD_DIR,
    filename: 'bundle.js'
  },
  //plugins: webpackPlugins(),
  devtool: 'source-map',
  module : {
    loaders : [
      {
        test : /\.js?/,
        include : APP_DIR,
        loader : 'babel-loader',
        query: {
          presets: ['es2015']
        }        
      }, 
      { 
        test:/bootstrap-sass[\/\\]assets[\/\\]javascripts[\/\\]/, 
        loader: 'imports-loader?jQuery=jquery' 
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2)$/,
        loader: 'url-loader?limit=650000&name=public/fonts/[name].[ext]'
      }
    ]
  }
};

config.entry[ 'bundle.js' ] = ['babel-polyfill', 'bootstrap-loader', APP_DIR + '/index.js'];

module.exports = config;