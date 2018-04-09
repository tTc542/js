import Vue from 'vue'
import App from  './app.vue'

import './assets/styles/app.styl'

const root = document.createElement('div');

document.body.appendChild(root);

new Vue({
  render: (r) => r(App)
}).$mount(root);
