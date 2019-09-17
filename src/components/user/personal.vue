<template>
    <div class="personal">
        <div class="section">
            <div class="portrait" @click='getUser'>
                <div class="dis_f flex_i"><img ref='userImg' src="../../common/img/pic_txxq.png" alt="">
                    <p><span>{{ userInfor.real_name }}</span><img v-show="userInfor.real_state == 1" src="../../common/img/bq_yrz.png" alt="" /></p>
                </div>
                <span ><img src="../../common/img/icon_enter.png" alt=""></span>
            </div>
            <div class="user-msg">  
                <ul class="dis_f flex_i dis_sb">
                    <li @click='getDoutor'>
                        <h2>{{ userInfor.doc_num }}</h2>
                        <span>我的医生</span>
                    </li>
                    <li><b></b></li>
                     <li @click='getAdministration'>
                        <h2>{{ userInfor.patient_num }}</h2>
                        <span>家庭成员</span>
                    </li>
                    <li>
                        <b></b>
                    </li>
                     <li @click='getdzbl'>
                        <h2>{{ userInfor.emr_num }}</h2>
                        <span>电子病历</span>
                    </li>
                </ul>
            </div>
            <div class="user-server">
                <h2>进行中服务</h2>
                <div class="user-empty" v-if='isSwiper'>
                    <img src="../../common/img/pic_wjxzfw.png" alt="" />
                    <p>无进行中服务</p>
                </div>
                <div class="user-shop-infos" v-if="swiperArr.length">
                    <div class="swiper-container">
                        <ul class="swiper-wrapper">
                            <!-- 阅片 -->
                            <li class="swiper-slide" style="float:left;" v-for='(val, i) in swiperArr' :key='i+"_5"' v-if='val.type == 10' @click='ClickInquiry(val)' >
                                <h2>
                                    <img src="../../common/img/bq_ypfw@2x.png" alt="" />
                                    <span class="F-r">{{ val.status }}</span>
                                </h2>
                                <div class="dis_f flex_i">
                                    <img :src="val.pic?$http.baseURL+val.pic:''" alt="" />
                                    <p>
                                        <span>{{ val.title }}</span><span>{{ val.con1 }} | {{ val.con2 }}</span>
                                    </p>
                                </div>
                            </li>
                            <!-- 图文 问诊 -->
                            <li class="swiper-slide" style="float:left;" v-for='(val, i) in swiperArr' :key='i+"_4"' v-if='val.type == 3' @click='ClickInquiry(val)' >
                                <h2>
                                    <img src="../../common/img/bq_wzfw@2x.png" alt="" />
                                    <span class="F-r">{{ val.status }}</span>
                                </h2>
                                <div class="dis_f flex_i">
                                    <img :src="val.pic?$http.baseURL+val.pic:''" alt="" />
                                    <p>
                                        <span>{{ val.title }}</span><span>{{ val.con1 }} | {{ val.con2 }}</span>
                                    </p>
                                </div>
                            </li>
                            <!-- 处方 -->
                            <li class="swiper-slide" style="float:left;" v-for='(val, i) in swiperArr' :key='i+"_3"' v-if='val.type == 4' @click='ClickRecipe(val)' >
                                <h2>
                                    <img src="../../common/img/bq_cffw.png" alt="" />
                                    <span class="F-r">{{ val.status }}</span>
                                </h2>
                                <div class="dis_f flex_i">
                                    <img :src="val.pic?$http.baseURL+val.pic:''" alt="" />
                                    <p>
                                        <span>{{ val.title }}</span><span>{{ val.con1 }} | {{ val.con2 }}</span>
                                    </p>
                                </div>
                            </li>
                            <!-- 门诊 -->
                            <li class="swiper-slide" style="float:left;" v-for='(val, i) in swiperArr' :key='i+"_2"' v-if='val.type == 2' @click='ClickOutpatient(val)' >
                                <h2>
                                    <img src="../../common/img/bq_mzfw.png" alt="" />
                                    <span class="F-r">{{ val.status }}</span>
                                </h2>
                                <div class="dis_f flex_i">
                                    <img :src="val.pic?$http.baseURL+val.pic:''" alt="" />
                                    <p>
                                        <span>{{ val.title }}</span><span>{{ val.con1 }} | {{ val.con2 }}</span>
                                    </p>
                                </div>
                            </li>
                            <!-- 商品 医生店铺 -->
                            <li class="swiper-slide" v-for='(val, i) in swiperArr' :key='i' style="float:left;" @click='handleClickDetail(val)' v-if='val.type == 6 ||val.type == 9'>
                                <h2>
                                    <img src="../../common/img/bq_spdd.png" alt="" />
                                    <span class="F-r">{{ val.status }}</span>
                                </h2>
                                <div class="dis_f flex_i">
                                    <img :src="val.pic?$http.baseURL+val.pic:''" alt="" />
                                    <p>
                                        <span>{{ val.title }}医生的店铺</span><span>{{ val.con1 }} | {{ val.con2 }}</span>
                                    </p>
                                </div>
                            </li>
                            <!-- 药店 商品 -->
                            <li class="swiper-slide" v-for='(val, i) in swiperArr' :key='i' style="float:left;" @click='handleClickDetail(val)' v-if=' val.type == 7||val.type == 8'>
                                <h2>
                                    <img src="../../common/img/bq_spdd.png" alt="" />
                                    <span class="F-r">{{ val.status }}</span>
                                </h2>
                                <div class="dis_f flex_i">
                                    <img :src="val.pic?$http.baseURL+val.pic:''" alt="" />
                                    <p>
                                        <span>{{ val.title }}</span><span>{{ val.con1 }}</span>
                                    </p>
                                </div>
                            </li>
                        </ul>
                        <div class="swiper-pagination"></div>
                    </div>
                </div>
            </div>
            <div class="user-server-info">
                <h2>服务记录</h2>
                <ul class="dis_f flex_i dis_sb">
                    <li @click='getRecipe'>
                        <img src="../../common/img/icon_cfjl@2x.png" alt="" />
                        <span>处方记录</span>
                    </li>
                    <li @click='getPayMsgRecord'>
                        <img src="../../common/img/icon_ffwzjl@2x.png" alt="" />
                        <span>付费问诊记录</span>
                    </li>
                    <li @click='getOrder'>
                        <img src="../../common/img/icon_spdd@2x.png" alt="" />
                        <span>商品订单</span>
                    </li>
                    <li @click='getSubscribe'>
                        <img src="../../common/img/icon_yymzjl@2x.png" alt="" />
                        <span>预约门诊记录</span>
                    </li>
                </ul>
            </div>
            <ul class="ul">
                <li @click='goSite'><img src="../../common/img/icon_shdz.png" alt=""> <span>收货地址管理</span> <img class="Right" src="../../common/img/icon_enter.png" alt="" /></li>
                <li @click='handleTest'><img src="../../common/img/icon_shdz.png" alt=""> <span>test page</span> <img class="Right" src="../../common/img/icon_enter.png" alt="" /></li>
            </ul> 
        </div>
    </div>
</template>

<script>
export default {
    data () {
        return {
           userInfor: {
               doc_num: 0,
               patient_num: 0,
               emr_num: 0
           },
           swiperArr: [],       // 服务轮播
           isSwiper: false,     // 服务无数据提示
           swiperss: '',
           activeIndex: 0,
        }
    },
    created () {    
        // http://test99.yunyikang.cn/wechat/searchdoctor?uid=295&auth=3  微信传参的url
        // $auth = 0;  //0 未注册
        // $auth = 1;  //1 已认证
        // $auth = 2; //2 未认证,已绑定手机号
        // $auth = 3;  //3 未认证,未绑定手机号
        var urldata = this.$route.query
        if (urldata.uid) {
            this.$cookie.set('userLogins', urldata.uid, 365)
            this.initdata (urldata.uid)
        } 
    },
    activated () {
        if (this.$isIos()) {
            var homeUrl = window.location.href;
            this.$storage.set('chatRoom', homeUrl)
        }
        this.myData();
        this.initSwiper();
    },
    methods: {
        handleTest () {
            this.$router.push('/page1?uid='+this.$route.query.uid)
            // window.location.href= 'uservip.html#/test?uid='+this.$route.query.uid;
        },
        initSwiper () { // 服务
            var self = this;
            this.$http.post('/mobile/Wxauth/ongoing_service', { uid: this.$route.query.uid }).then(res => {
                // console.log(res) 
                if (res.code == 1) {
                    self.swiperArr = res.data;
                    if (self.swiperArr.length <= 0) {
                        self.isSwiper = true
                    } else {
                        self.isSwiper = false;
                        self.$nextTick(() => {
                            self.swiperPic()
                        })
                    }
                } else {
                    self.isSwiper = true
                    self.swiperArr = []
                }
            })
        },
        swiperPic () { // 轮播
            var self = this;
            var swipers = new Swiper ('.swiper-container', {
                loop: false,
                pagination: {
                    el: '.swiper-pagination'
                },
                initialSlide : self.activeIndex, 
                observer: true,
                observeParents:true,
                on: {
                    slideChangeTransitionEnd: function(){
                        self.activeIndex = this.realIndex;
                        var dom = document.getElementsByClassName('swiper-pagination-bullets')[0];
                        var domList = dom.children;
                        for (var i=0; i<domList.length; i++) {
                            if (i == this.realIndex) {
                                domList[i].className = 'swiper-pagination-bullet swiper-pagination-bullet-active'
                            } else {
                                domList[i].className = 'swiper-pagination-bullet'
                            }
                        }
                    },
                },
            })
        },
        myData () {
            var self = this;
            var uid = this.$cookie.get('userLogins')
            this.$http.post('/mobile/Wxauth/center_info', { uid: uid}).then(res => {
                // console.log(res)
                if (res.code == 1) {
                    var objlist = res.data;
                    self.userInfor = Object.freeze(objlist);
                    if (self.userInfor.pic) {
                        var pic = self.$http.baseURL + self.userInfor.pic
                        self.$refs.userImg.src = pic;
                    }
                } else {
                    self.userInfor = {
                        doc_num: 0,
                        patient_num: 0,
                        emr_num: 0
                    }
                }
            })
        },
        initdata (id) {         //  检测是否认证
            var self = this;
            self.$http.post('/mobile/wxauth/is_auth', { uid: id}).then(res => {
                // console.log(res)
                if (res.code == 1) {
                    if (res.auth == 3) {
                        self.$router.replace('/phone?uid='+id)
                        return;
                    } 
                    if (res.auth == 2 ) {
                        self.$route.query.did?self.$router.replace('/authentication?did='+self.$route.query.did): self.$router.replace('/authentication');
                    }
                }
            })
        },
        getSubscribe () { // 预约记录
            this.out('/subscribe')
        },
        getAdministration () { // 成员管理
            this.out('administration')
        },
        goSite() {  // 地址
            this.out('/SiteList')
        },
        getUser () {    // 个人信息
            this.out('/userdata')
        },
        getDoutor () {  // 我的医生
            this.out('/mydoctor')
        },
        getOrder () {   // 商品订单
            this.out('/dingdan')
        },
        getRecipe () {  // 处方订单
            this.out('/recipelist')
        },
        getdzbl () { // 电子病历
            this.out('/emrecordlist')
        },
        ClickInquiry(v) { // 图文 问诊
            console.log(v)
            // this.$messagebox.confirm('<p style="color: #333;">返回公众号首页，即可继续向医生咨询问题</p>', {showCancelButton: false, confirmButtonText: '确定'}).then(action => {
            //    WeixinJSBridge.call('closeWindow'); 
            // });
            if (v.did) {
                this.$router.push({ path: '/chatroom', query: { did: v.did, uid:this.$route.query.uid } })
            } else {
                this.$toast({
                    message: '医生不存在，无法进行服务',
                    position: 'middle',
                    duration: 2000
                });
            }
        },
        ClickRecipe(v) { // 处方
            this.$router.push({path: '/recipeAudit', query: { id: v.id }})
        },
        ClickOutpatient(v) {  // 门诊
            this.$router.push({path: '/subscribeDetail', query: { rid: v.id }})
        },
        handleClickDetail (v) { // 医生店铺 和 药店
            console.log(v)
            if (v.type == 6 || v.type == 9) { // 医生店铺
                if (v.flag == 1) {
                    this.$router.push({name: 'addorderdetail', params: { id: v.id }})
                } else {
                    this.$router.push({path: '/successOrder', query: { id: v.id }})
                }
                return ;
            }
            if (v.type == 7 || v.type == 8) { // 药店
                this.$router.push({path: '/orderdetails', query: { id: v.id }})
            }
        },
        getPayMsgRecord () {    // 付费问诊列表
            this.out('/userPayMsgRecordList');
        },
    }
}
</script>

<style lang="scss" scoped>
@function rem($px) {
    @return $px / 50 + rem;
}
.personal {
    width: 100%;
    background: #F0F0F0;
    font-size: rem(14);
    height: 100vh;
    
    .section {
        font-size: rem(14);
        .portrait {
            height: rem(94);
            position: relative;
            background-color: #fff;
            > div {
                    width: 100%;
                    height: rem(94);
                    padding-left: rem(19);
                > img {
                    display: block;
                    width: rem(64);
                    height: rem(64);
                    border-radius: 100%;
                }
               > p{
                    margin-left: rem(15);
                   > span {
                        display: block;
                        font-size: rem(16);
                        font-weight:400;
                        color: #333;
                        font-weight: 600;
                    }
                    >img {
                        margin-top: rem(8);
                        width: rem(42);
                        height: rem(16);
                    }
               }
            }
            >span {
                position: absolute;
                right: rem(21);
                top: rem(39);
                img {
                    width: rem(26);
                }
            }
        }

        .user-msg {
            width: 100%;
            padding: rem(14) rem(36);
            background-color: #fff;
            > ul {
                li {
                    h2 {
                        text-align: center;
                        margin-bottom: rem(15);
                        color: #333;
                        font-size: rem(16);
                    }
                    span {
                        color: #808080;
                        font-size: rem(14);
                    }
                    >b {
                        display: block;
                        height: rem(20);
                        width: 1px;
                        background-color: #ddd;
                    }
                }
            }
        }

    .user-server {
        width: 100%;
        background-color: #fff;
        margin-top: rem(10);
        > h2 {
            height: rem(35);
            line-height: rem(35);
            border-bottom: 1px solid #EBEBEB;
            padding-left: rem(19);
            font-weight:600;
        }
        .user-empty {
            width: 100%;
            height: rem(130);
            text-align: center;
            padding-top: rem(28);
            img {
                width: rem(50);
                height: rem(50);
            }
            p {
                color: #808080;
                font-size: rem(12);
                margin-top: rem(10);
            }
        }

        .user-shop-infos {
            width: 100%;
            height: rem(130);
            .swiper-slide {
                >h2 {
                    padding: rem(15) rem(19) rem(10);
                    img {
                        width: rem(55);
                    }
                    span {
                        color: #4A9CF3;
                        font-size: rem(12);
                    }
                }
                >div {
                    padding: 0 rem(19) rem(30) ;

                    img {
                        width: rem(49);
                        height: rem(49);
                        -webkit-border-radius: 100%;
                        border-radius: 100%;
                    }
                    p {
                        margin-left: rem(10);
                        span {
                            display: block;
                            color: #333;
                        }
                        span:last-child {
                            margin-top: rem(9);
                            font-size: rem(12);
                            color: #808080;
                        }
                    }
                }
            }
        }
    }

    .user-server-info {
        background-color: #fff;
        margin-top: rem(10);
        > h2 {
            height: rem(35);
            line-height: rem(35);
            border-bottom: 1px solid #EBEBEB;
            padding-left: rem(19);
            font-weight:600;
        }
        >ul {
            padding: rem(20);
            li {
                text-align: center;
                img {
                    width: rem(40);
                    height: rem(40);
                }
                span {
                    display: block;
                    font-size: rem(12);
                    margin-top: rem(8.5);
                    color: #333;
                }
            }
        }
    }


        .ul {
            width: 100%;
            margin-top: rem(10);
            background-color: #fff;
            padding-left: rem(20);
            li {
                -webkit-display: flex;
                display: flex;
                -webkit-align-items:center;
                box-align:center;
                -moz-box-align:center;
                -webkit-box-align:center;
                align-items:center;
                line-height: rem(49);
                position: relative;
                border-bottom: 1px solid #E6E6E6;
                img {
                    font-size: rem(13);
                    width: rem(20);
                    height:rem(20);
                    vertical-align: middle;
                }
                span {
                    color: #333;
                    padding-left: rem(21);
                    font-size: rem(14);
                }
                .Right {
                    width: rem(26);
                    height: auto;
                    position: absolute;
                    right: rem(21);
                    top: 50%;
                    transform: translate(0, -50%);
                    -ms-transform: translate(0,-50%);
                    -moz-transform: translate(0,-50%);
                    -webkit-transform: translate(0,-50%);
                    -o-transform: translate(0,-50%);
                }
            }
            li:last-child {
                border:0;
            }
        }
    }
}
</style>

