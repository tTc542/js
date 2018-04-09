const autoprefixer = require('autoprefixer');

module.exports = {
  plugins: [
    // 自动为css添加各浏览器前缀 -webkit- -moz-
    autoprefixer()
  ]
};