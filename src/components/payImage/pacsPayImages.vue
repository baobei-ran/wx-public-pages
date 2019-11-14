<template>
<!-- 购买影像支付页 -->
    <div class="buyImage">
        <div class="buyImage-box-content" >
            <ul>
                <li>
                    <span>openid：</span>
                    <input v-model="openid" type="text" />
                </li>
                <li>
                    <span>order-code：</span>
                    <input v-model="ordercode" type="text" />
                </li>
                <li>
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
            openid: this.$route.query.openid, 
            ordercode: this.$route.query.ordercode
        }
    },
    mounted () {
        var self = this;
        
    },
    methods: {
        handleClickBuy () {
            console.log('test')
            this.wxbuy()
        },
        wxbuy (v) {
            var self = this;
            // if (!self.$isMoble) {
            //     self.$toast({
            //         message: '请在手机微信端下单支付',
            //         position: 'middle',
            //         duration: 3000
            //     });
            //     return;
            // }
            self.$http.pays('/mobile/InitData/test_wxpay', { openid: this.openid, order_code: this.ordercode }).then(response => {
                console.log(response)
                if (response.code == 1) {
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
                            
                            // var t = setTimeout(function () {
                            //     self.isSuccess()
                            //    clearTimeout(t)
                            // }, 1000)
                            self.$toast({
                                message: '支付成功！',
                                position: 'middle',
                                duration: 3000
                            });
                            
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
        isSuccess () {  // 是否支付成功
            var self = this;
            self.$http.post('/mobile/wxchat/order_inquiry', { order_code: self.order_code }).then(res => {
                if (res.code == 1) {
                    self.$toast({
                        message: '支付成功！',
                        position: 'middle',
                        duration: 2000
                    });
                    // window.location.href = self.yx_url     // 成功后跳转到影像页 
                    self.$cookie.set('_USER_IMAGE', JSON.stringify(self.yx_url))
                    setTimeout(() => {
                        self.$router.push('/userCheckDetails?time='+ new Date().getTime()+'&ordercode='+self.order_code)   // 成功后跳转到影像页 
                    }, 100)
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
    
    &-box-content {
        width: 100%;
        height: 100%;
        ul {
            margin-top: 30%;
            background: #fff;
            color: #000;
            -webkit-border-radius: rem(8);
            border-radius: rem(8);
            padding: rem(30);
            li {
                margin-top: rem(30);
                padding: rem(15) rem(15) rem(15) rem(0);
                font-size: rem(28);
                color: #333;
                span:first-child {
                    display: inline-block;
                    width: rem(190);
                    text-align: right;
                    
                }
                span:last-child {
                    i {
                        padding: 0 rem(5);
                    }
                }
                input {
                    width: 70%;
                    border: 1px solid #BBBBBB;
                    height: rem(60);
                    border-radius: rem(4);
                    padding: rem(4) rem(8);
                    -webkit-appearance: none;
                    -moz-appearance: none;
                    appearance: none;
                    color: #333;
                }
            }
            li:last-child {
                margin-top: rem(60);
                text-align: center;
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