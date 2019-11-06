import Vue from 'vue'
import Router from 'vue-router'

import Test from '../userInfo/test.vue';
import Rate from '../userInfo/rate.vue'
Vue.use(Router);
const router = new Router({
    // mode: 'history',
    routes: [
        {
            path: '/test:id?',
            name: 'test',
            meta: {title: '测试', index: 0, keepAlive: false},
            component: Test
        },
        {
            path: '/userhome',
            name: 'userhome',
            meta: {title: 'vip首页', index: 1, keepAlive: false},
            component: () => import('../userInfo/userhome.vue')
        },
        {
            path: '/redPacketlist',
            name: 'redPacketlist',
            meta: {title: '红包雨', index: 2, keepAlive: false},
            component: () => import('../userInfo/redPacketlist.vue')
        },
        {
            path: '/zoomImg',
            name: 'zoomImg',
            component: () => import('../userInfo/zoomImg.vue')
        },
        {
            path: '/canvasdata:id?',
            name: 'canvasdata',
            component: () => import('../userInfo/canvas.vue')
        },
        {
            path: '/rate',
            name: 'rate',
            component: Rate
        },
    ]
})
router.onError((error) => {
    const pattern = /Loading chunk (\d)+ failed/g;
    const isChunkLoadFailed = error.message.match(pattern);
    const targetPath = router.history.pending.fullPath;
    if(isChunkLoadFailed){
        router.replace(targetPath);
    }
  })
router.beforeEach((to, from, next) => {
    /* 路由发生变化修改页面title */
    if (to.meta.title) {
      window.document.title = to.meta.title
    }
    next();
  })

export default router;