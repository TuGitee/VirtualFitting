import Vue from 'vue'
import App from './App.vue'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI)

import { Notification } from 'element-ui'
Vue.prototype.$notify = Notification

import router from '@/router'

import axios from 'axios'
Vue.prototype.$axios = axios.create({
  baseURL: '/api',
  timeout: 5000
})

import VueAwesomeSwiper from 'vue-awesome-swiper'
import 'swiper/dist/css/swiper.css'
Vue.use(VueAwesomeSwiper)

import web from '@/web/index'
Vue.prototype.$ws = web.ws

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  router,
  beforeCreate() {
    Vue.prototype.$bus = this
  }
}).$mount('#app')
