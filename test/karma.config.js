module.exports = config => {
  config.set({
    basePath: '../',
    singleRun: !config.dev, // Keep browser open in dev mode
    browsers: ['Firefox', 'Chrome'],
    frameworks: ['jasmine'],
    client: {
      jasmine: {
        random: !config.dev // Randomized in !dev mode
      }
    },
    files: ['test/testContext.js'],
    reporters: ['progress'],
    preprocessors: {
      'test/testContext.js': ['webpack']
    },
    babelPreprocessor: {
      options: {
        presets: ['env'],
        sourceMap: false
      }
    },
    webpack: {
      devtool: false,
      module: {
        rules: [{
          test: /\.js/,
          exclude: /node_modules/,
          use: [{
            loader: 'babel-loader'
          }]
        }]
      },
      watch: true,
      mode: 'development'
    },
    webpackServer: {
      noInfo: true
    }
  });
};
