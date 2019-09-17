<template>
    <!-- 待支付预约记录详情 -->
    <div class="subscribeDetail">
        <div class="section">
            <div class="section_box">
                <div class="section_head2" v-if='!yudetail'>
                    <h3><img src="../../common/img/icon_yqx.png" alt="">已取消</h3>
                </div>
                <div class="section_head3" v-if='yudetail.registration_status == 1'>
                    <h3><img src="../../common/img/icon_dzf.png" alt=""><span>待支付 {{ time }}</span></h3>
                    <div class="cancelBtn2"><mt-button @click.native="payClick">去支付</mt-button><mt-button @click.native="pay_cancel">取消预约</mt-button></div>
                </div>
                <div class="section_con" v-if='yudetail.registration_status == 1'>
                    <ul>
                        <li>
                            <span>就诊人员</span>
                            <span>{{ yudetail.real_name }}</span>
                        </li>
                        <li>
                            <span>医生信息</span>
                            <span>{{ yudetail.true_name }}</span>
                        </li>
                        <li>
                            <span>就诊地址</span>
                            <span>{{ yudetail.hospital_name }}</span>
                        </li>
                        <li>
                            <span>就诊科室</span>
                            <span>{{ yudetail.department_name }}</span>
                        </li>
                        <li>
                            <span>预约时间</span>
                            <span>{{ yudetail.registration_time | Times }} {{ times }}</span>
                        </li>
                        <li>
                            <span>挂号类型</span>
                            <span v-text='yudetail.type == 1 ? "普通门诊": yudetail.type == 2? "专家门诊": ""'></span>
                        </li>
                        <li>
                            <span>费用金额</span>
                            <span>{{ yudetail.registration_amount }}元</span>
                        </li>
                        <li>
                            <span>病情描述</span>
                            <span v-text='yudetail.disease?yudetail.disease:"暂无填写"'></span>
                        </li>
                        <li>
                            <span>预约单号</span>
                            <span>{{ yudetail.registration_number }}</span>
                        </li>
                        <!-- <li>
                            <span>付款时间</span>
                            <span>{{ yudetail.pay_time | filterTime }}</span>
                        </li> -->
                    </ul>
                </div>
                
               
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'payDetails',
    data () {
        return {
            yudetail: {},
            TimeInterval: ['上午 8:00-12:00', '下午 13:00-18:00', '晚上 18:00-24:00'], 
            times: '',
            rid: '',
            time: '',
            orderTime: '',  // 存放定时器
            pay_rid: ''     // 支付成功rid
        }
    },
    mounted () {
        this.initdata() 
    },
    methods: {
        initdata () {
            var self = this;
                this.rid = this.$route.query.rid;
                var obj = { rid: this.rid };
            self.$http.post('/mobile/Wxregistration/registration_detail', obj).then(res => {
                console.log(res)
                if (res.code == 1) {
                    self.yudetail = res.data;
                    self.times = self.TimeInterval[(res.data.registration_timeslot - 1)];
                    if(res.data.registration_status == 1) {
                        self.timerOrder(res.data.create_time)
                    }
                } else {
                    self.yudetail = ''
                }
            })
        },
        payClick: function () {  // 去支付
           var self = this;
           this.$http.post('/mobile/Wxregistration/reg_payment', this.$route.query).then(res => {
               console.log(res)
               if (res.code == 1) {
                   self.pay_rid = res.data.rid;
                   self.wxsjk(res.data)
               } else {
                   self.$toast({
                        message: res.msg,
                        position: 'middle',
                        duration: 2000
                    });
               }
           })
        },
        pay_cancel () {     // 待支付——取消支付
            var self = this;
            this.$http.post('/mobile/Wxregistration/non_payment_cancel', { rid: this.$route.query.rid, type: 1}).then(res => {
                console.log(res)
                if (res.code == 1) {
                    self.$toast({
                        message: '取消成功！',
                        position: 'middle',
                        duration: 2000
                    });
                    self.initdata() 
                } else {
                    self.$toast({
                        message: res.msg,
                        position: 'middle',
                        duration: 2000
                    });
                }
            })
        },
        timerOrder: function(orderDate) {  //orderDate是订单生效时间，后台的Date类型传到前端成了秒
            var self = this;
            var nos = new Date().getTime();
            var end=new Date(orderDate*1000+15*60*1000);  //提交订单的时间+15min就是订单失效时间，后台Date传过来的值要乘与毫秒
        
            /*两个时间相减,得到的是毫秒ms,变成秒*/
            var result=Math.floor(end-nos)/1000; //result= 15*60s;
                self.orderTime =setInterval(sub,1000); //定时器 调度对象
            /*封装减1秒的函数*/
            function sub(){
                if (result>1) {
                    result = result - 1;
                    var second = Math.floor(result % 60);     // 计算秒 ，取余
                    var minite = Math.floor((result / 60) % 60); //计算分 ，换算有多少分，取余，余出多少秒
                    //var hour = Math.floor(result/1000/60/60%24);  //计算小时，这里最长只有30min，用不着
                    //var day = Math.floor(result/1000/60/60/24);   //计算天，这里最长只有30min，用不着
                    second = second < 10 ? '0'+second : second;
                    minite = minite < 10 ? '0'+minite : minite;
                    self.time = minite + ':' + second
                } else{
                    //这里可以添加倒计时结束后需要执行的事件
                    // alert("未在规定时间内支付，订单已失效！");
                    clearInterval(self.orderTime);  
                    //TODO 订单失效后的一些列操作：更改订单状态的同时回库存
                    // self.initdata()
                    self.yudetail = ''
                }
            };
        },
         wxsjk: function (data) { // 微信支付
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
                        debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                        "appId": data.appId,     //公众号名称，由商户传入     
                        "timeStamp": data.timeStamp,         //时间戳，自1970年以来的秒数     
                        "nonceStr": data.nonceStr, //随机串     
                        "package": data.package,     
                        "signType": data.signType,         //微信签名方式：     
                        "paySign": data.paySign //微信签名 
                    },
                function(res){
                   WeixinJSBridge.log(res.err_msg);
                    if(res.err_msg == "get_brand_wcpay_request:ok"){
                    // 使用以上方式判断前端返回,微信团队郑重提示：
                            // res.err_msg将在用户支付成功后返回ok，但并不保证它绝对可靠。
                            
                           self.$toast({
                                message: '支付成功！',
                                position: 'middle',
                                iconClass: 'iconfont icon-tipssuccess',
                                duration: 2000
                            });

                        var times = setTimeout(function () {
                            self.$router.replace({path: '/wxpaySucceed', query: { rid: self.pay_rid }})
                        }, 1000)
                            
                    } else {
                        self.$toast({
                            message: '支付失败！',
                            position: 'middle',
                            duration: 2000
                        });
                    }
                    
                }); 
            };
            
        },
    }
}
</script>

<style lang="scss" scoped>
@function rem($px) {
    @return $px / 50 + rem;
}
.subscribeDetail {
    width: 100%;
    height: 100%;
    overflow-y: scroll;
    background-color: #f4f4f4;
    font-size: rem(14);
    .section {
        width: 100%;
        .section_box {
            width: 100%;
            .section_head {
                width: 100%;
                height: rem(67);
                padding: 0 rem(13);
                background-color: #FFF;
                line-height: rem(67);
                overflow: hidden;
               > h3 {
                    float: left;
                    font-size: rem(16);
                    color: #F09F88;
                    img {
                        width: rem(38);
                        height: rem(38);
                        -webkit-border-radius: 100%;
                        border-radius: 100%;
                        vertical-align: middle;
                        margin-right: rem(5);
                    }
                }
                .cancelBtn {
                    float: right;
                   > button {
                        height: rem(25);
                        line-height: rem(25);
                        font-size: rem(11);
                        color: #808080;
                        background-color: #FFF;
                        border: 1px solid #808080;
                    }
                }
            }
            .section_head2 {
                width: 100%;
                height: rem(67);
                padding: 0 rem(13);
                background-color: #FFF;
                line-height: rem(67);
                overflow: hidden;
               > h3 {
                    font-size: rem(16);
                    color: #469AF4;
                    float: left;
                    img {
                        width: rem(38);
                        height: rem(38);
                        -webkit-border-radius: 100%;
                        border-radius: 100%;
                        vertical-align: middle;
                        margin-right: rem(5);
                    }
                }
                >span {
                    float: right;
                    font-size: rem(12);
                    color: #808080;
                }
            }
            .section_head3 {
                width: 100%;
                height: rem(67);
                padding: 0 rem(13);
                background-color: #FFF;
                line-height: rem(67);
                overflow: hidden;
                > h3 {
                    font-size: rem(16);
                    color: #F09F88;
                    float: left;
                    font-size: rem(16);
                    line-height: rem(67);
                    img {
                        width: rem(38);
                        height: rem(38);
                        -webkit-border-radius: 100%;
                        border-radius: 100%;
                        vertical-align: middle;
                        margin-right: rem(5);
                    }
                    span {
                        vertical-align: middle;
                    }
                }
                .cancelBtn2 {
                    float: right;
                   > button {
                        height: rem(25);
                        line-height: rem(25);
                        font-size: rem(11);
                        color: #808080;
                        background-color: #FFF;
                        border: 1px solid #808080;
                        -webkit-border-radius:rem(2);
                        border-radius:rem(2);
                        vertical-align: middle;
                    }
                    button:first-child {
                        width: rem(72);
                        padding: 0;
                        margin-right: rem(10);
                        background-color: #F09F88;
                        color: #FFF;
                        -webkit-border-radius:2px;
                        border-radius:2px;
                        border:0;
                    }
                }
            }
            .section_con {
                margin-top: rem(12);
                padding:0 rem(15);
                background-color: #fff;
                ul {
                    width: 100%;
                    padding: rem(20) 0;
                    li {
                        margin-top: rem(18);
                        font-size: rem(14);
                        display: -webkit-box; 
                        display: -moz-box; 
                        display: -webkit-flex; 
                        display: -moz-flex; 
                        display: -ms-flexbox;
                        display: flex;
                        overflow: hidden;
                        span {
                            display: block;
                            float: left;
                            line-height: rem(18);
                        }
                        span:first-child {
                           
                            color: #808080;
                            margin-right: rem(14);
                        }
                        span:last-child {
                            width: 75%;
                            color: #212121;
                        }
                    }
                    li:first-child {
                        margin-top: 0;
                    }
                }
            }
            .refundTime {
                margin-top: rem(12);
                background-color: #FFF;
                ul {
                    width: 100%;
                    padding: rem(20) rem(15);
                    li {
                        margin-top: rem(15);
                        font-size: rem(14);
                        display: -webkit-box; 
                        display: -moz-box; 
                        display: -webkit-flex; 
                        display: -moz-flex; 
                        display: -ms-flexbox;
                        display: flex;
                        overflow: hidden;
                        span {
                            display: block;
                            float: left;
                            line-height: rem(18);
                        }
                        span:first-child {
                           
                            color: #808080;
                            margin-right: rem(14);
                        }
                        span:last-child {
                            width: 75%;
                            color: #212121;
                        }
                    }
                    li:first-child {
                        margin-top: 0;
                    }
                }
            }
        }
    }
   
}

</style>
