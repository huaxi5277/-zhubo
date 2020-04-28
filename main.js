import Vue from 'vue'
import App from './App'
import validate from './js_sdk/fshjie-formvalidate/ys-validate.js'
import http from './utils/https.js'
Vue.config.productionTip = false
Vue.prototype.request = http;
Vue.prototype.$validate = validate
App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
