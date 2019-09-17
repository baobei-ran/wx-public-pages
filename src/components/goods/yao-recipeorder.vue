<template>
    <!-- 推荐药品下单 -->
    <div class="recipeorder dis_f flex_c">
        <div class="contents flex1" v-show='mySatus'>
            <div class="contents-box">
               <div class="head" v-if='yaoStatus || yaoStatus2'>
                   <div>
                       <h2>
                            配送方式：
                            <span class="F-r">
                                <ul class="dis_f">
                                    <li :class="{'blue':isWay == 1}" @click="clickWay(1)">门店自提</li>
                                    <li :class="{'blue':isWay == 2}" @click="clickWay2(2)">快递发货</li>
                                </ul>
                            </span>
                        </h2>
                        <p v-show="isWay == 1">
                            <span @click="handleShopmsg">查看门店信息</span>
                        </p>
                        <div class="sites" v-show="isWay == 2">
                            <ul class="site-hint" @click="choosesSite" v-show="!userSite">
                                <li>请选择地址</li>
                            </ul>
                            <ul @click="choosesSite" class="site-msg" v-show="userSite">
                                <li><span>{{ userSite.name }}</span> <span>{{ userSite.phone }}</span></li>
                                <li>{{ userSite.province }} {{userSite.city}} {{userSite.county}} {{userSite.address}}</li>
                            </ul>
                        </div>
                   </div>
               </div>
               <div class="section">
                   <!-- 推荐首次购买 -->
                   <div class="recipe-content" v-if='yaoStatus'>
                        <h3>{{ recipedata.hname }}</h3>
                        <div class="drug">
                            <ul v-for='(val, i) in recipedata.docsuggestdrug' :key='i'>
                                <li class="dis_f">
                                    <img :src="$http.baseURL+val.pic" alt="" />
                                    <dl class="flex1">
                                        <dt class='dis_f dis_sb'>
                                            <p><span>{{ val.name }}</span><b v-show="val.gg">({{val.gg}})</b></p>
                                            <span class="F-r">￥{{ val.money }}</span>
                                        </dt>
                                        <dd>
                                            <b>{{ val.gc }}</b> 
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
                                    ￥{{ drugmoney }}
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
                                    ￥<b>{{ zmoney }}</b>
                                </span>
                            </p>
                        </div>
                    </div>
                    <!-- <ul class="order-number">
                        <li>订单编号：<span>1231232434343</span></li>
                        <li>创建时间：<span>2019-02-22 12:00</span></li>
                    </ul> -->
                    <!-- 再次购买信息 -->
                    <div class="recipe-content" v-if='yaoStatus2'>
                        <h3>{{ druginfo.type_name }}</h3>
                        <div class="drug">
                            <ul v-for='(val, i) in drugdata' :key='i'>
                                <li class="dis_f">
                                    <img :src="$http.baseURL+val.pic" alt="" />
                                    <dl class="flex1">
                                        <dt>
                                            <p><span>{{ val.name }}</span><b v-show="val.gg">({{val.gg}})</b></p>
                                            <span class="F-r">￥{{ val.money }}</span>
                                        </dt>
                                        <dd>
                                            <b>{{ val.company }}</b> 
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
                                    ￥{{ druginfo.money }}
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
                                    ￥<b>{{ druginfo.money }}</b>
                                </span>
                            </p>
                        </div>
                    </div>
               </div>
                
            </div>
        </div>
        
        <div class="footer dis_f" v-if="yaoStatus"> <!--首次-->
            <span>
                <span>总计：<b>￥<b>{{ zmoney }}</b></b></span>
            </span>
            <span>
                <mt-button @click.native="submitOrder">提交订单</mt-button>
            </span>
        </div>

        <div class="footer dis_f" v-if="yaoStatus2"> <!-- 再次购买 -->
            <span>
                <span>总计：<b>￥<b>{{ druginfo.money }}</b></b></span>
            </span>
            <span>
                <mt-button @click.native="submitOrder2">提交订单</mt-button>
            </span>
        </div>

        <div class="my_on" v-show="!mySatus">
            此处方药品不支持再次购买
        </div>
        <mt-popup style="width: 100%;"
        v-model="popupVisible"
        position="bottom">
            <div class="popuop-box" >
               <dl class="dis_f">
                   <dt>
                       <img :src="drugstoredata.picture?$http.baseURL+drugstoredata.picture:''" alt="" />
                   </dt>
                   <dd class="flex1">
                       <p><img @click="handleShopmsg" src="../../common/img/icon_qx@2x.png" alt="" /></p>
                       <h2>{{ drugstoredata.hospital_name }}</h2>
                   </dd>
               </dl>
               <ul>
                   <li class="dis_f" v-show="drugstoredata.ktime"><span class="bg-img1">营业时间：</span><span>{{ drugstoredata.ktime }}--{{ drugstoredata.jtime }}</span></li>
                   <li class="dis_f"><span class="bg-img2">联系电话：</span><span>{{ drugstoredata.telephone }}</span></li>
                   <li class="dis_f"><span class="bg-img3">药店地址：</span><span>{{ drugstoredata.dz }}</span></li>
               </ul>
            </div>
        </mt-popup>
    </div>
</template>

<script>
export default {
    name: 'yaorecipeorder',
    data () {
        return {
            mySatus: true,  // box 
            uid: this.$cookie.get('userLogins'),
            isWay: 1,
            popupVisible: false,
            userSite: '',           // 收货地址
            drugstoredata: {},      // 门店信息
            recipedata: {},
            drugmoney: 0,
            zmoney: 0,
            drugdata: [],    // 再次购买药品信息
            druginfo: '',    // 再次购买信息
            yaoStatus: false, // 首次状态
            yaoStatus2: false, // 再次购买状态
            order_code: '',         // 发起支付获取订单号
            number: '',             //  发起支付的订单

        }
    },
    mounted () {
        if (this.$route.query.number) {
            this.conemorebuy()
        } else {
            this.initdata();
        }
    },
    methods: {
        drugstoreInfo (hid) {   // 获取药店信息
             var self = this;
            this.$http.post('/mobile/Wxpatient/hos_data',  { id: hid }).then(res => { 
                console.log(res)
                if (res.code == 1) {
                    self.drugstoredata = res.data
                }
            })
        },
        initdata () {
            var self = this;
            this.$http.post('/mobile/wxorder/doc_push', { rid: this.$route.query.rid }).then(res => {
                console.log(res)
                if (res.code == 1) {
                    self.yaoStatus = true;
                    self.recipedata = res.data[0];
                    self.isWay = self.recipedata.type;
                    if (self.isWay == 2) {
                        self.getSite();
                    } else {
                        self.drugstoreInfo(self.recipedata.hid)
                    }
                    var money = 0
                    self.recipedata.docsuggestdrug.map(val => {
                        var q = Number(val.money) * val.num
                        money += q
                    })
                    console.log(money)
                    self.drugmoney = money.toFixed(2)
                    self.zmoney = self.drugmoney
                }
            })
        },
        getSite () {  // 获取地址
            var self = this;
            var userSite = JSON.parse(this.$cookie.get('userSite'))
            if (userSite && userSite.uid == this.uid) {
                this.userSite = userSite 
            } else {
                this.$http.post('/mobile/Wxuser/useraddress_list', { uid: this.uid}).then(res => {
                    if (res.code == 1) {
                        res.data.map(val => {
                            if (val.status == 2) {
                                self.userSite = val
                                self.$cookie.set('userSite', JSON.stringify(val), 1)
                            }
                        })
                    }
                })  
            }
        },
        submitOrder () {  // 提交
            var self = this;
            var type;
            if (self.recipedata.type == 1) {
                type = 2
            } else {
                type = 1
            }
            if (self.recipedata.type == 2 && self.userSite == '') {
                self.$toast({
                    message: '请选择收货地址',
                    position: 'middle',
                    duration: 2000
                });
                return;
            }
            var druglist = this.recipedata.docsuggestdrug;
            var obj = { data: druglist, uid: this.uid, hid: self.recipedata.hid, rid: self.recipedata.id, did:self.recipedata.did, type: type, state: type, addid: this.userSite.id  }
            console.log(obj)
            self.$http.axios('/mobile/wxorder/doc_drug_idea', obj).then(res => {
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
                self.$toast({
                    message: '服务器错误，无法支付',
                    position: 'middle',
                    duration: 2000
                });
                console.log(err)
            })
        },
        handleShopmsg () {
           this.popupVisible = !this.popupVisible
        },
        clickWay (number) {
            if (this.isWay == number) {
                
            } else {
                this.$toast({
                    message: '医生店铺药品，暂不支持自提',
                    position: 'middle',
                    duration: 3000
                })
            }
        },
        clickWay2 (number) {
            if (this.isWay == number) {
                
            } else {
                this.$toast({
                    message: '药店药品，暂不支持快递服务',
                    position: 'middle',
                    duration: 3000
                })
            }
        },
        choosesSite () { // 去选择地址
            var self = this;
            self.$router.push({ path:'/oerdersites'});
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
                function(res) {
                   WeixinJSBridge.log(res.err_msg);
                    if(res.err_msg == "get_brand_wcpay_request:ok"){
                       var time = setTimeout(() => {
                            self.$http.post('/mobile/wxorder/doc_drug_se',{order_code: self.order_code}).then(res => {
                                console.log(res)
                                if (res.code == 1) {
                                    self.$router.push({path:'/drugpaysuccess', query: {type: res.data.type, code: res.data.code, number: self.number }})
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
                            if (self.recipedata.type == 1) {
                                self.$router.replace({path: '/orderdetails', query: { id: self.number }})   // 药店自提详情
                            } else {
                                self.$router.replace({ name: 'addorderdetail', params: { id: self.number }}) // 店铺未支付详情
                            }
                            clearTimeout(t)
                        }, 1000)
                    }
                    
                }); 
            };
            
        },
/////////////////////////////////////////////////////////////////////
        conemorebuy () { // 自提再次购买 信息
            var self = this;
            this.$http.post('/mobile/wxorder/will_call_add', { number: this.$route.query.number }).then(res => {
                console.log(res)
                if (res.code == 1) {
                    self.yaoStatus2 = true;
                    self.drugdata = res.data;
                    self.druginfo = res.list;
                    self.isWay = res.list.type
                    self.drugstoreInfo(res.data.list.hid)
                } else if (res.code == 4) {
                    this.mySatus = false;

                }
            })
        },
        submitOrder2 () {  // 再次购买提交按钮
            var self = this;
            var obj = { data: self.drugdata, uid: self.uid, hid: self.druginfo.hid, rid: self.druginfo.id, did:self.druginfo.did, type: self.druginfo.type, state: self.druginfo.type, addid: this.userSite.id  }
            console.log(obj)
            self.$http.axios('/mobile/wxorder/doc_drug_idea', obj).then(res => {
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
        }
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
    .my_on {
        width: 100%;
        text-align: center;
        margin-top: rem(20);
        color: red;
        font-size: rem(14);
    }
    .contents {
        width: 100%;
        overflow-y: scroll;
        .contents-box {
            .head {
                width: 100%;
                padding: rem(15);
               >div {
                   background-color: #fff;
                   padding:0 rem(15);
                   border-radius: 4px;
                    h2 {
                        padding: rem(15) 0;
                        border-bottom: 1px solid #EEEEEE;
                        overflow: hidden;
                        span {
                           ul {
                               width: rem(121);
                               height: rem(25);
                               border: 1px solid #CCC;
                               border-radius:13px;
                               li {
                                   width: rem(60);
                                   font-size: rem(12);
                                   color: #AAA;
                                   line-height: rem(25);
                                   text-align: center;
                                   cursor: pointer;
                               }
                               .blue {
                                   background-color: #469AF4;
                                   color: #FFF;
                                   border-radius:13px;
                               }
                           }
                        }
                    }
                    p {
                        padding: rem(15) 0;
                        font-size: rem(12);
                        color: #009BFB;
                        span {
                            padding-left: rem(20);
                            background: url('../../common/img/icon_ckmd@2x.png') no-repeat left center;
                            background-size: 16%;
                            cursor: pointer;
                        }
                    }
                    .sites {
                        width: 100%;
                        padding: rem(15) 0;
                        .site-hint {
                            li {
                                color: #666;
                            }
                        }
                        .site-msg {
                            li {
                                padding-left: rem(22);
                                line-height: rem(17);
                                font-size: rem(12);
                                span:last-child {
                                    color: #666;
                                }
                            }
                            li:last-child {
                                background: url('../../common/img/icon_dz.png') no-repeat left center;
                                background-size: 8%;
                                margin-top: rem(11);
                            }
                        }
                    }
               }
            }
            .section {
                padding: rem(15);
                padding-top: 0;
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
                                        width: 100%;
                                       >p {
                                            width: 80%;
                                            > b {
                                                font-size: rem(12);
                                                margin-left: 5px;
                                            }
                                        }
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

    .popuop-box {
        width: 100%;
        padding: rem(15);
        dl {
            dt {
                width: rem(72);
                height: rem(72);
                img {
                    width: rem(72);
                    height: rem(72);
                }
            }
            dd {
                padding-left: rem(9);
                p {
                    height: rem(35);
                    text-align: right;
                    img {
                        width: rem(34);
                        padding: rem(5);
                    }
                }
                h2 {
                    width: 80%;
                    font-size: rem(15);
                    color: #333;
                    line-height: rem(20);
                }
            }
        }
        ul {
            padding-bottom: rem(73);
            li {
                padding-top: rem(16);
                span {
                    font-size: rem(14);
                    color: #333;
                    display: block;
                }
                span:first-child {
                    width: rem(95);
                    padding-left: rem(21);
                    color: #808080;
                    height: rem(20);
                    line-height: rem(20);
                }
                span:last-child {
                    width: 75%;
                    line-height: rem(20);
                }
                .bg-img1 {
                    background: url('../../common/img/icon_yysj@2x.png') no-repeat left center;
                    background-size: 20%;
                }
                .bg-img2 {
                    background: url('../../common/img/icon_lxdh@2x.png') no-repeat left center;
                    background-size: 20%;
                }
                .bg-img3 {
                    background: url('../../common/img/icon-yddz@2x.png') no-repeat left center;
                    background-size: 20%;
                }
            }
        }
    }
}
</style>

