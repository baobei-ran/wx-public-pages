<template>
<!-- 再次购买下单 -->
    <div class="doctororder">
        <!-- <div class="header">
            <img @click='Return' src="../../../common/img/icon_fh.png" alt="">
            <span>下单详情</span>
        </div> -->
        <main class="content">
            <div class="content_box" > 
                <div class="site" @click='outSites($event)' >
                    <div class="emptySite"  v-if='!site'>
                        <span>你还没有地址，去添加地址</span><img src="../../../common/img/icon_enter.png" alt="">
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
                                <img src="../../../common/img/icon_enter.png" alt="">
                            </li>
                        </ul>
                    </div>
                    <!-- <ul @click='outSite' >
                        <li class="user">
                            <span>{{ orderdata.gname }}</span> <span>{{ orderdata.phone }}</span>
                        </li>
                        <li class="dizhi">
                            {{ orderdata.address }}
                        </li>
                        <li class="right">
                            <img src="../../../common/img/icon_enter.png" alt="">
                        </li>
                    </ul> -->
                </div>

                <div class="orderList">
                    <h4>{{ orderdata.sname }}的店铺 <img src="../../../common/img/icon_enter.png" alt=""></h4>
                    <dl class="order_con">
                        <dt><img :src="$http.baseURL+orderdata.img" alt=""></dt>
                        <dd>
                            <h5>{{ orderdata.name }}</h5>
                            <span>￥{{ orderdata.money }}</span>
                            <p>x{{ orderdata.num }}</p>
                        </dd>
                    </dl>
                    <ul class="goods">
                        <li><span>配送方式</span>
                            <span v-if='orderdata.type == 1'>快递</span>
                            <span v-if='orderdata.type == 2'>自提 </span>
                        </li>
                        <li><span>商品总额</span><span>￥{{ orderdata.moneys }}</span></li>
                        <li><span>运费</span><span>￥{{ orderdata.postage }}</span></li>
                    </ul>
                    <div class="usermsg">
                        <label for="">买家留言</label>
                        <textarea name="" v-model='txt' @input='getLength' maxlength="200" placeholder="请填写备注信息"></textarea>
                        <span class="fixed"><i>{{ length }}</i>/<i>200</i></span>
                    </div>
                </div>
            </div>
        </main>
        <div class="footer" v-show="hidShow">
            <div><span>总计：</span><span>￥{{ orderdata.moneys }}</span></div>
            <mt-button type="primary" @click.native='orderData'>提交订单</mt-button>
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
            docmHeight: document.documentElement.clientHeight, // 默认屏幕高度
            showHeight: document.documentElement.clientHeight, // 实时屏幕高度
            hidShow: true, // 显示或者隐藏footer
        }
    },
    mounted () {
        console.log(this.$route)
        this.initsite()
        var vm = this
        // window.resize监听页面高度的变化
        window.onresize = () => {
        return (() => {
            vm.showHeight = document.body.clientHeight
        })()
        }
        if (window.history && window.history.pushState) {
            window.addEventListener('popstate', vm.close, false)
        }
    },
    destroyed () {
        var vm = this;
        setTimeout(() => {
            window.removeEventListener('popstate', vm.close, false)
        }, 0)
    },
    watch: {
    showHeight: function () {
      if (this.docmHeight > this.showHeight) {
        this.hidShow = false
      } else {
        this.hidShow = true
      }
    },
    '$route' : 'outSites'
  },
    methods: {
        close () {
             var userSite = JSON.parse(this.$cookie.get('userSite'));
            if (userSite && userSite.status == 1) {
                this.$cookie.delete('userSite');
            }
        },
        initsite () {
            var self = this,
                uid = this.$cookie.get('userLogins');
                var id = this.$route.params.id
                var self = this;
                self.$http.post('/mobile/Wxorder/again_goods', { number: id}).then(res => {
                    console.log(res)
                    if (res.code == 1) {
                        self.orderdata = res.data
                    }
                })
             


            var userSite = JSON.parse(this.$cookie.get('userSite'))
            console.log(userSite)
           if (userSite && userSite.uid == uid ) {
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



            // this.$http.post('/mobile/Wxuser/useraddress_list', { uid: uid}).then(res => {
            //     console.log(res)
            //     if (res.code == 1) {
            //         self.huan = res.data
            //     }
            // })  

            // setTimeout(() => {
            //     if (self.huan.length > 0) {
            //         var userSite = JSON.parse(this.$cookie.get('userSite'))
            //             self.huan.map(val => {
            //                 if (userSite && userSite.id == val.id && userSite.uid == uid ) {
            //                     this.site = userSite 
            //                 } else if (val.status == 2) {
            //                     this.site = val
            //                 }
            //             })
                    
            //    }
            // }, 300)
           
        },
        Return () {
            this.$router.go(-1)
            var userSite = JSON.parse(this.$cookie.get('userSite'));
            if (userSite && userSite.status == 1) {
                this.$cookie.delete('userSite');
            }
        },
        getLength () {
            this.length = this.txt.length
        },
        orderData () {  // 提交下单
            var self = this,
                uid = this.$cookie.get('userLogins');
            var obj = { addid: this.site.id, gid: this.orderdata.gid, type: this.orderdata.type, remark: this.txt, uid: uid, doc_sid: this.orderdata.doc_sid, num: this.orderdata.num };
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
                    Toast({
                        message: res.msg,
                        position: 'middle',
                        duration: 2000
                    });
                }
            })
        },
        wxsjk (data) {  // 调取微信支付功能
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
                        "appId": data.appId,     //公众号名称，由商户传入     
                        "timeStamp": data.timeStamp,         //时间戳，自1970年以来的秒数     
                        "nonceStr": data.nonceStr, //随机串     
                        "package": data.package,     
                        "signType": data.signType,         //微信签名方式：     
                        "paySign": data.paySign //微信签名 
                    },
                function(res){
                  
                    if(res.err_msg == "get_brand_wcpay_request:ok"){
                    // 使用以上方式判断前端返回,微信团队郑重提示：
                            //res.err_msg将在用户支付成功后返回ok，但并不保证它绝对可靠。
                            
                       var times = setTimeout(function () {
                            self.$http.post('/mobile/Wxorder/pay_result', {order_code: data.order_code }).then(res => { // 查询是否支付成功
                                if (res.code == 1) {
                                    Toast({
                                        message: '支付成功！',
                                        position: 'middle',
                                        iconClass: 'iconfont icon-tipssuccess',
                                        duration: 2000
                                    });
                                   var time = setTimeout(function () {
                                        self.$router.replace({path: '/successOrder', query: { id: data.number }})
                                        clearTimeout(time)
                                    }, 1500)
                                }
                            })
                            cleraInterval(times)
                        }, 500)
                       
                    } else {
                        Toast({
                            message: '支付失败！',
                            position: 'middle',
                            duration: 1500
                        });
                        setTimeout(function () {
                            self.$router.replace({name: 'addorderdetail', params: { id: data.number }})
                        }, 1000)
                    }
                    
                }); 
            };
            
        },

        outSites (e) {    // 去选择地址
            console.log(e)
            var self = this;
            var id = this.$route.params.id
            if (self.$router) {
                self.$router.push({ path:'/setorder', query: { id: id }});
            } else {
                window.location.href = '/setorder?id='+ id
            }
            // this.$router.push({ name:'setorder', params: { id: this.$route.params.id }});
        },  
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
        overflow: auto;
        .content_box {
            padding: 0 rem(15);
            .site {
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
                    border:0;
                    ul {
                        position: relative;
                        z-index: 0;

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
                padding: rem(15);
                margin-top: rem(5);
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
                        margin-left: rem(2);
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
            display: flex;
            align-items: center;
            padding-right: rem(15);
            color: #333;
            font-weight:400;
            span {
                color: #F09F88;
                display: inline-block;
                min-width: rem(50);
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

