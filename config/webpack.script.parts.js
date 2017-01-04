const webpack = require('webpack');

exports.EsLint = (paths) => {
  return {
    module: {
      rules: [
        {
          test: /\.js$/,
          include: paths,

          use: 'eslint-loader',
          enforce: 'pre'
        }
      ]
    }
  };
};

exports.loadJavaScript = (paths) => {
  return {
    module: {
      rules: [
        {
          test: /\.js$/,
          include: paths,

          loader: 'babel-loader',
          options: {
            // Enable caching for improved performance during
            // development.
            // It uses default OS directory by default. If you need
            // something more custom, pass a path to it.
            // I.e., { cacheDirectory: '<path>' }
            cacheDirectory: true
          }
        }
      ]
    }
  };
};

exports.minifyJavaScript = function() {
  return {
    plugins: [
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: false
        }
      })
    ]
  };
};
