import Vue from 'vue'
import App from './App.vue'
import './setup'

Vue.config.productionTip = false

new Vue({
  render: (h) => h(App),
}).$mount('#app')
