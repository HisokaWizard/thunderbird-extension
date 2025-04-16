const path = require('path');
const process = require('process');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const isProduction =
  process.argv.some((arg) => ['-p', '--production'].includes(arg)) ||
  process.env.NODE_ENV === 'production';

const copyPluginConfig = [
  {
    from: 'public/manifest.json',
    to: 'manifest.json',
  },
  {
    from: 'public/icons',
    to: 'icons',
  },
  {
    from: 'public/sidebar.html',
    to: 'sidebar.html',
  },
];

let entryConfig = {
  plugin: './src/index.tsx',
  background: './src/background.js',
};

if (!isProduction) {
  copyPluginConfig.push({
    from: 'public/mock-browser.js',
    to: 'mock-browser.js',
  });
  entryConfig = { 'mock-browser': './public/mock-browser.js', ...entryConfig };
}

module.exports = {
  devServer: {
    static: {
      directory: path.join(__dirname, 'public'),
    },
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    port: 13999,
    hot: 'only',
  },
  entry: entryConfig,
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    fallback: {
      browser: false,
    },
  },
  mode: isProduction ? 'production' : 'development',
  module: {
    rules: [
      {
        test: /\.[jt]sx?$/i,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-react', '@babel/preset-typescript'],
          },
        },
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'icons/[name][ext]',
        },
        use: [
          {
            loader: 'image-webpack-loader',
          },
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/plugin.html',
      filename: 'index.html',
    }),
    new CopyWebpackPlugin({
      patterns: copyPluginConfig,
    }),
  ],
};
