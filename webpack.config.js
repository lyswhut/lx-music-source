const path = require('path')
const webpack = require('webpack')
const packageJson = require('./package.json')

module.exports = {
  mode: 'production',
  target: 'web',
  entry: path.join(__dirname, './src/index.js'),
  output: {
    filename: 'lx-music-source.js',
    path: path.join(__dirname, './dist'),
  },
  // module: {
  //   rules: [
  //     {
  //       test: /\.js$/,
  //       loader: 'babel-loader',
  //       exclude: /node_modules/,
  //     },
  //   ],
  // },
  plugins: [
    new webpack.BannerPlugin(`@name Free listen
@description A lx-music source
@version v${packageJson.version}`,
    ),
    new webpack.DefinePlugin({
      mode: JSON.stringify(process.env.NODE_ENV),
    }),
  ],
  optimization: {
    minimize: false,
  },
}
