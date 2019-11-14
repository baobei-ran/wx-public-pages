import "@babel/polyfill";
import Es6Promise from 'es6-promise';
Es6Promise.polyfill();
import Vue from "vue";
import '@/common/css/reset.css';
import '@/common/css/flex.css'
import PacsApp from './pacsApp.vue'
import router from './router';
import '@/common/js/rem.js'
import '@/common/js/filter'
import "@/common/js/ios.js"
import api from '@/api';
Vue.prototype.$http = api;
import { Toast, Button } from 'vant';

Vue.use(Button).use(Toast);
Vue.config.productionTip = false;
new Vue({
    router,
    render: h => h(PacsApp)
}).$mount("#root");