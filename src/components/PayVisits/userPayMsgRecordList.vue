<template>
    <!-- 付费问诊列表 -->
    <div class="userPayMsgRecordList dis_f flex_c">
        <van-tabs :class='{"vant-tab-box":true}' v-model="NavActive" :title-active-color='NavActiveColor' :swipe-threshold=5 >
            <van-tab title="全部"></van-tab>
            <van-tab title="待付款"></van-tab>
            <van-tab title="进行中"></van-tab>
            <van-tab title="已结束"></van-tab>
            <van-tab title="已退诊"></van-tab>
        </van-tabs>
        <div class="userPayMsgRecordList-content flex1">
            <div class="userPayMsgRecordList-content-box">
                <div class="empty" v-if='!payRecordList.length'>
                    <img src="../../common/img/pic_zwxgyyjl.png" alt="">
                    <p>暂无相关问诊记录</p>
                </div>
            <van-list v-model="loading" :finished="finished" :finished-text="msg" @load="onLoad" >
                <div class="cyclic-wrap" v-for="(val, i) in payRecordList" :key='i'>
                <!-- 待付款 -->
                <div class="payRecordWrap bg-f" v-if='val.status == 1'>
                    <div class="stayPayment dis_f">
                        <div class='docpic'><img v-lazy='val.picture?$http.baseURL+val.picture:""' alt="" /></div>
                        <dl class="flex1">
                            <dt>
                                <span>{{ val.true_name }} <img v-show='val.busitype == 9' src="../../common/img/bq_ypfw.png" alt="" /></span>
                                <b class="F-r">待付款</b>
                            </dt>
                            <dd class="flex1">
                                <span>{{ val.name }}丨{{ val.department_name }}</span>
                            </dd>
                        </dl>
                    </div>
                    <div class="ckBtn">
                        <span>问诊人：<b v-text='val.real_name'>李可乐</b></span>
                        <van-button class="F-r bg-f" @click='handleClickBuy(val.order_code)' plain type="primary">去付款</van-button>
                    </div>
                </div>
                <!-- 订单已取消 -->
                <div class="payRecordWrap bg-f" v-if='val.status == 6' @click='handleClickBuy(val.order_code)' >
                    <div class="stayPayment dis_f">
                        <div class='docpic'><img v-lazy='val.picture?$http.baseURL+val.picture:""' alt="" /></div>
                        <dl class="flex1">
                            <dt>
                                <span>{{val.true_name}} <img v-show='val.busitype == 9' src="../../common/img/bq_ypfw.png" alt="" /></span>
                                <b class="F-r" v-text='val.status == 6? "订单超时未付款已取消":""'>等待医生接诊</b>
                            </dt>
                            <dd class="flex1">
                                <span>{{ val.name }}丨{{ val.department_name }}</span>
                            </dd>
                        </dl>
                    </div>
                    <div class="ckBtn">
                        <ul>
                            <li>
                                <span>问诊人：</span>
                                <span v-text='val.real_name'>李雪碧（兄弟姐妹）</span>
                            </li>
                        </ul>
                    </div>
                </div>
                <!-- 等待医生接诊 和 已退诊 -->
                <div class="payRecordWrap bg-f" v-if='val.status == 2 || val.status == 7' @click='handleClickBuy(val.order_code)' >
                    <div class="stayPayment dis_f">
                        <div class='docpic'><img v-lazy='val.picture?$http.baseURL+val.picture:""' alt="" /></div>
                        <dl class="flex1">
                            <dt>
                                <span>{{val.true_name}} <img v-show='val.busitype == 9' src="../../common/img/bq_ypfw.png" alt="" /></span>
                                <b class="F-r" v-text='val.status == 2? "等待医生接诊": val.status == 7?"已退诊":""'>等待医生接诊</b>
                            </dt>
                            <dd class="flex1">
                                <span>{{ val.name }}丨{{ val.department_name }}</span>
                            </dd>
                        </dl>
                    </div>
                    <div class="ckBtn">
                        <ul>
                            <li>
                                <span>问诊人：</span>
                                <span v-text='val.real_name'>李雪碧（兄弟姐妹）</span>
                            </li>
                            <li v-if='val.status == 7'>
                                <span>问诊时间：</span>
                                <span>{{ val.inquiry_time | filterTime }}</span>
                            </li>
                        </ul>
                    </div>
                </div>
                <!-- 问诊中 和 问诊已结束 --> 
                <div class="payRecordWrap bg-f" v-if='val.status == 4|| val.status == 5' @click='handleClickBuy(val.order_code)' >
                    <div class="stayPayment dis_f">
                        <div class='docpic'><img v-lazy='val.picture?$http.baseURL+val.picture:""' alt="" /></div>
                        <dl class="flex1">
                            <dt>
                                <span>{{ val.true_name }} <img v-show='val.busitype == 9' src="../../common/img/bq_ypfw.png" alt="" /></span>
                                <b class="F-r" v-text='val.status == 4? "问诊中": val.status == 5?"问诊已结束":""'>问诊中</b>
                            </dt>
                            <dd class="flex1">
                                <span>{{ val.name }}丨{{ val.department_name }}</span>
                            </dd>
                        </dl>
                    </div>
                    <div class="ckBtn">
                        <ul>
                            <li>
                                <span>问诊人：</span>
                                <span v-text='val.real_name'>李雪碧（兄弟姐妹）</span>
                            </li>
                            <li>
                                <span>问诊时间：</span>
                                <span >{{ val.inquiry_time | filterTime }}</span>
                            </li>
                            <li v-show='val.status == 5'>
                                <span>问诊时长：</span>
                                <span v-text='val.time_long'>40min</span>
                            </li>
                        </ul>
                    </div>
                </div>
                </div>
            </van-list>

            
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data () {
        return {
            NavActive: 0,
            NavActiveColor: '#4A9CF3',
            payRecordList: [],              // 数据
            uid: this.$cookie.get('userLogins'),
            page: 1,
            limit: 10,
            loading: false,
            finished: true,
            msg: '',
        }
    },
    activated () {
        this.initdata();
    },
    watch: {
        NavActive (v, nv) {
            if(v !== nv) {
                v = nv;
                if(this.page !== 1) {
                    this.page = 1
                }
                this.initdata()
            }
        },
    },
    methods: {
        onLoad() { 
            this.page++;
            this.loading = true;
            this.initdata();
        },
        initdata () {
            var self = this;
            var obj = { status: this.NavActive==0?'':this.NavActive, userid: this.uid, page: this.page, limit: this.limit };
            console.log(obj)
            this.$http.post('/mobile/WxSeeImage/pay_visits_list', obj).then(res => {
                console.log(res)
                self.loading = false;
                if (res.code == 1) {
                    if (self.page == 10) {
                        self.finished = true;
                        self.msg = '没有更多了'
                        return;
                    }
                    if (self.page == 1) {
                        self.payRecordList = res.data
                        if (self.payRecordList.length > 9) {
                            self.finished = false;
                        }
                    } else {
                        res.data.map(val => {
                            self.payRecordList.push(val)
                        })
                    }
                } else {
                    self.payRecordList = []
                    self.finished = true;
                    if (self.payRecordList.length > 9) {
                       self.msg = '没有更多了'
                    } else {
                        self.msg = ''
                    }
                }
            }).catch(err => { self.$indicator.close(); })
        },
        handleClickBuy (id) { // 付款
            this.out('/userPayMsgRecordDetail?id='+id)
        }
    },
}
</script>

<style lang="scss" scoped>
@function rem($px) {
    @return $px / 100+rem;
}
.userPayMsgRecordList {
    width: 100%;
    height: 100%;
    font-size: rem(28);
    background-color: #f4f4f4;
   &-content {
       width: 100%;
       overflow-y: scroll;
       &-box {
           width: 100%;
           padding: 0 rem(30);
           .empty {
               width: 100%;
               text-align: center;
               margin-top: rem(200);
               img {
                   width: rem(250);
                   margin-bottom: rem(30);
               }
           }
           .cyclic-wrap {
               margin-bottom: rem(20);
           }
           .payRecordWrap {
                width: 100%;
                padding: rem(30) rem(30) 0;
                margin-top: rem(20);
                -webkit-border-radius:rem(8);
                border-radius:rem(8);
               .stayPayment {
                   width: 100%;
                   border-bottom: 1px solid #EEE;
                   padding-bottom: rem(30);
                   .docpic {
                        width: rem(88);
                        height: rem(88);
                        -webkit-border-radius: 100%;
                        border-radius: 100%;
                        position: relative;
                        > img[lazy=loaded] {
                            width: 100%;
                            height: 100%;
                            -webkit-border-radius: 100%;
                            border-radius: 100%;
                        }
                        > img[lazy=loading] {
                                position: absolute;
                                left: 0;
                                right: 0;
                                bottom: 0;
                                top: 0;
                                width: 0.4rem;
                                margin: auto;
                                background: url("../../common/images/lazy.gif") no-repeat;
                                background-size: cover;
                            }
                            
                   }
                    
                    dl {
                        margin-left: rem(19);
                        dt {
                            span {
                                color: #333;
                                font-size: rem(32);
                                img {
                                    width: rem(94);
                                }
                            }
                            b {
                                color: #4A9CF3;
                                font-size: rem(24);
                            }
                        }
                        dd {
                            font-size: rem(22);
                            color: #808080;
                            margin-top: rem(19);
                        }
                    }
               }
               .ckBtn {
                   padding: rem(16) 0;
                   width: 100%;
                   overflow: hidden;
                   > span {
                       font-size: rem(24);
                       display: inline-block;
                       line-height: rem(60);
                       color: #808080;
                       b {
                           color: #333;
                           margin-left: rem(30);
                       }
                   }
                   button {
                        padding: 0 rem(34);
                        border: #4A9CF3 1px solid;
                        font-size: rem(24);
                        height: rem(60);
                        line-height: rem(60);
                        -webkit-border-radius:rem(10);
                        border-radius:rem(10);
                        > span {
                            color: #4A9CF3;
                        }
                   }
                   ul {
                       width: 100%;
                       li {
                           font-size: rem(24);
                           span {
                               display: inline-block;
                               line-height: rem(50);
                           }
                           span:first-child {
                               color: #808080;
                               width: rem(140);
                           }
                           span:last-child {
                               color: #333;
                               width: 75%;
                           }
                       }
                   }
               }
           }
       }
   }
}
</style>