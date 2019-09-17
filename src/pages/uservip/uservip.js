import "@babel/polyfill";
import Es6Promise from 'es6-promise';
Es6Promise.polyfill();
import Vue from "vue";
import '@/common/css/reset.css';
import '@/common/css/flex.css'
import UserVipApp from "./uservip.vue";
import router from './router';
import '@/common/js/rem.js'
import '@/common/js/filter'
import "@/common/js/ios.js"
import api from '@/api';
import { Popup } from 'vant';

Vue.use(Popup);
Vue.prototype.$http = api
var VueCookie = require('vue-cookie');
Vue.use(VueCookie);
Vue.config.productionTip = false;

import '../../utils/vant';

new Vue({
    router,
    render: h => h(UserVipApp)
  }).$mount("#app");