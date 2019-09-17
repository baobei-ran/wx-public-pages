<template>
    <!-- 付费问诊详情页 -->
    <div class="userPayMagRecordDetail dis_f flex_c">
        <div class="userPayMagRecordDetail-box flex1"> 
            <div class="userPayMagRecordDetail-box-content" v-show='isView'>
                <div class="content-title-msg">
                    <!-- orange -->
                    <div class="content-head Color-orange bg-f" v-if='dataDetail.status == 1'>
                        <img src="../../common/img/icon_dzf@2x.png" alt="" />
                        <span>待支付</span>
                        <b>请在<i>{{ viewTime }}</i>内完成支付</b>
                        <!-- 阅片图片提示 -->
                        <img v-show='dataDetail.busitype==9' class="haead-msg" src="../../common/img/bq_ypfw2.png" alt="" />
                    </div>
                    <div class="content-head-wait Color-orange bg-f" v-if='dataDetail.status == 2'>
                        <img src="../../common/img/icon_dhf@2x.png" alt="" />
                        <div>
                            <span>等待医生回复</span>
                            <b>医生<i>{{ viewTime }}</i>内未回复，将自动为您退诊</b>
                        </div>
                        <!-- 阅片图片提示 -->
                        <img v-show='dataDetail.busitype==9' class="haead-msg" src="../../common/img/bq_ypfw2.png" alt="" />
                    </div>
                    <!-- blue -->
                    <div class="content-head-refund Color-blue bg-f" v-if='dataDetail.status == 6 || dataDetail.status == 7'>
                        <img src="../../common/img/icon_ytz@2x.png" alt="" />
                        <span v-show='dataDetail.status == 6'>医生已为您退诊</span>
                        <span v-show='dataDetail.status == 7'>医生超时未回复，已自动为您退诊</span>
                        <!-- 阅片图片提示 -->
                        <img v-show='dataDetail.busitype==9' class="haead-msg" src="../../common/img/bq_ypfw2.png" alt="" />
                    </div>
                    <div class="content-head-refund Color-blue bg-f" v-if='dataDetail.status == 4'>
                        <img src="../../common/img/icon_wzz@2x.png" alt="" />
                        <span>问诊中</span>
                        <b>问诊时长 <i>{{ viewTime }}</i></b>
                        <!-- 阅片图片提示 -->
                        <img v-show='dataDetail.busitype==9' class="haead-msg" src="../../common/img/bq_ypfw2.png" alt="" />
                    </div>
                    <div class="content-head-refund Color-blue bg-f" v-if='dataDetail.status == 5'>
                        <img src="../../common/img/icon_yjz@2x.png" alt="" />
                        <span>问诊已结束</span>
                        <!-- 阅片图片提示 -->
                        <img v-show='dataDetail.busitype==9' class="haead-msg" src="../../common/img/bq_ypfw2.png" alt="" />
                    </div>
                </div>
                <div class="content-user-info">
                    <ul class="bg-f">
                        <li><span>问诊单号</span><span v-text='dataDetail.order_code'>271968887772</span></li>
                        <li><span>问诊价格</span><span>¥{{ dataDetail.money }}/次</span></li>
                        <li><span>医生姓名</span><span v-text='dataDetail.true_name'>李潇潇</span></li>
                        <li v-show="dataDetail.hospital_name"><span>所在医院</span><span v-text='dataDetail.hospital_name'>山东省立医院</span></li>
                    </ul>
                    <!-- 问诊信息 -->
                    <ul class="bg-f" v-show='isPay'>
                        <li><span>问诊人</span><span v-text='dataDetail.p_name'>李妞妞（本人）</span></li>
                        <li v-show="dataDetail.time" class="content-special"><span>最近一次医院就诊时间</span><span>{{ dataDetail.time | filterTime }}</span></li>
                        <li v-show="dataDetail.hos"><span>就诊医院</span><span v-text='dataDetail.hos'>山东省立医院</span></li>
                        <li v-show="dataDetail.dep"><span>就诊科室</span><span v-text='dataDetail.dep'>皮肤科</span></li>
                        <li v-show="dataDetail.affirm"><span>确认疾病</span><span v-text='dataDetail.affirm'>流行性感冒</span></li>
                        <li><span>病情描述</span><span v-text='dataDetail.remark' >感冒发烧流鼻涕、嗓子疼喉咙痛</span></li>
                        <li v-if='dataDetail.pic'><b>病情照片</b>
                            <div>
                                <img v-for="(val,j) in dataDetail.pic" :key='j+"_pic"' :src="$http.baseURL+val" alt="" />
                            </div>
                        </li>
                    </ul>
                    
                    <!-- 阅片待付款 -->
                    <ul class="bg-f" v-show='isShow' >
                        <li><span>问诊人</span><span>{{ dataDetail.real_name }}</span></li>
                        <!-- <li><span>检查医院</span><span v-text='dataDetail.hos'>山东省立医院</span></li> -->
                    </ul>

                </div>
                
                
                
            </div>
        </div>
        <div class="userPayMagRecordDetail-footer" v-show='dataDetail.status == 1 || dataDetail.status == 2 || dataDetail.status == 4 || dataDetail.status == 5' >
            <van-button @click="handleClickBay" v-show='dataDetail.status == 1' type="info">立即支付</van-button>
            <van-button @click="handleClickChat" v-show='dataDetail.status == 2 || dataDetail.status == 4' type="info">继续问诊</van-button>
            <van-button @click="handleClickDetail" v-show='dataDetail.status == 5' type="info">查看问诊记录</van-button>
        </div>
    </div>
</template>
<script>
export default {
    data () {
        return {
            isView: false,
            isPay: false,       // 图文问诊
            isShow: false,      // 阅片服务
            dataDetail: {},
            orderTime: '',      // 倒计时器容器
            viewTime: '',       // 倒计时器时间
            timeBox: '',        // 问诊中正计时器容器
            uid: this.$cookie.get('userLogins'),
            num: 0,
        }
    },
    mounted () {
        this.initdata();
    },
    methods: {
        initdata () {
            var self = this;
            this.$indicator.open({
                text: '',
                spinnerType: 'fading-circle'
            });
            self.$http.post('/mobile/WxSeeImage/pay_visits_details', {order_code: this.$route.query.id}).then(res => {
                console.log(res)
                self.$indicator.close();
                if (res.code == 1) {
                    self.dataDetail = res.data;
                    self.isView = true;
                    if (self.dataDetail.pic) {
                        var arrPic = self.dataDetail.pic.split(',');
                        arrPic = arrPic.filter(val => {
                            return val !== ''
                        })
                        self.dataDetail.pic = arrPic;
                    }
                    if (self.dataDetail.status == 1) {          // 待付款倒计时
                        self.timerOrder(res.data.addtime)
                    } 
                    if (self.dataDetail.status == 2) {          // 待医生回复倒计时
                        self.timerOrder(res.data.pay_time)
                    }
                    if (self.dataDetail.status == 4) {
                        self.zhengTimer(res.data.inquiry_time)
                    }
                    if (self.dataDetail.busitype == 3) {        // 图文问诊
                        self.isPay = true;
                        self.isShow = false;
                    } else if (self.dataDetail.busitype == 9) { // 阅片服务
                        self.isShow = true;
                        self.isPay = false;
                    }
                } else {
                    self.$toast({
                        message: '订单不存在',
                        position: 'middle',
                        duration: 3000
                    });
                    self.dataDetail = {}
                }
            }).catch(err => {
                self.$indicator.close();
                self.$toast({
                    message: '服务器错误',
                    position: 'middle',
                    duration: 3000
                });
                 console.log(err)})
        },
        timerOrder: function(fw) {   // 待支付 30分钟倒计时
            if (!fw) {
                return;
            }
            
            var self = this;
            var now= new Date().getTime();  
            var end= new Date(fw*1000+30*60*1000); 
            var result=Math.floor(end-now)/1000;
            self.orderTime =setInterval(sub,1000); //定时器 调度对象
            function sub(){
                if (result>1) {
                    result = result - 1;
                    var second = Math.floor(result % 60);     
                    var minite = Math.floor((result / 60) % 60); 
                    second = second < 10 ? '0'+second : second;
                    minite = minite < 10 ? '0'+minite : minite;
                    self.viewTime = minite + ':' + second
                } else{
                    //这里可以添加倒计时结束后需要执行的事件
                    clearInterval(self.orderTime);  
                    if (self.num > 3) {
                        return
                    }
                    self.viewTime = '00:00'
                    self.num ++;
                    console.log(self.num)
                    self.initdata();
                }
            };
        },
        handleClickChat () {    // 继续问诊
            this.$router.push({path:'/chatroom', query: { did:this.dataDetail.did, uid: this.uid }})   
        },
        handleClickDetail () {  // 查看问诊记录
            this.$router.push({path:'/userPayHistoryInfo', query: { number: this.dataDetail.number, did:this.dataDetail.did  }})  
        },
        handleClickBay () { // 问诊和阅片发起支付
            var self = this;
            if (!self.$isMoble) {
                self.$toast({
                    message: '请在手机微信端下单支付',
                    position: 'middle',
                    duration: 3000
                });
                return;
            }
            var obj = { order_code: this.$route.query.id, type: self.dataDetail.busitype };
            console.log(obj)
            self.$http.post('/mobile/WxSeeImage/image_order_pay', obj).then(res => {
                if (res.code == 1) {
                    self.wxsjk(res.data)
                } else {
                    self.$toast({
                        message: res.msg,
                        position: 'middle',
                        duration: 3000
                    });
                }
            }).catch(err => {
                self.$toast({
                    message: '服务器发生错误，请重新支付',
                    position: 'middle',
                    duration: 3000
                });
            })
        },
        wxsjk (data) {  // 调起微信支付
            var self = this;
            if (typeof WeixinJSBridge == "undefined") {
                if( document.addEventListener ){
                    document.addEventListener('WeixinJSBridgeReady', onBridgeReady(data), false);
                }else if (document.attachEvent){
                    document.attachEvent('WeixinJSBridgeReady', onBridgeReady(data)); 
                    document.attachEvent('onWeixinJSBridgeReady', onBridgeReady(data));
                }
            }else{
                    onBridgeReady(data);
            }
            function onBridgeReady(data) {
                console.log(data)
                WeixinJSBridge.invoke (
                    'getBrandWCPayRequest', {
                        debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                        "appId": data.appId,                //公众号名称，由商户传入     
                        "timeStamp": data.timeStamp,        //时间戳，自1970年以来的秒数     
                        "nonceStr": data.nonceStr,          //随机串     
                        "package": data.package,     
                        "signType": data.signType,          //微信签名方式：     
                        "paySign": data.paySign             //微信签名 
                    },
                function(res){
                   WeixinJSBridge.log(res.err_msg);
                    if(res.err_msg == "get_brand_wcpay_request:ok"){
                        var t = setTimeout(function () {
                            self.isSuccess()
                            clearTimeout(t)
                        }, 1000)
                    } else {
                        self.$toast({
                            message: '支付失败！',
                            position: 'middle',
                            duration: 2000
                        });
                        var tt = setTimeout(function () {
                            self.$router.go(0);
                            clearTimeout(tt)
                        }, 1000)
                    }
                    
                }); 
            };
        },
        isSuccess () {  // 支付是否成功接口
            var self = this;
            self.$http.post('/mobile/wxchat/order_inquiry', { order_code: this.$route.query.id }).then(res => {
                if(res.code == 1) {
                    self.$toast({
                        message: '支付成功！',
                        position: 'middle',
                        iconClass: 'iconfont icon-tipssuccess',
                        duration: 2000
                    });
                    self.$router.push({path:'/chatroom', query: { did:this.dataDetail.did, uid: this.uid }}) 
                } else {
                    self.$toast({
                        message: '支付失败！',
                        position: 'middle',
                        duration: 2000
                    });
                }
            }).catch(err => {
                self.$toast({
                    message: '服务器错误',
                    position: 'middle',
                    duration: 2000
                });
            })
        },
        zhengTimer (time) { // 问诊中时间，倒计时
            if (!time) {
              return;
            }
            function ot (v) {
                if (v < 10) {
                    v = '0'+v
                }
                return v
            }
            this.timeBox = setInterval(() => {
                var date =  Math.floor((new Date(time*1000+1000*60*60*24) - new Date()) / 1000);
                if (date > 0) {
                    var s = Math.floor(date%60);
                    var m = Math.floor(date/60%60);
                    var h = Math.floor(date/60/60%24);
                    this.viewTime = ot(h)+':'+ot(m)+':'+ot(s)
                } else {
                    clearInterval(this.timeBox);
                    this.viewTime = '';
                    this.dataDetail.status = 5;
                }
            }, 1000)
        },
        
    },
    beforeDestroy () {
        if (this.timeBox) {
            window.clearInterval(this.timeBox);
        }
        if(this.orderTime) {
            window.clearInterval(this.orderTime)
        }
    }
}
</script>
<style lang="scss" scoped>
@function rem($px) {
    @return $px / 100+rem;
}

.userPayMagRecordDetail {
    width: 100%;
    height: 100%;
    font-size: rem(28);
    background-color: #f4f4f4;
    &-box {
        width: 100%;
        overflow-y: scroll;
        &-content {
            width: 100%;
            padding: 0 rem(30);
            .content-title-msg {

            
            .content-head {
                width: 100%;
                margin-top: rem(21);
                padding: rem(20) rem(23);
                
                img {
                    width: rem(60);
                    display: inline-block;
                    vertical-align: middle;
                    margin-top: -3px;
                }
                span {
                    font-size: rem(32);
                    font-weight:600;
                    margin-left: rem(14);
                    vertical-align: middle;
                }
                b {
                    font-size: rem(24);
                    margin-left: rem(30);
                    i {
                        display: inline-block;
                        width: rem(70);
                        text-align: center;
                    }
                }
            }
            .Color-orange {
                color: #FF9A83;
                -webkit-border-radius:rem(10);
                border-radius:rem(10);
                position: relative;
                .haead-msg {
                    width: rem(100);
                    position: absolute;
                    right: 0;
                    top: 50%;
                    -webkit-transform: translateY(-40%);
                    transform: translateY(-40%);
                }
            }
            .content-head-wait {
                width: 100%;
                margin-top: rem(21);
                padding: rem(20) rem(23);
                img {
                    width: rem(62);
                    vertical-align: top;
                }
                div {
                    margin-left: rem(13);
                    display: inline-block;
                    margin-top: rem(14);
                    width: 85%;
                    span {
                        font-size: rem(32);
                        font-weight:600;
                        vertical-align: middle;
                    }
                    b {
                        display: block;
                        font-size: rem(24);
                        margin-top: rem(19);
                    }
                }
            }
            .content-head-refund {
                width: 100%;
                padding: rem(20) rem(23);
                margin-top: rem(21);
                img {
                    width: rem(66);
                    vertical-align: middle;
                }
                span {
                    margin-left: rem(15);
                    font-size: rem(32);
                }
                b {
                    font-size: rem(24);
                    margin-left: rem(33);
                }
            }
            .Color-blue {
                color: #4A9CF3;
                -webkit-border-radius:rem(10);
                border-radius:rem(10);
                position: relative;
                .haead-msg {
                    width: rem(100);
                    position: absolute;
                    right: 0;
                    top: 50%;
                    -webkit-transform: translateY(-40%);
                    transform: translateY(-40%);
                }
            }
            }
            //////////////////
            .content-user-info {
                width: 100%;
            ul {
                width: 100%;
                margin-top: rem(20);
                padding: rem(15) rem(30);
                -webkit-border-radius:rem(10);
                border-radius:rem(10);
                li {
                    padding: rem(15) 0;
                    font-size: rem(28);
                    span {
                        display: inline-block;
                        line-height: rem(40);
                    }
                    span:first-child {
                        color: #808080;
                        width: rem(150);
                    }
                    span:last-child {
                        color: #333;
                        width: 73%;
                    }
                    b {
                        color: #808080;
                        display: inline-block;
                        width: rem(120);
                    }
                    div {
                        vertical-align: top;
                        display: inline-block;
                        width: 80%;
                        img {
                            width: rem(100);
                            height: rem(100);
                            margin-left: rem(23);
                            margin-bottom: rem(20);
                        }
                    }
                }
                .content-special {
                    span:first-child {
                        color: #808080;
                        width: 50%;
                    }
                    span:last-child {
                        color: #333;
                        width: 50%;
                    }
                }
            }
        }
        }
    }
    &-footer {
        width: 100%;
        height: rem(138);
        padding: rem(20) rem(30);
        button {
            width: 100%;
            height: 100%;
            font-size: rem(32);
            background-color: #4A9CF3;
        }
    }
}
</style>