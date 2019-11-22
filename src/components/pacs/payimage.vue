<template>
<!-- pacs 影像支付页 -->
    <div class="payimage">
        <div class="payimage-content">
            <h2>{{hos_name}}</h2>
            <h2>电子影像</h2>
            <p>￥<span>{{ m }}</span></p>
            <div>
                <van-button :disabled='disabled' style='background-color:#505EDE;border-color:#505EDE;' @click='handlePay' type="info">支付数字影像</van-button>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: 'merchantPayImage',
    data () {
        return {
            disabled: false,
            hid: this.$route.query.hid, 
            openid: this.$route.query.openid, 
            ordercode: this.$route.query.ordercode,   // tset '2019092311180001338'
            m: this.$route.query.m,
            hos_name: this.$route.query.hos_name,
        }
    },
    methods: {
        handlePay () {
            this.disabled = true;
            // this.$router.replace({ name:'paysuccess', params: { url: 'http:/static.pacsview.pacsonline.cn/#/pc?studyurl=http:/work.api.pacsonline.cn/inter/dcquery/get_studiesinfo?address=&study_id=116d6d59c62aff87' }})
            this.wxbuy()
        },
        wxbuy () {
            var self = this;
            // if (!self.$isMoble) {
            //     self.$toast({
            //         message: '请在手机微信端下单支付',
            //         position: 'middle',
            //         duration: 3000
            //     });
            //     return;
            // }
            self.$http.post('/mobile/WxSeeImage/merchant_image_pay', { openid: this.openid, order_code: this.ordercode, hos_id: this.hid }).then(response => {
                console.log(response)
                if (response.code == 200) {
                    self.wxsjk(response.data)
                } else {
                    self.$toast({
                        message: response.msg,
                        position: 'middle',
                        duration: 2000
                    });
                    self.disabled = false
                }
            }).catch(err => {
                self.$toast({
                    message: '服务器错误，无法支付',
                    position: 'middle',
                    duration: 2000
                });
                self.disabled = false
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
                            }, 800)
                            // self.$toast({
                            //     message: '支付成功！',
                            //     position: 'middle',
                            //     iconClass: 'iconfont icon-tipssuccess',
                            //     duration: 3000
                            // });
                            self.disabled = false
                            
                    } else {
                        self.$toast({
                            message: '支付失败！',
                            position: 'middle',
                            duration: 2000
                        });
                        self.$router.go(-2)
                    }
                    
                }); 
            };
        },
        isSuccess () {  // 是否支付成功
            var self = this;
            self.$http.post('/mobile/WxSeeImage/is_see_image', { order_code: self.ordercode }).then(res => {
                console.log(res)
                if (res.code == 200) {
                    self.$toast({
                        message: '支付成功！',
                        position: 'middle',
                        duration: 2000
                    });
                    self.$router.replace({ name:'paysuccess', params: { url: res.url }})
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
    @return $px / 100+rem;
}
.payimage {
    width: 100%;
    font-size: rem(28);
    &-content {
        margin-top: rem(159);
        text-align: center;
        h2 {
            color: #333;
            font-size: rem(34);
            line-height: rem(48);
            margin-top: rem(20);
        }
        p {
            font-size: rem(34);
            margin-top: rem(59);
            color: #333;
            font-weight: 500;
            span {
                font-size: rem(60);
            }
        }
        >div {
            margin-top: rem(99);
            text-align: center;
        }
    }
}
</style>