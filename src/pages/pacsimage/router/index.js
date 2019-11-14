import Vue from 'vue'
import Router from 'vue-router';

Vue.use(Router);
const router = new Router({
  mode: 'hash',
    routes: [
        {
            path: '/payimage:id?',
            meta: { title: '支付数字影像' },
            name: 'payimage',
            component: () => import('../components/pacs/payimage.vue')
        },
        {
            path: '/paysuccess:id?',
            meta: { title: '支付云影像' },
            name: 'paysuccess',
            component: () => import('../components/pacs/paysuccess.vue')
        }
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