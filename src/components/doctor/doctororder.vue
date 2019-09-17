<template>
<!-- 下单 -->
    <div class="doctororder">
        <!-- <div class="header">
            <img @click='Returns' src="../../common/img/icon_fh.png" alt="">
            <span>下单详情</span>
        </div> -->
        <main class="content flex1">
            <div class="content_box"> 
                <div class="sites" @click='selects($event)'>
                    <div class="emptySite"  v-if='!site'>
                        <span>你还没有地址，去添加地址</span><img src="../../common/img/icon_enter.png" alt="">
                    </div>
                    <div class="userdi" v-if='site'>
                        <ul>
                            <li class="user">
                                <span>{{ site.name }}</span> <span>{{ site.phone }}</span>
                            </li>
                            <li class="dizhi">
                                {{ site.province }} {{ site.city }} {{ site.county }} {{ site.address }}
                            </li>
                            <li class="right">
                                <img src="../../common/img/icon_enter.png" alt="">
                            </li>
                        </ul>
                    </div>
                </div>

                <div class="orderList">
                    <h4>{{ orderdata.true_name }}的店铺 <img src="../../common/img/icon_enter.png" alt=""></h4>
                    <dl class="order_con">
                        <dt><img :src="$http.baseURL+orderdata.pic" alt=""></dt>
                        <dd>
                            <h5>{{ orderdata.name }}</h5>
                            <span>￥{{ orderdata.price }}</span>
                            <p>x{{ num }}</p>
                        </dd>
                    </dl>
                    <ul class="goods">
                        <li><span>配送方式</span><span>快递 包邮 
                            <!-- <img src="../../common/img/icon_enter.png" alt=""> -->
                        </span></li>
                        <li><span>商品总额</span><span>￥{{ orderdata.zprice }}</span></li>
                        <li><span>运费</span><span>￥0.00</span></li>
                    </ul>
                    <div class="usermsg">
                        <label for="">买家留言</label>
                        <textarea name="" v-model='txt' @input='getLength' maxlength="200" placeholder="请填写备注信息"></textarea>
                        <span class="fixed"><i>{{ length }}</i>/<i>200</i></span>
                    </div>
                </div>
            </div>
        </main>
        <div class="footer" v-if='hidShow'>
            <div>总计：<span>￥{{ orderdata.zprice }}</span></div>
            <mt-button type="primary" :disabled='disabled' @click.native='orderData'>提交订单</mt-button>
        </div>
    </div>
</template>

<script>
import { Toast } from 'mint-ui';
export default {
    data () {
        return {
            length: 0,  // 留言的数量
            txt: '',    // 留言内容
            site: '',   // 地址
            orderdata: '', 
            huan: [],
            ordertime: '',  // 订单时间
            disabled: false, // 按钮控制
            docmHeight: document.documentElement.clientHeight, // 默认屏幕高度
            showHeight: document.documentElement.clientHeight, // 实时屏幕高度
            hidShow: true, // 显示或者隐藏footer
            num: this.$route.query.num,   // 购买数量
        }
    },
    mounted () {
        this.initsite();
        var vm = this
        // window.resize监听页面高度的变化
            window.onresize = () => {
            return (() => {
                vm.showHeight = document.body.clientHeight
            })()
        }


        // 监听返回按钮事件
        if (window.history && window.history.pushState) {
            window.addEventListener('popstate', vm.close, false)
        }
    },
    destroyed(){ // 离开后进行销毁
        var _this = this;
        setTimeout(function(){
            window.removeEventListener('popstate',_this.close,false);
        },0)
    },
    watch: {
        showHeight: function () {
             var ua = window.navigator.userAgent,
            app = window.navigator.appVersion;
            // android端
            if(ua.indexOf('Android') > -1 || ua.indexOf('Adr') > -1) {
                if (this.docmHeight > this.showHeight ) {
                    this.hidShow = false
                } else {
                    this.hidShow = true
                }
            }
        },
        '$route': 'selects'
  },
    methods: {
        close () {
            var userSite = JSON.parse(this.$cookie.get('userSite'));
            if (userSite && userSite.status == 1) {
                this.$cookie.delete('userSite');
            }
        },
        Returns () {
            var userSite = JSON.parse(this.$cookie.get('userSite'));
            if (userSite && userSite.status == 1) {
                this.$cookie.delete('userSite');
            }
            this.$router.go(-1);
        },
        initsite () { // 获取数据
            var self = this,
                uid = this.$cookie.get('userLogins');
                var id = this.$route.query.id
                this.$http.post('/mobile/Wxorder/look_order', { id: id}).then(res => {
                    console.log(res)
                    if (res.code == 1) {
                        var data = res.data
                        data.zprice = (data.price * self.num).toFixed(2);
                        self.orderdata = data
                    } else {

                    }
                }).catch(err => { console.log(err)})
            
            // 获取地址
           var userSite = JSON.parse(this.$cookie.get('userSite'))
           if (userSite && userSite.uid == uid) {
               this.site = userSite 
           } else {
               this.$http.post('/mobile/Wxuser/useraddress_list', { uid: uid}).then(res => {
                    console.log(res)
                    if (res.code == 1) {
                        res.data.map(val => {
                            if (val.status == 2) {
                                self.site = val
                                self.$cookie.set('userSite', JSON.stringify(val), 1)
                            }
                        })
                    }
                })  
           }
            
        },
        
        getLength () {
            this.length = this.txt.length 
        },
        
        orderData () {  // 提交下单
            var self = this,
                uid = this.$cookie.get('userLogins');
                self.disabled = true
               var t = setTimeout(function () {
                    self.disabled = false
                    clearTimeout(t)
                }, 3000)
            if (!this.site) {
                this.$toast({
                    message: '请选择地址',
                    position: 'middle',
                    duration: 2000
                });
                return
            }
            if (!this.$isMoble) {
                this.$toast({
                    message: '请在手机微信端下单支付',
                    position: 'middle',
                    duration: 3000
                });
                return;
            }
            var obj = { addid: this.site.id, gid: this.orderdata.id, type: 1, remark: this.txt, uid: uid, doc_sid: this.orderdata.did, num: this.num };
            console.log(obj)
            self.$http.post('/mobile/Wxorder/sub_order', obj).then(res => {
                console.log(res)
                if (res.code == 1) {
                    var userSite = JSON.parse(self.$cookie.get('userSite'));
                    if (userSite && userSite.status == 1) {
                        self.$cookie.delete('userSite');
                    }
                    self.wxsjk(res.data) 
                    
                } else {
                    this.$toast({
                        message: res.msg,
                        position: 'middle',
                        duration: 2000
                    });
                }
            })
        },
        wxsjk (data) {
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
                            
                            self.ordertime = setTimeout(function () {
                                self.offorder(data)
                            }, 1000)
                            
                    } else {
                        Toast({
                            message: '支付失败！',
                            position: 'middle',
                            duration: 2000
                        });
                        setTimeout(function () {
                            self.$router.replace({name: 'addorderdetail', params: { id: data.number }})
                        }, 1500)
                    }
                    
                }); 
            };
            
        },
        offorder (data) {   // 查看订单是否支付
        var self = this;
            self.$http.post('/mobile/Wxorder/pay_result', {order_code: data.order_code }).then(res => {
                if (res.code == 1) {
                    Toast({
                        message: '支付成功！',
                        position: 'middle',
                        iconClass: 'iconfont icon-tipssuccess',
                        duration: 2000
                    });
                    self.$router.replace({ path: '/successOrder', query: { id: data.number }})
                    clearTimeout(self.ordertime)
                }
            })
        },
        selects (e) {    // 去选择地址
            var self = this;
            var id = this.$route.params.id
            if (self.$router) {
                self.$router.push({ path:'/oerdersites', query: { id: id }});
            } else {
                location.href = '/oerdersites?id='+ id
            }
            
        },  
    },
    beforeDestroy () {
        if (this.ordertime) {
            clearTimeout(this.ordertime)
        }
    }
}
</script>

<style lang="scss" scoped>
@function rem($px) {
    @return $px/ 50 + rem;
}
.doctororder {
    width: 100%;
    height: 100%;
    -webkit-display: flex;
    display: -webkit-flex;
    display: flex;
    -webkit-flex-direction: column;
    flex-direction: column;
    font-size: rem(16);
    .header {
        -webkit-display: flex;
        display: flex;
        height: rem(40);
        justify-content: center;
        color: #212121;
        position: relative;
        box-shadow:0px 1px 0px 0px rgba(224,224,224,.5);
        padding-top: rem(0);
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        font-size: rem(16);
        background: #fff;
        img {
            font-size: rem(30);
            position: absolute;
            left: rem(15);
            top: rem(10);
            line-height: 1;
            font-size: rem(19);
            width: rem(28);
            padding: rem(5);
            z-index: 99;
        }
        span {
            padding-top: rem(15);
            font-weight:400;
            color: #212121;
        }
    }
    .content {
        width: 100%;
        -webkit-flex:1;
        flex:1;
        overflow-y: scroll;
        .content_box {
            padding: 0 rem(15);
            .sites {
                width: 100%;
                box-shadow:0px 5px 10px 0px rgba(0, 0, 0, 0.1);
                border-radius: rem(4);
                margin-top: rem(6);
                padding: rem(15) rem(15) rem(13);
                background-color: #fff;
                .emptySite {
                    width: 100%;
                    overflow: hidden;
                    line-height: rem(30);
                    background-color: #fff;
                    border-color:#fff;
                    text-align: left;
                    -webkit-box-shadow: 0 0 0 0;
                    box-shadow:0 0 0 0;
                    cursor: pointer;
                    span {
                        color: #808080;
                        font-size: rem(12);
                    }
                    img {
                        display: block;
                        height: rem(30);
                        float: right;
                    }
                }
                .userdi {
                    width: 100%;
                    display:block;
                    background: #fff;
                    border:0;
                    text-align: left;
                    ul {
                        position: relative;
                        cursor: pointer;
                        z-index: inherit;
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
                            background: url('../../common/img/icon_dz.png') no-repeat rem(-5);
                            background-size: 9%;
                            padding-left: rem(17);
                            line-height: rem(17);
                            overflow: hidden;
                            text-overflow:ellipsis;
                            white-space: nowrap;
                        }
                        .right {
                            position: absolute;
                            right: rem(-10);
                            top: rem(10);
                            img {
                                width: rem(30);
                            }
                        }
                    }
                }
                
            }
            .orderList {
                width: 100%;
                padding: rem(10) rem(15) rem(15);
                box-shadow:0px rem(5) rem(10) 0px rgba(0, 0, 0, 0.1);
                border-radius: rem(4);
                background: #fff;
                margin-top: rem(5);
                >h4 {
                    font-size:rem(14);
                    color: #333;
                    background: #fff url('../../common/img/icon_dpu.png') no-repeat 0;
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
                    -webkit-display: flex;
                    display: flex;
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
                    padding: rem(15);
                    font-size: rem(13);
                    font-weight:400;
                    position: relative;
                    label {
                        display: block;
                        color: #666;
                        margin-left: rem(3);
                    }
                    textarea {
                        resize: none;width: 100%;
                        height: rem(40);
                        margin-top: rem(10);
                        outline: none;
                        border:0;
                    }
                    .fixed {
                        position: absolute;
                        right:0;
                        bottom: 0;
                        color: #808080;
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
}
</style>

