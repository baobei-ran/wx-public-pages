<template>
<!-- 购买影像支付页 -->
    <div class="buyImage">
        <div class="buyImage-box"></div>
        <div class="buyImage-box-content" >
            <ul>
                <li>
                    <span>检查医院：</span>
                    <span>{{ userMsg.hospital }}</span>
                </li>
                <li>
                    <span>就诊人：</span>
                    <span>{{ userMsg.patient_name }}<i>|</i>{{ userMsg.patient_sex == 'F'? '女':'男' }}<i>|</i>{{userMsg.age}}岁</span>
                </li>
                <li>
                    <span>服务项目：</span>
                    <span>查看电子影像</span>
                </li>
                <li>
                    <span>服务费用：</span>
                    <span>{{ money }}元</span>
                </li>
                <li>
                    <mt-button class="btn-cancel" @click.native="handleClickCancel">取消</mt-button>
                    <mt-button class="btn-handle" @click.native="handleClickBuy">确定支付</mt-button>
                </li>
            </ul>
        </div>
    </div>
</template>
<script>
export default {
    data () {
        return {
            uid: this.$route.query.uid, 
            userMsg: {},
            money: 0,
            yx_url: '',
            
        }
    },
    beforeRouteEnter (to, from, next) {
        console.log(to, from)
        if (from.fullPath == '/') {
            next(vm => {
                var urll = JSON.parse(vm.$cookie.get('URLPAY'));
                next(urll)
            })
        } else {
            next()
        }
    },
    mounted () {
        var self = this;
        var userMsg = JSON.parse(self.$cookie.get('BuyImage'));
        console.log(userMsg)
        this.userMsg = userMsg;
        this.$http.post('/mobile/WxSeeImage/see_one_image', { userid: this.uid, hos_id: userMsg.hid, exam_id: userMsg.exam_id, study_id: userMsg.study_id }).then(res => {
                console.log(res)
                if (res.code == 0) {
                    self.money = res.price;
                } else if (res.code == 1) {
                    window.location.href = res.yx_url;
                    // self.$cookie.set('_USER_IMAGE', JSON.stringify(res.yx_url))
                    // self.$router.replace('/userCheckDetails?time='+ new Date().getTime())
                } else {
                    self.$toast({
                        message: res.msg,
                        position: 'middle',
                        duration: 2000
                    });
                }
            })
    },
    methods: {
        handleClickCancel () {  // 取消支付
            this.$router.back()
        },
        handleClickBuy () {
            var self = this;
            self.$http.post('/mobile/WxSeeImage/flag_pay', {hid: this.userMsg.hid }).then(res => {
                console.log(res)
                if (res.code == 301 || res.code == 302) {
                    self.wxbuy(self.userMsg)
                } else if (res.code == 303) {
                    window.location.href='https://www.yunyikang.cn/mobile/WxSeeImage/user_image_merchant_pay?userid='+self.uid+'&hos_id='+self.userMsg.hid+'&idcard='+self.userMsg.idcard+'&exam_id='+self.userMsg.exam_id+'&study_id='+self.userMsg.study_id+'time='+new Date().getTime()
                } else {
                    self.$toast({
                        message: res.msg,
                        position: 'middle',
                        duration: 3000
                    });
                }
            }).catch(err => {
                console.log(err)
            })
        },
        wxbuy (v) {
            var self = this;
            if (!self.$isMoble) {
                self.$toast({
                    message: '请在手机微信端下单支付',
                    position: 'middle',
                    duration: 3000
                });
                return;
            }
            self.$http.axios('/mobile/WxSeeImage/user_image_pay', { userid: this.uid, exam_id: v.exam_id , idcard: v.idcard, hos_name: v.hospital, hos_info: JSON.stringify(v), exam_datetime: v.exam_datetime, exam_class: v.exam_class, patient_num: v.patient_num, study_id: v.study_id, hos_id: v.hid }).then(response => {
                console.log(response)
                if (response.code == 1) {
                    self.order_code = response.data.order_code; // 获取订单号
                    self.yx_url = response.data.yx_url;         // 获取支付成功后的跳转影像链接
                    self.wxsjk(response.data)
                } else {
                    self.$toast({
                        message: response.msg,
                        position: 'middle',
                        duration: 2000
                    });
                }
            }).catch(err => {
                self.$toast({
                    message: '服务器错误，无法支付',
                    position: 'middle',
                    duration: 2000
                });
                console.log(err)
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
                        var errt = setTimeout(function () {
                            // self.$router.replace({ path: '/userPayMsgRecordDetail', query: { id: self.order_code }});    // 跳转付费问诊详情页
                            self.$router.back()
                            clearTimeout(errt)
                        }, 1000)
                    }
                    
                }); 
            };
        },
        isSuccess () {  // 是否支付成功
            var self = this;
            self.$http.post('/mobile/wxchat/order_inquiry', { order_code: self.order_code }).then(res => {
                if (res.code == 1) {
                    self.$toast({
                        message: '支付成功！',
                        position: 'middle',
                        duration: 2000
                    });
                    window.location.href = self.yx_url     // 成功后跳转到影像页 
                    // self.$cookie.set('_USER_IMAGE', JSON.stringify(self.yx_url))
                    // setTimeout(() => {
                    //     self.$router.replace('/userCheckDetails?time='+ new Date().getTime()+'&ordercode='+self.order_code)   // 成功后跳转到影像页 
                    // }, 30)
                } else {
                    self.$toast({
                        message: res.msg,
                        position: 'middle',
                        duration: 2000
                    });
                }
            })
        }
    }
}
</script>
<style lang="scss" scoped>
@function rem($px) {
    @return $px/100+rem;
}
.buyImage {
    width: 100%;
    height: 100%;
    font-size: rem(28);
    position: relative;
    &-box {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        z-index: 1;
        background: url('../../common/img/yingxiang.jpg') no-repeat;
        background-size: cover;
        &:after{
            content: "";
            width:100%;
            height:100%;
            position: absolute;
            left:0;
            top:0;
            background: inherit;
            filter: blur(2px);
            z-index: 2;
        }
    }
    &-box-content {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        z-index: 20;
        padding: 0 rem(60);
        ul {
            margin-top: 50%;
            background: #fff;
            color: #000;
            -webkit-border-radius: rem(8);
            border-radius: rem(8);
            padding: rem(60);
            li {
                padding: rem(15) rem(15) rem(15) rem(40);
                font-size: rem(28);
                color: #333;
                span:first-child {
                    display: inline-block;
                    width: rem(160);
                }
                span:last-child {
                    i {
                        padding: 0 rem(5);
                    }
                }
            }
            li:last-child {
                margin-top: rem(60);
                button {
                    width: rem(180);
                }
                .btn-cancel {
                    border: 1px solid #4A9CF3;
                    color: #4A9CF3;
                    font-size: rem(28);
                    margin-right: rem(60);
                }
                .btn-handle {
                    background-color: #4A9CF3;
                    color: #fff;
                    font-size: rem(28);
                }
            }
        }
    }
}
</style>