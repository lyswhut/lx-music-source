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
@version v${packageJson.version}
@wy_token null
@wy_token_desc 如果你有网易音乐的会员，可启用vip歌曲、更高音质的支持，将上面 @wy_token null 中的 null 改为你的token即可，token获取方式看常见问题歌单导入
@wy_token_desc 需要注意的是，自定义 token 存在导致账号被封禁的风险，token是账号的临时秘钥，注意不要随意分享`,
    ),
    new webpack.DefinePlugin({
      mode: JSON.stringify(process.env.NODE_ENV),
    }),
  ],
  optimization: {
    minimize: false,
  },
}
