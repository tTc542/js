const path = require('path');
const HTMLPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

// 判断当前开发环境是否是开发环境
const isDev = process.env.NODE_ENV === 'development';

const config = {
  // 默认输出浏览器环境可用
  target: 'web',
  // 编译入口
  entry: path.join(__dirname, 'src/index.js'),
  // 编译输出文件名及文件路径
  output: {
    filename: "[name]-[hash:8].js",
    path: path.join(__dirname, 'dist')
  },
  // 为各类型文件定义loader
  module: {
    rules: [
      {
        test: /\.vue$/,
        use: ['vue-loader']
      },
      // 处理图片，小于1024的将使用base64转码，并统一命名格式
      {
        test: /\.(jpg|jpeg|png|gif|bmp|svg)$/,
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 1024,
              name: '[name].[ext]'
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
  config.module.rules.push(// 样式文件编译顺序，先将styl文件编译成css文件，添加浏览器前缀后使用css编译 后使用style编译到js文件中
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
    });
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
  // 库文件单独打包
  config.entry = {
    main: path.join(__dirname, 'src/index.js'),
    vendor: ['vue']
  };
  config.optimization = {
    splitChunks: {
      cacheGroups: {
        main: {
          name: "main"
        },
        vendor: {
          name: "vendor"
        }
      }
    },
    // 避免异步加载导致其他chunk的hash发生变化而重复加载问题
    runtimeChunk: true
  };
  // 使用chunkhash缓存，避免重复加载
  config.output.filename = '[name]-[chunkhash:8].js';
  config.mode = "production";
  // 样式文件单独打包，依赖ExtractTextPlugin插件
  config.module.rules.push(
    {
      test: /\.styl$/,
      use: ExtractTextPlugin.extract(
        {
          fallback: "style-loader",
          use:[
            "css-loader",
            {
              loader: "postcss-loader",
              options: {
                sourceMap: true
              }
            },
            "stylus-loader"
          ]
        }
      )

    }
  );

  config.plugins.push(
    new ExtractTextPlugin('styles.[chunkhash:8].css')
  );
}

module.exports = config;
