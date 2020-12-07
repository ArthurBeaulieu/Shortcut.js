'use strict';

const path = require('path');
const webpack = require('webpack');
const loaders = require('./loaders');
const plugins = require('./plugins');

module.exports = {
  entry: ['./src/Shortcut.js'],
  module: {
    rules: [
      loaders.JSLoader
    ]
  },
  output: {
    filename: 'Shortcut.bundle.js',
    path: path.resolve(__dirname, '../dist'),
    library: 'Shortcut', // We set a library name to bundle the export default of the class
    libraryTarget: 'window', // Make it globally available
    libraryExport: 'default' // Make Kom.default become Kom
  },
  plugins: [
    new webpack.ProgressPlugin(),
    plugins.CleanWebpackPlugin,
    plugins.ESLintPlugin
  ]
};
