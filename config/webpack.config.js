const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const merge = require('webpack-merge');

const parts = {
  script: require('./webpack.script.parts'),
  style: require('./webpack.style.parts'),
  util: require('./webpack.util.parts')
};

const PATHS = {
  app: path.join(__dirname, '../app'),
  build: path.join(__dirname, '../build')
};

const common = merge(
  {
    entry: {
      app: PATHS.app
    },
    output: {
      path: PATHS.build,
      filename: '[name].js'
    },
    plugins: [
      new HtmlWebpackPlugin({
        title: 'Webpack demo'
      })
    ]
  },
  parts.style.PostCss(PATHS.app),
  parts.script.EsLint(PATHS.app)
);

module.exports = function(env) {
  if (env === 'production') {
    return merge(
      common,
      {
        output: {
          chunkFilename: 'scripts/[chunkhash].js',
          filename: '[name].[chunkhash].js',

          // Tweak this to match your GitHub project name
          publicPath: './'
        },
        plugins: [
          new webpack.HashedModuleIdsPlugin()
        ]
      },
      parts.util.setFreeVariable(
        'process.env.NODE_ENV',
        'production'
      ),
      parts.script.loadJavaScript(PATHS.app),
      parts.script.minifyJavaScript(),
      parts.util.extractBundles([
        {
          name: 'vendor',
          entries: ['react']
        },
        {
          name: 'manifest'
        }
      ]),
      parts.util.clean(PATHS.build),
      parts.util.generateSourcemaps('source-map'),
      parts.style.extractCSS(),
      parts.style.purifyCSS(PATHS.app)
    );
  }

  return merge(
    common,
    {
      // Disable performance hints during development
      performance: {
        hints: false
      },
      plugins: [
        new webpack.NamedModulesPlugin()
      ]
    },
    parts.util.generateSourcemaps('eval-source-map'),
    parts.style.loadCSS(),
    parts.util.devServer({
      // Customize host/port here if needed
      host: process.env.HOST,
      port: process.env.PORT
    })
  );
};
