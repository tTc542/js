const path = require('path');
const HTMLPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

// 判断当前开发环境是否是开发环境
const isDev = process.env.NODE_ENV === 'development';

const config = {
  // 默认输出浏览器环境可用
  target: 'web',
  // 编译入口
  entry: path.join(__dirname, 'src/index.js'),
  // 编译输出文件名及文件路径
  output: {
    filename: "[name].js",
    path: path.join(__dirname, 'dist')
  },
  // 为各类型文件定义loader
  module: {
    rules: [
      {
        test: /\.vue$/,
        use: ['vue-loader']
      },
      // css文件编译顺序： css文件编译完成后再使用style编译到js代码中
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      // 同上，先将styl文件编译成css文件，添加浏览器前缀后使用cssloader文件
      {
        test: /\.styl$/,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              // 自动使用已有的source map
              sourceMap: true
            }
          },
          'stylus-loader'
        ]
      },
      // 处理图片，小于1024的将使用base64转码，并统一命名格式
      {
        test: /\.(jpg|jpeg|png|gif|bmp|svg)$/,
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 1024,
              name: 'background-[name].[ext]'
            }
          }
        ]
      },
    ]
  },
  plugins: [
    // 定义变量，在代码中可通过该变量判断当前环境是否开发环境
    new webpack.DefinePlugin({
      'process.env': isDev ? '"development"' : '"production"'
    }),
    // 输出index.html文件
    new HTMLPlugin({
      title: 'Canvas'
    })
  ]
};

if (isDev) {
  // 可在浏览控制台source查看对应的source map
  config.devtool = "#cheap-module-eval-source-map";
  // 配置dev-server相关信息
  config.devServer = {
    port: 3000,
    host: '127.0.0.1',
    // 错误信息显示在页面
    overlay: {
      errors: true
    },
    // 热加载，依赖HotModuleReplacementPlugin插件
    hot: true
  };
  config.plugins.push(
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin()
  );
  config.mode = "development"
}
else {
  config.mode = "production"
}


module.exports = config;
