import "@babel/polyfill";
import Es6Promise from 'es6-promise';
Es6Promise.polyfill();
import Vue from "vue";
import '@/common/css/reset.css';
import '@/common/css/flex.css'
import UservipApp from "./uservip.vue";
import router from './router';
import '@/common/js/rem.js'
import '@/common/js/filter'
import "@/common/js/ios.js"
import api from '@/api';
import { Popup, Toast } from 'vant';

Vue.use(Popup).use(Toast);
Vue.prototype.$http = api
var VueCookie = require('vue-cookie');
Vue.use(VueCookie);
Vue.config.productionTip = false;

import '../../utils/vant';

import Viewer from 'v-viewer'
import 'viewerjs/dist/viewer.css'
Vue.use(Viewer);
Viewer.setDefaults({ // 图片 可翻转插件
    "inline": false,
    "button": true,     //右上角按钮
    "navbar": false,    //底部缩略图
    "title": false,      //当前图片标题
    "toolbar": false,    //底部工具栏
    "tooltip": true,    //显示缩放百分比
    "movable": true,    //是否可以移动
    "zoomable": true,   //是否可以缩放
    "rotatable": true,  //是否可旋转
    "scalable": true,   //是否可翻转
    "transition": true, //使用 CSS3 过度
    "fullscreen": false, //播放时是否全屏
    "keyboard": true,   //是否支持键盘
    "url": "data-source"
});
// 图片 放大插件
import preview from 'vue-photo-preview'
import 'vue-photo-preview/dist/skin.css'
Vue.use(preview)
new Vue({
    router,
    render: h => h(UservipApp)
}).$mount("#app");