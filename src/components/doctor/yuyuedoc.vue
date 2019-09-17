<template>
    <!-- 预约信息 -->
    <div class="docrecommend dis_f flex_c">
        <div class="section flex1">
            <div class="section_box">
                <p class="title">已为您锁定号源，请在15:00分钟内支付</p>
                <ul class="user_msg">
                    <li>
                        <span>就诊人员：</span>
                        <span class="right" @click='gethander' v-show='!user_val'>请选择 <i class="iconfont icon-iconfontjiantou2"></i></span>
                        <span class="right" @click='gethander' v-show='user_val'>{{ user_val.real_name }} <i class="iconfont icon-iconfontjiantou2"></i></span>
                    </li>
                    <li>
                        <h4>病情描述：</h4>
                        <textarea maxlength="200" v-model='txt_area' placeholder="输入你的病情描述，方便医生进一步了解你的病情"></textarea>
                    </li>
                </ul>
                <ol class="doc_msg">
                    <li><span>医生信息</span><span>{{ docMsg.true_name }}</span></li>
                    <li><span>就诊地址</span><span>{{ docMsg.address }}</span></li>
                    <li><span>就诊科室</span><span>{{ docMsg.dep_name }}</span></li>
                    <li><span>预约时间</span><span>{{ day | Times }} {{ day_time }}</span></li>
                    <li><span>预约类型</span><span v-text='docMsg.type == 1? "普通门诊" : "专家门诊"'></span></li>
                    <li><span>费用金额</span><span>{{ docMsg.money }}元</span></li>
                </ol>
            </div>
        </div>
        <div class="footer">
            <mt-button type="primary" :disabled='disabled' @click.native='handerdoctor'>预约{{ docMsg.true_name }}医生</mt-button>
        </div>
    </div>
</template>

<script>
export default {
    name: 'yuyueMsg',
    data () {
        return {
            docMsg: {},
            uid: this.$cookie.get('userLogins'),    // 用户id
            day: this.$route.query.day,
            TimeInterval: ['上午 8:00-12:00', '下午 13:00-18:00', '晚上 18:00-24:00'], 
            day_time: '',
            user_val: '',
            txt_area: '',
            rid: '',
            disabled: false
        }
    },
    mounted() {
        // console.log(this.$route.query)
        var self = this;
        this.initdata()
        var Val = JSON.parse(this.$cookie.get('administrationVal'));
        console.log(Val)
        if (Val) {
            this.user_val = Val
        } else {
            this.$http.post('/mobile/Wxpatient/index', {uid: this.uid}).then(function (res) {
                console.log(res)
                if (res.code == 1) {
                    res.data.map(function (v) {
                        if (v.type == 1) {
                            self.user_val = v
                            self.$cookie.set('administrationVal', JSON.stringify(v))
                        }
                    })
                }
            })
        }
       
    },
    beforeRouteLeave (to, from, next) {  // 离开页面事件，使用了组件导航守卫
        var self = this;
        if(to.name == 'doctordetail') {
            this.$messagebox.confirm('<p style="color: #333;">返回后当前号段不在为你保留<br />确定放弃吗?</p>', '').then(action => {
                self.$http.post('/mobile/Wxregistration/non_payment_cancel', {rid: self.$route.query.order_code, type: 2}).then(res => {
                    console.log(res)
                    if (res.code == 1) {
                        next()
                    } else {
                        this.$toast({
                            message: '订单无法取消',
                            position: 'middle',
                            duration: 2000
                        });
                        window.history.pushState( null, null, document.url)
                        next(from.fullPath)
                    }
                })
                
            }).catch(cancel => { 
                window.history.pushState( null, null, document.url)
                next(from.fullPath)
            })
        } else {
            next()
        }
        
    },
    destroyed () {
        var self = this;
        var Val = JSON.parse(self.$cookie.get('administrationVal'));
        console.log(Val)
            if(Val && Val.type !== 1) {
                self.$cookie.delete('administrationVal');
            }
        this.$messagebox.close();
    },
    methods: {
        initdata () {
            var self = this;
            var did = this.$route.query.did,   // 医生 id
                day = this.$route.query.day,
                time = this.$route.query.time
            var obj = {did:did, day:day, time: time}
            self.$http.post('/mobile/Wxregistration/info', obj).then(res => {
                console.log(res)
                if (res.code == 1) {
                    self.docMsg = res.data
                    self.day_time = self.TimeInterval[(time - 1)]
                }
            })
        },
        handerdoctor: function () {  // 预约微信支付
            if(this.user_val == '') {
                this.$toast({
                    message: '请选择就诊人员',
                    position: 'middle',
                    duration: 2000
                });
                return;
            }
            if(this.txt_area == '') {
                this.$toast({
                    message: '请填写病情描述',
                    position: 'middle',
                    duration: 2000
                });
                return;
            }
            var self = this,
                order_code = this.$route.query.order_code,
                obj = { cid: self.user_val.id , disease: self.txt_area, order_code:order_code };
               console.log(obj)
               self.disabled = true;
            self.$http.post('/mobile/Wxregistration/registration', obj).then(res => {
                console.log(res)
                var t = setTimeout(() => {
                    self.disabled = false
                    clearTimeout(t)
                }, 2000)
                if (res.code == 1) {
                    self.rid = res.data.rid
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
        gethander: function () {  // 获取 就诊人员
            this.out('/getAdministration')
        },
         wxsjk: function (data) {
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
                            var Val = JSON.parse(self.$cookie.get('administrationVal'));
                            if(Val && Val.type !== 1) {
                                self.$cookie.delete('administrationVal');
                            }

                            self.$router.replace({path: '/wxpaySucceed', query: { rid: self.rid }})
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
.docrecommend {
    width: 100%;
    height: 100%;
    font-size: rem(14);
    background-color: #F4F4F4;
    .section {
        width: 100%;
        .section_box {
            width: 100%;
            .title {
                width: 100%;
                background:rgba(240,159,136,.1);
                color: #F09F88;
                height: rem(39);
                line-height: rem(39);
                font-size: rem(12);
                padding: 0 rem(15);
            }
            .user_msg {
                width: 100%;
                padding-left: rem(15);
                background-color: #FFF;
                li:first-child {
                    padding: rem(15) rem(15) rem(15) 0;
                    border-bottom: 1px solid #E0E0E0;
                    > span {
                        color: #808080;
                        font-size: rem(15);
                        line-height: rem(23);
                    }
                    .right {
                        float: right;
                        color: #333;
                       > i {
                            color: #808080;
                        }
                    }
                }
                li:last-child {
                    padding: rem(15) rem(15) rem(15) 0;
                    background: #FFF;
                    h4 {
                        margin-bottom: rem(15);
                        color: #808080;
                        font-size: rem(14);
                    }
                    textarea {
                        width: 100%;
                        height: rem(80);
                        resize: none;
                        border: 1px solid #E0E0E0;
                        background-color: #F9F9F9;
                        padding: rem(11);
                        font-size: rem(13);
                    }
                }
            }
            .doc_msg {
                width: 100%;
                margin-top: rem(10);
                background-color: #fff;
                padding: rem(20) rem(16);
                li {
                    margin-top: rem(20);
                    font-size: rem(14);
                    overflow: hidden;
                    span {
                        display: block;
                        float: left;
                        line-height: rem(18);
                    }
                    > span:first-child {
                        color: #808080;
                        width: 22%;
                    }
                    > span:last-child {
                        color: #212121;
                        width: 76%;
                    }
                }
                li:first-child {
                    margin: 0;
                }
            }
        }
    }
    .footer {
        width: 100%;
        height: rem(49);
        button {
            width: 100%;
            height: 100%;
            background-color: #469AF4;
            color: #fff;
            font-size: rem(16);
        }
    }
}
</style>
