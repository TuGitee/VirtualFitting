const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,
  devServer: {
    proxy: {
      '/backend': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        pathRewrite: {
          '^/backend': ''
        }
      }
    }
  }

})