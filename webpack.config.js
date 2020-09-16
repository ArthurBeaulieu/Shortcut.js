module.exports = env => {
  // Webpack clean and uglify plugins
  const path = require('path');
  const TerserPlugin = require('terser-webpack-plugin');
  const { CleanWebpackPlugin } = require('clean-webpack-plugin');
  // Utils path
  const SRC = path.resolve(__dirname, '');
  const DIST = path.resolve(__dirname, 'dist');
  // Webpack configuration object
  return {
    mode: env.dev === 'true' ? 'development' : 'production',
    watch: env.dev === 'true',
    entry: ['src/Shortcut.js'],
    stats: {
      warnings: env.dev === 'true',
    },
    devtool: false,
    output: {
      path: DIST,
      filename: `Shortcut.min.js`
    },
    module: {},
    plugins: [
      new CleanWebpackPlugin({
        root: DIST,
        verbose: true,
        dry: false
      })
    ],
    resolve: {
      extensions: ['.js'],
      modules: ['node_modules', SRC]
    },
    optimization: {
      minimizer: [
        new TerserPlugin({
          parallel: 4,
          terserOptions: {
            ecma: 5
          }
        })
      ]
    }
  };
};
