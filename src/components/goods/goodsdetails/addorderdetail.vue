<template>
<!-- 待支付订单详情 -->
    <div class="addorderdetail">
        <div class="header" v-show="status2">
            <span>该订单不存在</span>
        </div>
        <main class="content" v-show="status">
            <div class="content_box"> 
                <div class="site">
                    <div class="addOrder" v-if='paydata.status == 1'>
                        <p>订单状态：待付款</p>
                        <p>支付剩余时间：<span>{{ timer }}</span></p>
                    </div>
                    <div class="addOrder" v-if='paydata.status == 6'>
                        <p>订单状态：已取消</p>
                    </div>
                    <ul>
                        <li class="user">
                            <span>{{ paydata.name }}</span> <span>{{ paydata.phone }}</span>
                        </li>
                        <li class="dizhi">
                            {{ paydata.address }}
                        </li>
                    </ul>
                </div>

                <div class="orderList">
                    <h4><span v-text='paydata.sname?paydata.sname:"医生"'></span>的店铺 <img src="../../../common/img/icon_enter.png" alt=""></h4>
                    <dl class="order_con" v-for="(val,i) in drugdata" :key='i'>
                        <dt><img :src="$http.baseURL+val.img" alt=""></dt>
                        <dd>
                            <h5>{{ val.name }}</h5>
                            <span>￥{{ val.money }}</span>
                            <p>x{{ val.num }}</p>
                        </dd>
                    </dl>
                    <ul class="goods">
                        <li><span>商品总额</span><span>￥{{ paydata.moneys }}</span></li>
                        <li><span>运费</span><span>￥{{ paydata.postage }}</span></li>
                        <li><span>总付费(含运费)</span><span>￥{{ paydata.moneys }}</span></li>
                    </ul>
                    <div class="usermsg">
                        <ul>
                            <li>订单编号：<span>{{ paydata.number }}</span></li>
                            <li>创建时间：<span>{{ paydata.addtime | filterTime }}</span></li>
                            <li>配送方式：
                                <span v-if='paydata.distribution == 1'>快递配送</span>
                                <span v-if='paydata.distribution == 2'>自提</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </main>
        <div class="footer" v-if='paydata.status == 1'>
            <div>总计：<span>￥{{ paydata.moneys }}</span></div>
            <mt-button type="primary" :disabled='disabled' @click.native='orderData'>立即支付</mt-button>
        </div>
        <div class="footer1" v-if='paydata.status == 6'>
            <mt-button type="primary" @click.native='createOrder'>再次购买</mt-button>
        </div>
    </div>
</template>

<script>
import { Toast } from 'mint-ui';
export default {
    data () {
        return {
            status: false,
            status2: false,
            paydata: '',
            timer: '',
            dizhi: '',
            orderTime: '',      // 订单倒计时的执行函数
            disabled: false,    // 按钮控制
            drugdata: [],   
        }
    },
    mounted () {
        this.initdata()
        var self = this;
    },
    methods: {
        initdata () {
            var self = this;
            this.$http.post('/mobile/Wxorder/order_data', { number: this.$route.params.id}).then(res => {
                console.log(res)
                if (res.code == 1) {
                    this.status = true
                    self.paydata = res.data
                    self.drugdata = res.arr
                    if (res.data.status == 1) {
                        self.timerOrder(res.data.addtime, res.data.fw_time)     // 传递订单创建时间 和 服务器时间
                    }
                } else {
                    this.status2 = true
                }
            })
        },
        Return () {
            this.$router.back()
        },
       
        timerOrder: function(orderDate, fw) {  //orderDate是订单生效时间，后台的Date类型传到前端成了秒
            var self = this;
            var now=new Date(fw*1000);
            var end=new Date(orderDate*1000+30*60*1000);  //提交订单的时间+30min就是订单失效时间，后台Date传过来的值要乘与毫秒
        
            /*两个时间相减,得到的是毫秒ms,变成秒*/
            var result=Math.floor(end-now)/1000; //result= 30*60s;
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
                    self.timer = minite + ':' + second
                } else{
                    //这里可以添加倒计时结束后需要执行的事件
                    // alert("未在规定时间内支付，订单已失效！");
                    clearInterval(self.orderTime);  
                    //TODO 订单失效后的一些列操作：更改订单状态的同时回库存
                    self.initdata()
                }
            };
        },
        
        createOrder () {    // 再次购买
            this.$router.push({ name: 'doctororder', params: { number: this.paydata.number }})
        },

        orderData () {  // 提交下单
            var self = this;
            this.disabled = true;
            var t = setTimeout(function () {
                self.disabled = false;
                clearTimeout(t)
            }, 3000)
            console.log(this.$route.params)
            this.$http.post('/mobile/Wxorder/lists_order', { number: this.$route.params.id }).then(res => {
                console.log(res)
                if (res.code == 1) {
                    self.wxsjk(res.data)
                } else {
                    Toast({
                        message: res.msg,
                        position: 'center',
                        duration: 1000
                    });
                    self.initdata()
                }
            })
        },
        wxsjk (data) {
            var self = this;
            if (typeof WeixinJSBridge == "undefined"){
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
                        "appId": data.appId,     //公众号名称，由商户传入     
                        "timeStamp": data.timeStamp,         //时间戳，自1970年以来的秒数     
                        "nonceStr": data.nonceStr, //随机串     
                        "package": data.package,     
                        "signType": data.signType,         //微信签名方式：     
                        "paySign": data.paySign //微信签名 
                    },
                function(res){
                    if(res.err_msg == "get_brand_wcpay_request:ok") {
                    // 使用以上方式判断前端返回,微信团队郑重提示：
                            //res.err_msg将在用户支付成功后返回ok，但并不保证它绝对可靠。
                    var times = setTimeout(function () {
                        self.$http.post('/mobile/Wxorder/pay_result', {order_code: data.order_code }).then(res => {
                            if (res.code == 1) {
                                Toast({
                                    message: '支付成功！',
                                    position: 'middle',
                                    iconClass: 'iconfont icon-tipssuccess',
                                    duration: 2000
                                });
                                var time = setTimeout(function () {
                                    self.$router.replace({ path: '/successOrder', query: { id: data.number }})
                                    cleraInterval(time)
                                }, 1000)
                            }
                        })
                        cleraInterval(times)
                    }, 500)
                    } else {
                        Toast({
                            message: '支付失败！',
                            position: 'middle',
                            duration: 2000
                        });
                        self.initdata()
                    }
                    
                }); 
            };
            
        },
    }
}
</script>

<style lang="scss" scoped>
@function rem($px) {
    @return $px/ 50 + rem;
}
.addorderdetail {
    width: 100%;
    height: 100%;
    -webkit-display: flex;
    display: -webkit-flex;
    display: flex;
    -webkit-flex-direction: column;
    flex-direction: column;
    font-size: rem(16);
    .header {
        width: 100%;
        text-align: center;
        font-size: rem(15);
        height: rem(50);
        line-height: rem(50);
        color: orange;
    }
    .content {
        width: 100%;
        -webkit-flex:1;
        flex:1;
        overflow-y: scroll;
        -webkit-overflow-scrolling: touch;
        .content_box {
            padding: 0 rem(15);
            .site {
                width: 100%;
                box-shadow:0px 5px 10px 0px rgba(0, 0, 0, 0.1);
                border-radius: rem(4);
                margin-top: rem(6);
                padding:rem(15);
                background-color: #fff;
                .addOrder {
                    width: 100%;
                    -webkit-display: flex;
                    display: flex;
                    justify-content: space-between;
                    font-size: rem(12);
                    color: #808080;
                    padding-bottom: rem(15);
                    border-bottom: 1px solid #E6E6E6;
                    p > span {
                        display: inline-block;
                        min-width: rem(32);
                        color: #E93825;
                    }
                }
                ul {
                    position: relative;
                    margin-top: rem(15);
                    li {
                        color:#333;
                        font-size: rem(12);
                    }
                    .user {
                        font-size: rem(14);
                        line-height: rem(17);
                        padding: 0 rem(15) rem(11) rem(15);
                        span:last-child {
                            color:#666;
                        }
                    }
                    .dizhi {
                        font-size: rem(12);
                        color:#333;
                        background: url('../../../common/img/icon_dz.png') no-repeat rem(-5);
                        background-size: 9%;
                        padding-left: rem(17);
                        line-height: rem(17);
                        overflow: hidden;
                        text-overflow:ellipsis;
                        white-space: nowrap;
                    }
                }
            }
            .orderList {
                width: 100%;
                margin-top: rem(5);
                padding: rem(15);
                box-shadow:0px rem(5) rem(10) 0px rgba(0, 0, 0, 0.1);
                border-radius: rem(4);
                background-color: #fff;
                >h4 {
                    font-size:rem(14);
                    color: #333;
                    background: #fff url('../../../common/img/icon_dpu.png') no-repeat 0;
                    background-size: 8%;
                    line-height: rem(30);
                    font-weight:500;
                    margin-bottom: rem(15);
                    padding-left: rem(28);
                    img {
                        width: rem(25);
                        vertical-align: middle;
                    }
                }
                .order_con {
                    display: -webkit-flex;
                    display: flex;
                    margin-top: rem(10);
                    dt {
                        >img {
                            display: block;
                            width: rem(64);
                        }
                    }
                    dd {
                        margin-left: rem(15);
                        font-size: rem(12);
                        color:#333;
                        h5 {
                            font-size: rem(14);
                            margin-top: rem(2);
                        }
                        >span {
                            color: #F09F88;
                            margin: rem(10) 0;
                            display: block;
                        }
                    }
                }
                .goods {
                    width: 100%;
                    border-bottom: 1px solid #E6E6E6;
                    li {
                        margin: rem(20) 0;
                        font-size: rem(13);
                        color: #333;
                        display: flex;
                        justify-content: space-between;
                        img {
                            width: rem(25);
                            vertical-align: middle;
                        }
                        span:last-child {
                            color: #808080;
                        }
                    }
                }
                .usermsg {
                    padding: rem(7.5) 0;
                    font-size: rem(13);
                    font-weight:400;
                    > ul {
                        li {
                            line-height: rem(20);
                            color: #808080;
                            padding: rem(7.5) 0;
                        }
                    }
                    
                }
            }
        }
    }

    .footer {
        -webkit-display: flex;
        display: flex;
        height: rem(49);
        >div {
            width: 50%;
            text-align: right;
            padding-right: rem(15);
            line-height: rem(49);
            color: #333;
            font-weight:400;
            span {
                color: #F09F88;
            }
        }
        >button {
            width: 50%;
            height: 100%;
            border-radius: 0;
            font-size: rem(14);
        }
    }
    .footer1 { 
        height: rem(49);
        button {
            width: 100%;
            height: 100%;
            border-radius: 0;
            font-size: rem(14);
        }
    }
}
</style>

