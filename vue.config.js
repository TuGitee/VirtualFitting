const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,
  devServer: {
    proxy: {
      '/api': {
        target: 'http://42.192.154.61:39999/hooks/deploy',
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  }

})