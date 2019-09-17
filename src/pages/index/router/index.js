import Vue from 'vue'
import Router from 'vue-router'

const Phones = () => import('@/components/user/phonelogin' /* webpackChunkName: "ph" */);      // 绑定手机号
const Authentication = () => import('@/components/user/authentication' /* webpackChunkName: "pn" */);  // 添加问诊人信息
const UserMsg = () => import('@/components/user/usermsg' /* webpackChunkName: "pn" */);  // 认证提示
const Agreement = () => import('@/components/user/agreement' /* webpackChunkName: "pn" */);      // 协议


// import Personal from '../components/user/personal';  // 个人中心
const Personal = () => import('@/components/user/personal');           // 个人中心
const Userdata = () => import('@/components/user/userdata');           // 个人中心,点击头像进入的
const HealthData = () => import('@/components/user/healthdata');       // 健康数据
const AuthenticationYes = () => import('@/components/user/authenticationYes');  // 问诊信息确认

const Mydoctor = () =>import('@/components/doctor/mydoctor')  // 我的医生(1.1.0)
// const Docrecord = () => import('../components/doctor/docrecord' /* webpackChunkName: "amr" */) // 咨询记录(1.1.0)

import DoctorDetail from '@/components/doctor/doctordetail'  // 医生详情
import Yuyuedoc from '@/components/doctor/yuyuedoc'          // 预约医生信息(1.1.0)
import WxpaySucceed from '@/components/doctor/wxpaySucceed'  // 预约支付成功(1.1.0)
import DoctorShop from '@/components/doctor/doctorshop'      // 医生店铺
import ShopDetail from '@/components/doctor/shopdetail'      // 医生店铺商品详情
import Doctororder from '@/components/doctor/doctororder'    // 商品下单

const Dingdan = () => import('@/components/goods/orderList');   // 商品订单（1.2）
import Orderdetails from "@/components/goods/orderdetails";                      // 订单信息（1.2）

import AddorderDetail from '@/components/goods/goodsdetails/addorderdetail'   // 待支付订单详情
import TakeorderDetail from '@/components/goods/goodsdetails/takeorderdetail'   // 待收货订单详情
import SuccessOrder from '@/components/goods/goodsdetails/successOrder'   // 已完成 和 已取消 的订单详情
// 21
import OerderSite from '@/components/site/oerdersite';                // 购买商品选择列表
import SetOrder from '@/components/site/setorder';                // 再次购买商品选择列表
const SiteList = () => import('@/components/site/sitelist');                 // 地址管理列表
const AddSite  = () => import('@/components/site/addsite');                 // 添加地址
const EditSite = () => import('@/components/site/editsite');                 // 编辑地址

const RecipeList = () => import('@/components/recipes/recipelist' /* webpackChunkName: "recipe" */);  //  处方订单列表
const RecipeMsg = () => import('@/components/recipes/recipeMsg' /* webpackChunkName: "recipe" */);    //  处方信息
const ImgDetails = () => import('@/components/recipes/imgdetails' /* webpackChunkName: "recipe" */);  //  处方详情

import RecipeAudit from '@/components/recipes/recipeAudit';       // 电子处方 药品药师审核页(1.2)
import Recipeorder from '@/components/recipes/recipeorder';       // 电子处方 药品下单（1.2）
import Drugpaysuccess from '@/components/recipes/drugpaysuccess'; // 电子处方 下单支付成功提示页（1.2）
import Recipedrug from '@/components/recipes/recipedrug.vue';    // 药店订单处方信息（1.2）
import Drugdetail from '@/components/recipes/drugdetail.vue';    // 处方药品的药品详情 （1.2.0）

const SearchDoctor = () => import('@/components/doctor/searchdoctor' /* webpackChunkName: "search" */);                    //  更多医生
const SearchSelectDoctor = () => import('@/components/doctor/searchSelectDoctor' /* webpackChunkName: "search" */);        //  更多医生搜索
const DoctorShopList = () => import('@/components/doctor/doctorshoplist');                // 更多医生店铺
import Error404 from '@/components/errors/err404';


// 预约门诊记录(1.1.0)
import Subscribe from '@/components/Subscribe/subscribe.vue';
import CancelSubscribe from '@/components/Subscribe/cancelSubscribe.vue';  // 取消预约
import SubscribeDetail from '@/components/Subscribe/subscribeDetail.vue';  // 预约记录详情
import PayDetails from '@/components/Subscribe/payDetails.vue';            // 待支付预约记录详情
// 41
// 成员管理(1.1.0)
const Administration = () => import(/* webpackChunkName: "administration" */ '@/components/Administration/administration.vue');
const GetAdministration = () => import(/* webpackChunkName: "administration" */ '@/components/Administration/getAdministration.vue');  // 选择成员列表
const Addmember = () => import( /* webpackChunkName: "administration" */ '@/components/Administration/addmember.vue');     // 添加成员
const Editmember = () => import(/* webpackChunkName: "administration" */ '@/components/Administration/editmember.vue');   // 编辑成员信息


// 从微信公众号信息进行跳转进来的页面
const Consultdoctor = () => import('@/components/wxView/consultdoctor' /* webpackChunkName: "amr" */);  // 咨询页 医生详情的工作室
const Activity = () => import('@/components/wxView/activity');                                   // 图片活动展示
// import Docrecommend from '@/components/wxView/docrecommend';                                      // 推荐预约医生(1.1.0)
// import DocSuspend from '@/components/wxView/docSuspend';                                          // 医生停诊通知(1.1.0)
// import RecommendDrug from '@/components/wxView/recommendDrug';                                    // 推荐药品 （1.2.0）
// import YaoRecipeorder from '@/components/goods/yao-recipeorder';                                  // 推荐药品 药品下单页（1.2）
const Docrecommend = () =>import('@/components/wxView/docrecommend');                                      // 推荐预约医生(1.1.0)
const DocSuspend = () =>import('@/components/wxView/docSuspend');                                          // 医生停诊通知(1.1.0)
const RecommendDrug = () =>import('@/components/wxView/recommendDrug' /* webpackChunkName: "tj" */);       // 推荐药品 （1.2.0）
const YaoRecipeorder = () =>import('@/components/goods/yao-recipeorder' /* webpackChunkName: "tj" */);     // 推荐药品 药品下单页（1.2）
// 51

import Emrecordlist from '@/components/emrecord/emrecordlist.vue';   // 电子病历列表 (1.3)
import Emrecorddetail from '@/components/emrecord/emrecorddetail.vue'; // 电子病历详情 (1.3)
import Emrdetails from '@/components/emrecord/emrdetail2.vue'; // 电子病历详情 (1.3)
import AddrecordsUserinfo from '@/components/emrecord/addrecordsFile/addrecordsUserinfo.vue'; // 添加电子病历 (1.3)
import AddrecordsUserClinic from '@/components/emrecord/addrecordsFile/addrecordsUserClinic.vue'; // 添加电子病历2 (1.3)
// 56

// 1.4.0 版本
const CheckYingXiang = () => import('@/components/emrecord/checkyingxiang.vue');           // 电子病历入口影像查看
import UserPayMsgRecordList from '@/components/PayVisits/userPayMsgRecordList';                  // 付费问诊列表
import UserPayRecordDetail from '@/components/PayVisits/userPayRecordDetail.vue';                 // 付费问诊记录
import UserPayMsgRecordDetail from '@/components/PayVisits/userPayMsgRecordDetail.vue';           // 付费问诊详情页
// const UserPayInfo = () => import("../components/PayVisits/userPayInfo.vue");                      // 患者问诊信息(废弃)

import SearchImage from '@/components/electronicImage/searchImage.vue';                          // 影像查询结果
const SearchDocPicServer = () => import('@/components/electronicImage/searchDocPicServer.vue');  // 购买医生影像查看服务

const chatRoom = () => import('@/components/webIM/chatroom' /* webpackChunkName: "amr" */);    // 聊天室
import BuyWebImInfo from '@/components/webIM/buywebiminfo.vue';                                 // 购买问诊服务
const Docrecord = () => import('@/components/webIM/webHistoryMsg.vue' /* webpackChunkName: "amr" */); // 医生立即咨询记录

const UserPayHistoryInfo = () => import('@/components/PayVisits/userPayHistoryInfo.vue' /* webpackChunkName: "amr" */);  // 付费问诊历史记录
const BuyImage = () => import('@/components/electronicImage/buyImage.vue');          // 影像支付页
Vue.use(Router);

const router = new Router({
  mode: 'history',
  base: 'wechat',
  routes: [
    {
      path: '/chatroom:id?',  // 聊天室
      meta: { title: '聊天室' },
      name: 'chatroom',
      component: chatRoom
    },
    {
      path: '/personal:id?',
      meta: { title: '个人中心',keeepAlive: true },
      component: Personal
    },
    {
      path: '/userdata',
      meta: { 
        title: '个人信息',
        keeepAlive: true 
      },
      component: Userdata
    },
    {
      path: '/activity',
      title: '图片',
      meta: { 
        keeepAlive: true,
      },
      component: Activity
    },
    {
      path:'/agreement',
      meta: {
        keeepAlive: true,
        title: '用户协议'
      },
      component: Agreement
    },
    {
      path:'/err404',
      meta: {
        title: '错误',
      },
      component: Error404
    },
    {
      path:'/phone:id?',
      meta: {
        title: '绑定手机号',
      },
      component: Phones
    },
    {
      path: '/authentication:did?',
      meta: {
        title: '添加问诊人信息',
      },
      component: Authentication
    },
    {
      path: '/usermsg',
      meta: {
        title: '认证成功',
      },
      component: UserMsg
    },
    
    {
      path: '/mydoctor:uid?',
      meta: {
        title: '我的医生',
        keeepAlive: true
      },
      component: Mydoctor
    },
    {
      path: '/docrecord:id?',  // 聊天记录
      meta: {
        title: '咨询记录',
      },
      name: 'docrecord',
      component: Docrecord
    },



    {
      path: '/doctordetail:id?',
      title: '医生详情',
      name: 'doctordetail',
      component: DoctorDetail
    },
    {
      path: '/yuyuedoc:id?',          // 预约医生和支付
      meta: {title: '预约医生信息', },
      name: 'yuyuedoc',
      component: Yuyuedoc
    },
    {
      path: '/wxpaySucceed:rid?', 
      meta: { title: '支付成功' },   // 预约医生支付成功页
      name: 'wxpaySucceed',
      component: WxpaySucceed
    },
    {
      path: '/doctorshop/:id',
      title: '医生店铺',
      name: 'doctorshop',
      component: DoctorShop
    },
    {
      path: '/shopdetail:id?',
      meta: {
        title: '商品详情',
      },
      name: 'shopdetail',
      component: ShopDetail
    },
    {
      path: '/doctororder:id?',
      meta: {
        title: '商品下单',
      },
      name: 'doctororder',
      component: Doctororder
    },
    {
      path: '/authenticationYes',
      title: '问诊信息确认',
      component: AuthenticationYes
    },
    {
      path: '/healthdata',
      title: '健康数据',
      component: HealthData
    },
    {
      path: '/searchdoctor:id?',  // 医生筛选列表
      name: 'searchdoctor', 
      meta: { 
        title: '更多医生',
        keeepAlive: true,
        isRefresh: false,
        x:0, y:0
      },
      component: SearchSelectDoctor
    },
    {
      path: '/searchlist:id?',
      name: 'searchdoctor',
      meta: { 
        title: '更多医生',
        keeepAlive: true,
        x: 0, y: 0,
        isRefresh: false,
      },
      component: SearchDoctor   // 搜索医生列表
    },
    {
      path: '/doctorshoplist:id?',
      meta: { title: '更多医生店铺', keeepAlive: true, x:0, y:0},
      component: DoctorShopList
    },
    {
      path: '/consultdoctor:id?',
      title: '咨询医生详情',
      name: 'consultdoctor',
      component: Consultdoctor
    },
    
    {   // 以下为订单
      path: '/dingdan',
      meta: { title: '商品订单', keeepAlive: true },
      component: Dingdan
    },
    {
      path: '/addorderdetail/:id',  // 待付款详情
      meta: {
        title: '订单详情',
      },
      name: 'addorderdetail',
      component: AddorderDetail
    },
    {
      path: '/takeorderdetail/:id', // 再次购买页
      meta: {
        title: '下单详情',
      },
      name: 'orderbuyagain',
      component: TakeorderDetail
    },
    {
      path: '/successOrder:id?',  // 取消和已完成 和  待收货详情 和 待发货
      meta: {
        title: '订单详情',
      },
      name: 'successOrder',
      component: SuccessOrder
    },
    {
      path: '/orderdetails:id?',  // 药店购买的药品详情
      meta: {
        title: '查看订单',
      },
      name: 'orderdetails',
      component: Orderdetails
    },
    
      //  收货地址管理
    {
      path: '/oerdersites:id?',     // id 下单选择地址
      name: 'oerdersites',
      meta: { title: '收货地址列表', keeepAlive: true },
      component: OerderSite
    },
    {
      path: '/setorder:id?',    // 订单号选择地址
      meta: {
        title: '收货地址列表',
      },
      name: 'setorder',
      component: SetOrder
    },
    {
      path: '/sitelist',
      meta: { title: '收货地址管理', keeepAlive: true},
      component: SiteList
    },
    {
      path: '/addsite/:id?',
      meta: {title: '新增收货地址'},
      component: AddSite
    },
    {
      path: '/editsite:id?',
      meta: {title: '编辑收货地址'},
      component: EditSite
    },
                                      // 处方订单
    {
      path: '/recipelist',
      name: 'recipelist',
      meta: {title: '处方订单列表',keeepAlive: true, x:0, y:0, isUseCache: false},
      component: RecipeList
    },
    {
      path: '/recipeMsg/:id',
      meta: {title: '处方信息'},
      name: 'recipeMsg',
      component: RecipeMsg
    },
    {
      path: '/recipedrug:id?',
      meta: {title: '处方信息'},
      name: 'recipedrug',
      component: Recipedrug
    },
    {
      path: '/chufdetails:id?',
      meta: {title: '处方详情'},
      name: 'chufdetails',
      component: ImgDetails
    },
    {
      path: '/recipeAudit:id?',
      meta: {title: '电子处方'},
      name: 'recipeAudit',
      component: RecipeAudit 
    },
    {
      path: '/recipeorder:id?',
      meta: {title: '确认订单', keeepAlive: true},
      name: 'recipeorder',
      component: Recipeorder
    },
    {
      path: '/drugpaysuccess:id?', // 支付成功页
      meta: {title: '查看订单'},
      name: 'drugpaysuccess',
      component: Drugpaysuccess
    },
    {
      path: '/drugdetail:id?',           // 处方药品 的药品详情
      meta: {title: '药品详情', },  
      name: 'drugdetail',
      component: Drugdetail
    },

    // 预约门诊记录
    {
      path: '/subscribe',          // 列表
      meta: {title: '预约记录', keeepAlive: true,  x:0, y:0 },
      name: 'subscribe',
      component: Subscribe
    },
    {
      path: '/cancelSubscribe:rid?',   // 取消预约
      meta: {title: '取消预约'},
      name: 'cancelSubscribe',
      component: CancelSubscribe
    },
    {
      path: '/subscribeDetail:rid?', // 预约详情
      meta: {title: '预约信息'},
      name: 'subscribeDetail',
      component: SubscribeDetail
    },
    {
      path: '/payDetails:rid?', // 预约详情
      meta: {title: '预约信息'},
      name: 'payDetails',
      component: PayDetails
    },
    


    // 就诊成员管理
    {
      path: '/administration',
      meta: {title: '就诊成员管理', keeepAlive: true},
      name: 'administration',
      component: Administration
    },
    {
      path: '/getAdministration',
      meta: {title: '就诊成员列表', keeepAlive: true},
      name: 'getAdministration',
      component: GetAdministration
    },
    {
      path: '/administration/addmember',
      meta: {title: '添加新成员'},
      name: 'addmember',
      component: Addmember
    },
    {
      path: '/administration/editmember',
      meta: {title: '修改成员信息'},
      name: 'editmember',
      component: Editmember
    },



    {
      path: '/docrecommend:id?',          //  医生推荐的预约
      meta: {title: '预约医生', },  
      name: 'docrecommend',
      component: Docrecommend
    },
    {
      path: '/docSuspend:id?',           //  医生停诊通知
      meta: {title: '停诊通知', },  
      name: 'docSuspend',
      component: DocSuspend
    },
    {
      path: '/recommendDrug:id?',           // 推荐药品
      meta: {title: '推荐药品', },  
      name: 'recommendDrug',
      component: RecommendDrug
    },
    {
      path: '/yaorecipeorder:id?',         // 药品推荐 下单页
      meta: {title: '确认订单'},
      name: 'yaorecipeorder',
      component: YaoRecipeorder
    },



    // 电子病历列表
    {
      path: '/emrecordlist',         // 电子病历列表
      meta: {title: '电子病历', keeepAlive: true},
      name: 'emrecordlist',
      component: Emrecordlist
    },
    {
      path: '/emrecorddetail:id?',         // 电子病历详情
      meta: {title: '病历详情'},
      name: 'emrecorddetail',
      component: Emrecorddetail
    },
    {
      path: '/emrdetails:id?',         // 电子病历详情
      meta: {title: '病历详情'},
      name: 'emrdetails',
      component: Emrdetails
    },
    {
      path: '/addrecordsUserinfo:id?',         // 添加电子病历
      meta: {title: '添加病历'},
      name: 'addrecordsUserinfo',
      component: AddrecordsUserinfo
    },
    {
      path: '/addrecordsUserClinic:id?',         // 添加电子病历
      meta: {title: '添加病历'},
      name: 'addrecordsUserClinic',
      component: AddrecordsUserClinic
    },
    {
      path: '/checkyingxiang:id?',         // 从病例查看影像
      meta: {title: '查询结果'},
      name: 'checkyingxiang',
      component: CheckYingXiang
    },


    // 付费问诊
    {
      path: '/userPayMsgRecordList',        
      meta: {title: '付费问诊列表', keeepAlive: true},
      name: 'userPayMsgRecordList',
      component: UserPayMsgRecordList
    },
    {
      path: '/userPayRecordDetail:id?',
      meta: { title: '问诊记录' },
      name: 'userPayRecordDetail',
      component: UserPayRecordDetail
    },
    {
      path: '/userPayMsgRecordDetail:id?',        
      meta: {title: '患者问诊详情'},
      name: 'userPayMsgRecordDetail',
      component: UserPayMsgRecordDetail
    },
    
    {
      path: '/searchImage:uid?',      // 影像  
      meta: {title: '查询结果'},
      name: 'searchImage',
      component: SearchImage
    },
    {
      path: '/searchDocPicServer:id?',      // 购买医生查看影像  
      meta: {title: '搜索医生', keeepAlive: true, x:0, y:0},
      name: 'searchDocPicServer',
      component: SearchDocPicServer
    },
    {
      path: '/buyWebImInfo:id?',        // 购买问诊服务
      meta: {title: '购买问诊服务'},
      name: 'buyWebImInfo',
      component: BuyWebImInfo
    },
    {
      path: '/userPayHistoryInfo:id?',        // 付费问诊历史记录
      meta: {title: '付费问诊记录'},
      name: 'userPayHistoryInfo',
      component: UserPayHistoryInfo
    },
    {
      path: '/buyImage:id?',
      meta: {title: '电子影像'},
      name: 'buyImage',
      component: BuyImage
    },
    {
      path: '/page1:id?', // test 一下
      beforeEnter(to, from, next) {
        window.location.href = 'uservip.html#/test?uid='+to.query.uid
      }
      
    }
    
  ],
  // scrollBehavior (to, from, savedPosition) {
  //   console.log(to, from, savedPosition)
  //   if (savedPosition) {
  //     console.log('go')
  //     return savedPosition
  //   } else {
  //     if (from.meta.keepAlive) {
  //       console.log(document.body.scrollTop)
  //       from.meta.savedPosition = document.body.scrollTop
  //     }
  //     return { x: 0, y: to.meta.savedPosition || 0 }
  //   }
  // }
})


router.onError((error) => {
  console.log(error)
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
  next()
  
})

export default router