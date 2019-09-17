<template>
    <!-- 处方药品下单 -->
    <div class="recipeorder dis_f flex_c">
        <div class="contents flex1">
            <div class="contents-box">
                <!-- 待支付 -->
               <div class="header" v-show="orderinfo.status == 1">
                   <h2>
                       <img src="../../common/img/icon_dfk@2x.png" alt="" />
                       <p>订单未支付，请在<span>{{ countDown }}</span>分钟内完成支付</p>
                   </h2>
               </div>

                <!-- 取货码 -->
               <div class="Pickup-code" v-show="orderinfo.status == 2 || orderinfo.status == 3 || orderinfo.status == 4"> 
                   <div>
                        <p><img src="../../common/img/icon_dqh@2x.png" alt="" /><span>待取货，到店后出示自提码取货</span></p>
                        <h3><b>自提码</b> <span>{{ orderinfo.code }}</span></h3>
                   </div>
               </div>

                <!-- 自提码已核销 -->
                <div class="cancenCode" v-show="orderinfo.status == 5">
                    <h3><img src="../../common/img/icon_dfkyes.png" alt="" /><span>自提码已核销，订单已完成</span></h3>
                </div>
                <!-- 已取消 -->
                <div class="cancenInfo" v-show="orderinfo.status == 6" >
                    <h3>已取消</h3>
                </div>


               <div class="drugstoremsg">
                   <div>
                       <h2>{{ orderinfo.hname }}</h2>
                        <P>地址：<span>{{ orderinfo.haddrs }}</span></P>
                        <ul>
                            <li v-show="orderinfo.hktime">
                                <span>营业时间</span>
                                <span class="bg-img"><i class="iconfont icon-shijian"></i>{{ orderinfo.hktime }} - {{ orderinfo.hjtime }}</span>
                            </li>
                            <li>
                                <span>联系电话</span>
                                <span class="bg-img2"><i class="iconfont icon-dianhua"></i>{{ orderinfo.tel }}</span>
                            </li>
                        </ul>
                   </div>
               </div>
               
               <div class="section">
                   <div class="recipe-content">
                        <h3>{{ orderinfo.hname }}</h3>
                        <div class="drug">
                            <ul v-for='(val, i) in drugdata' :key='i'>
                                <li class="dis_f">
                                    <img :src="$http.baseURL+val.img" alt="" />
                                    <dl class="flex1">
                                        <dt>
                                            <b>{{val.name}}</b>
                                            <span class="F-r">￥{{ val.money }}</span>
                                        </dt>
                                        <dd>
                                            <b>{{val.cj}}</b> 
                                            <span class="F-r">x{{ val.num }}</span>
                                        </dd>
                                    </dl>
                                </li>
                                <li><span>用法用量：{{ val.yfyl }}</span></li>
                            </ul>
                        </div>
                        <div class="shop-money">
                            <p>
                                商品金额
                                <span class="F-r">
                                    ￥{{ orderinfo.money }}
                                </span>
                            </p>
                            <p>
                                运费
                                <span class="F-r">
                                    ￥0.00
                                </span>
                            </p>
                            <p class="moneyAll">
                                金额合计
                                <span class="F-r">
                                    ￥<b>{{ orderinfo.money }}</b>
                                </span>
                            </p>
                        </div>
                    </div>
                    <ul class="order-number" v-if="orderinfo.status == 1 || orderinfo.status == 6">
                        <li>订单编号：<span class="F-r">{{ orderinfo.order_code }}</span></li>
                        <li>创建时间：<span class="F-r">{{ orderinfo.addtime | filterTime }}</span></li>
                    </ul>
                    <ul class="order-number" v-else>
                        <li>订单编号：<span class="F-r">{{ orderinfo.order_code }}</span></li>
                        <li>创建时间：<span class="F-r">{{ orderinfo.addtime | filterTime }}</span></li>
                        <li>付款时间：<span class="F-r">{{ orderinfo.pay_time | filterTime }}</span></li>
                        <li>配送方式：<span class="F-r">自提</span></li>
                        <li v-if="orderinfo.status == 5">自提码核销时间：<span class="F-r">{{ orderinfo.sure_time | filterTime }}</span></li>
                    </ul>
               </div>
                
            </div>
        </div>
        
        <div class="footer dis_f" v-show="orderinfo.status == 1">
            <span>
                <span>总计：<b>￥<b>{{ orderinfo.money }}</b></b></span>
            </span>
            <span>
                <mt-button @click.native="submitOrder">提交订单</mt-button>
            </span>
        </div>
        <div class="foot-pay" v-show="orderinfo.status == 5 && orderinfo.type == 2">
            <mt-button @click.native="handleOrderBuy">再次购买</mt-button>
        </div>
    </div>
</template>

<script>
export default {
    name: 'orderdetails',
    data () {
        return {
            drugdata: [],
            orderCode: '',      // 订单号
            orderinfo: {},   // 订单基本信息
            countDown: '',   // 未支付倒计时
            orderTime: '',
            uid: this.$cookie.get('userLogins'),
            order_code: '',
            number: '',     // 支付时的订单号
        }
    },
    mounted () {
        console.log(this.$route.query)
        this.orderCode = this.$route.query.id;
        this.initdata()
    },
    beforeDestroy () {
        if (this.orderTime) {
            clearInterval(this.orderTime)
        }
    },
    methods: {
        initdata () {
            this.$indicator.open({
                text: '加载中...',
                spinnerType: 'fading-circle'
            });
            var self = this;
            self.$http.post('/mobile/wxorder/will_call_look', { number: this.orderCode }).then(res => {
                console.log(res)
                self.$indicator.close();
                if (res.code == 1) {
                    self.drugdata = res.data
                    self.orderinfo = res.info;
                    if (res.info.status == 1) {
                        if (this.orderTime) {
                            clearInterval(this.orderTime)
                        }
                        self.timerOrder(res.info.addtime);
                    }
                } else {
                    self.$toast({
                        message: res.msg,
                        position: 'middle',
                        duration: 3000
                    });
                }
            }).catch(err => {
                self.$indicator.close();
                self.$toast('服务器发生错误');
            })
        },
        submitOrder () { // 下单购买, 立即支付
            var self = this;
            var obj = { number: this.orderCode }
            console.log(obj)
            self.$http.post('/mobile/Wxorder/lists_order', obj).then(res => {
                console.log(res)
                if (res.code == 1) {
                    self.wxsjk(res.data)
                    self.order_code = res.data.order_code
                    self.number = res.data.number
                } else {
                    self.$toast({
                        message: res.msg,
                        position: 'middle',
                        duration: 2000
                    });
                }
            }).catch(err => {
                console.log(err)
            })
        },
        handleOrderBuy () { // 自提再次购买
            this.$router.push({path:'/yaorecipeorder', query: { number:  this.orderCode }})
        },
        wxsjk (data) { // 调取微信支付
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
                       var time = setTimeout(() => {
                            self.$http.post('/mobile/wxorder/order_affirm_se',{order_code: self.order_code}).then(res => {
                                if (res.code == 1) {
                                    self.$router.replace({path:'/drugpaysuccess', query: { number: self.number, type: res.data.type, code: res.data.code }})
                                }
                            })  
                            clearTimeout(time)
                        }, 300)  
                        
                            
                    } else {
                        self.$toast({
                            message: '支付失败！',
                            position: 'middle',
                            duration: 2000
                        });
                        var t = setTimeout(function () {
                            // self.$router.replace({path: '/orderdetails', query: { id: self.order_code }})
                            self.initdata()
                            clearTimeout(t)
                        }, 1000)
                    }
                    
                }); 
            };
            
        },
        timerOrder: function(orderDate) {  //orderDate是订单生效时间，后台的Date类型传到前端成了秒
            var self = this;
            var now= new Date().getTime(); // 获取本地时间
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
                    self.countDown = minite + ':' + second
                } else{
                    //这里可以添加倒计时结束后需要执行的事件
                    // alert("未在规定时间内支付，订单已失效！");
                    clearInterval(self.orderTime);  
                    //TODO 订单失效后的一些列操作：更改订单状态的同时回库存
                    self.initdata()
                }
            };
        },
    }
}
</script>


<style lang="scss" scoped>
@function rem($px) {
    @return $px / 50 + rem;
}
.recipeorder {
    width: 100%;
    height: 100%;
    background: #F0F0F0;
    font-size: rem(14);
    .contents {
        width: 100%;
        overflow-y: scroll;
        .contents-box {
            .header {
                padding: 0 rem(15);
                margin-top: rem(10);
                h2 {
                    width: 100%;
                    height: rem(44);
                    line-height: rem(44);
                    background: #fff;
                    padding-left: rem(13);
                    img {
                        float: left;
                        display: block;
                        width: rem(20);
                        padding-top: rem(12);
                    }
                    p {
                        float: left;
                        vertical-align: middle;
                        padding-left: rem(5);
                        font-size: rem(12);
                        span {
                            display: inline-block;
                            width: rem(34);
                            text-align: center;
                            color: #E93825;
                        }
                    }
                }
            }
            .Pickup-code {
                padding: 0 rem(15);
                margin-top: rem(10);
                > div {
                    width: 100%;
                    background-color: #FFF;
                    border-radius: 4px;
                    padding: rem(15);
                    p {
                        
                        img {
                            width: rem(20);
                            vertical-align: middle;
                            margin-right: rem(3);
                        }
                        span {
                            color: #808080;
                            font-size: rem(12);
                        }
                    }
                    h3 {
                        margin-top: rem(19);
                        font-size: rem(12);
                        color: #333;
                        padding-left: rem(23);
                        >b {
                            font-weight: 600;
                        }
                        > span {
                            font-size: rem(18);
                            color: #F09F88;
                            margin-left: rem(5);
                        }
                    }
                }
            }
            .cancenCode {
                padding: 0 rem(15);
                margin-top: rem(10);
                h3 {
                    padding: rem(15);
                    background-color: #FFF;
                    img {
                        width: rem(20);
                        height: rem(20);
                        vertical-align: middle;
                        margin-right: rem(3);
                    }
                    span {
                        color: #808080;
                        font-size: rem(12);
                    }
                }
            }
            .cancenInfo {
                width: 100%;
                padding: 0 rem(15);
                margin-top: rem(10);
                h3 {
                    color: #808080;
                    padding: rem(20);
                    background-color: #fff;
                    font-size: rem(12);
                }
            }
            .drugstoremsg {
                padding: 0 rem(15);
                width: 100%;
                margin-top: rem(10);
                >div {
                    background: #FFF;
                    padding: rem(15);
                    > h2 {
                        color: #333;
                        font-size: rem(14);
                        font-weight: 600;
                        padding-bottom: rem(11);
                    }
                    >p {
                        font-size: rem(12);
                    }
                ul {
                    margin-top: rem(20);
                    overflow: hidden;
                    li {
                        width: 50%;
                        float: left;
                        span {
                            display: block;
                            font-size: rem(11);
                            color: #808080;
                            i {
                                display: inline-block;
                                margin-right: rem(3);
                            }
                            
                        }
                        span:last-child {
                            color: #469AF4;
                            margin-top: rem(10);
                        }
                    }
                    li:first-child {
                        border-right: 1px solid #DDD;
                    }
                    li:last-child {
                        padding-left: rem(15);
                    }
                }
                }
            }
               
            .section {
                padding: rem(15);
                padding-top: 0;
                margin-top: rem(10);
                 .recipe-content {
                    padding: rem(15) rem(15) 0;
                    color: #333;
                    background: #fff;
                    border-radius: 4px;
                    > h3 {
                        font-size: rem(13);
                        padding-bottom: rem(15);
                        border-bottom:1px solid #eee;
                    }
                    .drug {
                        border-bottom:1px solid #eee;
                        > ul {
                            width: 100%;
                            padding: rem(15) 0;
                            li {
                                width: 100%;
                                img {
                                    width: rem(42);
                                    height: rem(43);
                                }
                                dl {
                                    padding-left: rem(10);
                                    dt {
                                        font-size: rem(12);
                                        line-height: rem(17);
                                    }
                                    dd {
                                        font-size: rem(11);
                                        line-height: rem(17);
                                        color: #808080;
                                        margin-top: rem(9);
                                    }
                                }
                            }
                            li:last-child {
                                margin-top: rem(10);
                                font-size: rem(11);
                                line-height: rem(17);
                                color: #808080;
                            }
                        }
                    }
                    .shop-money {
                        width: 100%;
                        padding: rem(7) 0;
                        p {
                            font-size: rem(12);
                            color: #333;
                            line-height: rem(20);
                            padding: rem(7) 0;
                            span {
                                b {
                                    font-size: 14px;
                                }
                            }
                        }
                        p:last-child {
                            border-top: 1px solid #eee;
                        }
                    }
                }
                .order-number {
                    margin-top: rem(10);
                    padding: rem(10);
                    background-color: #fff;
                    border-radius: 4px;
                    li {
                        font-size: rem(11);
                        color: #808080;
                        padding: rem(3) 0;
                        line-height: rem(20);
                    }
                }
            }
            
        }
    }
    .footer {
        width: 100%;
        height: rem(49);
        background-color: #fff;
        > span {
            display: inline-block;
            width: 50%;
            text-align: right;
            line-height: rem(49);
            > span {
                padding-right: rem(15);
                b {
                    color: #F09F88;
                    font-size: rem(13);
                    b {
                        font-size: rem(17);
                    }
                }
            }
            button {
                width: 100%;
                height: 100%;
                border-radius: 0;
                background-color: #4A9CF3;
                color: #fff;
                font-size: rem(14);
            }
        }
    }

    .foot-pay {
        width: 100%;
        height: rem(49);
        button {
            width: 100%;
            height: rem(49);
            background-color: #4A9CF3;
            color: #fff;
            font-size: rem(16);
            -webkit-border-radius: 0;
            border-radius: 0;
        }
    }
   
}
</style>

