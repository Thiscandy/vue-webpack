// 让 webpack 自动加上 css 兼容前缀（-ms -moz -webkit
const autoprefixer = require('autoprefixer')

module.exports = {
  plugins: [
    autoprefixer()
  ]
}