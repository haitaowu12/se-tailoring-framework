const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';
  
  return {
    entry: './js/app.js',
    
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: isProduction ? '[name].[contenthash].js' : '[name].js',
      clean: true,
    },
    
    module: {
      rules: [
        {
          test: /\.css$/i,
          use: ['style-loader', 'css-loader'],
        },
        {
          test: /\.(png|svg|jpg|jpeg|gif)$/i,
          type: 'asset/resource',
        },
        {
          test: /\.(woff|woff2|eot|ttf|otf)$/i,
          type: 'asset/resource',
        },
      ],
    },
    
    plugins: [
      new HtmlWebpackPlugin({
        template: './index.html',
        minify: isProduction ? {
          removeComments: true,
          collapseWhitespace: true,
          removeRedundantAttributes: true,
          useShortDoctype: true,
          removeEmptyAttributes: true,
          removeStyleLinkTypeAttributes: true,
          keepClosingSlash: true,
          minifyJS: true,
          minifyCSS: true,
          minifyURLs: true,
        } : false,
      }),
      new ESLintPlugin({
        extensions: ['js'],
        exclude: 'node_modules',
        context: path.resolve(__dirname),
        overrideConfigFile: path.resolve(__dirname, '.eslintrc.js'),
      }),
      ...(isProduction ? [
        new CopyWebpackPlugin({
          patterns: [
            {
              from: 'data',
              to: 'data',
              noErrorOnMissing: true,
            },
          ],
        }),
      ] : []),
    ],
    
    devServer: {
      static: [
        {
          directory: path.join(__dirname, 'dist'),
        },
        {
          directory: path.join(__dirname, 'data'),
          publicPath: '/data'
        },
        {
          directory: path.join(__dirname, 'css'),
          publicPath: '/css'
        }
      ],
      compress: true,
      port: 3000,
      hot: true,
      open: true,
      historyApiFallback: true,
      devMiddleware: {
        index: true,
        publicPath: '/',
        writeToDisk: true,
      },
    },
    
    optimization: {
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
        },
      },
    },
    
    devtool: isProduction ? 'source-map' : 'cheap-module-source-map',
    
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'js'),
        '@components': path.resolve(__dirname, 'js/components'),
        '@data': path.resolve(__dirname, 'data'),
      },
    },
  };
};