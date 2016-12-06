'use strict';

const webpack = require('webpack')

const config = {
  module: {
    loaders: [
      { 
        test: /\.js$/, 
        loader: 'babel-loader',
        query: {
          presets: ['es2015']
        },
        exclude: /node_modules/ 
      }
    ]
  },
  output: {
    libraryTarget: 'commonjs'
  }
};

module.exports = config
