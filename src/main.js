import Vue from 'vue'

import Cookies from 'js-cookie'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// import locale from 'element-ui/lib/locale/lang/en' // lang i18n

// import 'requirejs'
// var requirejs = require('requirejs')
// import SuperMapCesium from 'vue-cesium-supermap'

// Vue.use(SuperMapCesium, {
//   // cesiumPath 是指引用的Cesium的文件夹路径， 如
//   cesiumPath: './src/assets/Cesium'
//   // 或者在线引用(http)
//   // cesiumPath: 'http://support.supermap.com.cn:8090/webgl/Build/Cesium'
//   // 在线引用(https)
//   // cesiumPath: 'https://lauxb.github.io/vue-cesium-supermap/Cesium'
// })

import '@/styles/index.scss' // global css

import App from './App'
import router from './router'
import store from './store'

import i18n from './lang' // Internationalization
import '@/icons' // icon
import '@/permission' // permission control

// Vue.use(, { locale })

Vue.use(Element, {
  size: Cookies.get('size') || 'medium', // set element-ui default size
  i18n: (key, value) => i18n.t(key, value)
})

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  i18n,
  render: h => h(App)
})
