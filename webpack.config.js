const path = require('path');
const ReactRefreshPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const postcssNormalize = require('postcss-normalize');
// const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  mode: 'development',
  // target: 'web',
  entry: {
    main: './src/demo/index.tsx',
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        enforce: 'pre',
        use: ['source-map-loader']
      },
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: { plugins: ['react-refresh/babel'] },
          },
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true,
            }
          }
        ],
      },
      {
        test: /\.s?css$/,
        use: [
          'style-loader',
          // {
          //   loader: MiniCssExtractPlugin.loader,
          // },
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
              modules: false,
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [
                  'postcss-flexbugs-fixes',
                  ['postcss-preset-env', {
                    autoprefixer: {
                      flexbox: 'no-2009',
                    },
                    stage: 3,
                  }],
                  postcssNormalize(),
                ]
              },
              sourceMap: true,
            },
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
            }
          }
        ]
      }
    ],
  },

  resolve: {
    extensions: ['.tsx', '.ts', '.jsx', '.js'],
  },

  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'public/static'),
  },

  plugins: [
    // new MiniCssExtractPlugin(),
    new ReactRefreshPlugin(),
    new ForkTsCheckerWebpackPlugin(),
    new HtmlWebPackPlugin({
      filename: './index.html',
      template: './public/index.html',
    }),
  ],

  devServer: {
    contentBase: path.join(__dirname, 'public'),
    hot: true,
    liveReload: true,
    compress: true,
    port: parseInt(process.env.PORT, 10) || 3000,
    // after: (app, server, compiler) => {
    //   // launch browser...
    // },
  },
};