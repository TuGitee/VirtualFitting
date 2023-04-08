const { defineConfig } = require('@vue/cli-service')
const path = require('path')
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,
  devServer:{
  },
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'less',
      patterns: [
        path.resolve(__dirname, 'src/less/color.less'),
        path.resolve(__dirname, 'src/less/margin.less'),
        path.resolve(__dirname, 'src/less/nav.less'),
      ]
    }
  }

})