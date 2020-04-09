import "@babel/polyfill";
import Es6Promise from 'es6-promise';
Es6Promise.polyfill();
import Vue from "vue";
import '@/common/css/reset.css';
import App from "./App.vue";
import router from "./router/index.js";
import MintUI from 'mint-ui'
import 'mint-ui/lib/style.css'
import '@/common/css/flex.css'
import '@/common/js/rem.js'
import '@/common/js/filter'
import "@/common/js/ios.js"
import api from '@/api'
import VueWechatTitle from 'vue-wechat-title';
Vue.use(VueWechatTitle)

// import infiniteScroll from 'vue-infinite-scroll'
// Vue.use(infiniteScroll)

Vue.config.productionTip = false;

import localStorage from '@/utils/cz-storage';
Vue.prototype.$storage = localStorage;

Vue.use(MintUI)
var VueCookie = require('vue-cookie');
Vue.use(VueCookie);
Vue.prototype.$http = api

Vue.prototype.out = function (url) {
  if (url.indexOf('http') != -1) {
      window.open(url, '_black')
  } else {
    this.$router.push({path: url})
  }
}

window.addEventListener('online',  function() {
  // 网络由异常到正常时触发
  setTimeout(function () {
    window.location.reload()
  },0)
 });
 window.addEventListener('offline', function() {
  // 网络由正常常到异常时触发
  setTimeout(function () {
    window.location.reload()
  },0)
 })
import '@/utils/mate.js'
// 环信挂载全局
import { conn, WebIM } from '@/common/js/newWebim.js';

Vue.prototype.$WebIM = WebIM
Vue.prototype.$imConn = conn;
import isMoble from '@/utils/ismoble';
Vue.prototype.$isMoble = isMoble;

import '@/utils/vant';

function isIos(){
  var u = navigator.userAgent;
  return u.indexOf("iPhone") > -1 || u.indexOf("Mac OS") > -1;
}
Vue.prototype.$isIos = isIos;


new Vue({
  router,
  render: h => h(App)
}).$mount("#app");
