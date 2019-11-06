
<template>
<!-- 绑定手机号 -->
    <div class="login dis_f flex-v">
        <div class="section flex1">
            <div class="msgs">
                <p class="txt">
                    请先绑定手机号，添加问诊人，成功后即可使用云医康平台服务！
                </p>
                <ul class="dis_f flex_i">
                    <li><img src="../../common/img/icon_bdsjh.png" alt="" />
                        <p>绑定手机号</p>
                    </li>
                    <li class="jian"><img src="../../common/img/icon_jt.png" alt="" /></li>
                    <li><img src="../../common/img/icon_tjjzr.png" alt="">
                        <p>添加问诊人</p>
                    </li>
                </ul>
            </div>
            <div class="phone">
                <input type="tel" v-model='phones' maxlength="11" placeholder="输入手机号码">
            </div>
            <div class="phoneMsg phone">
                <input type="number" v-model='verify' maxlength="6" placeholder="输入验证码">
                <span :class="{'Color_hei': isColor}" @click='timer'>{{ title }}</span>
            </div>
            <div class="btn" :style="{opacity:(isBtn ? '0.6' : '1')}" >
                <mt-button size="large" @click.native="handleClick" type="primary">下一步</mt-button>
            </div>
        </div>
        <p class="footer" v-show="hidShow">点击查看 <span @click="out('/agreement')">《云医康注册使用协议》</span></p>
    </div>
</template>

<script>
import { Toast } from 'mint-ui';
import { MessageBox } from 'mint-ui';
export default {
        data () {
            return {
                phones: '',             // 手机号
                verify: '',             // 验证码
                title: '获取验证码',
                noneclick: false,
                isColor: true,          // 验证码字体颜色
                isBtn: true,
                docmHeight: document.documentElement.clientHeight, // 默认屏幕高度
                showHeight: document.documentElement.clientHeight, // 实时屏幕高度
                hidShow: true, // 显示或者隐藏footer
            }
        },
        created () {
            var urldata = this.$route.query;
            var uids = this.$cookie.get('userLogins') 
            if (!uids || urldata.uid) {
                this.$cookie.set('userLogins', urldata.uid, 365)
            }
            this.initdata(urldata.uid)
        },
        updated () {
             if (this.phones && this.verify) {
                 this.isBtn = false
             } else {
                 this.isBtn = true
             }
        },
        mounted () {
            var vm = this
            window.onresize = () => {
            return (() => {
                vm.showHeight = document.body.clientHeight
            })()
            }
        },
        watch: {
            showHeight: function () {
                if (this.docmHeight > this.showHeight) {
                    this.hidShow = false
                } else {
                    this.hidShow = true
                }
            },
        },
        methods: {  
            initdata (id) {         // 检测是否认证了
                var self = this;
                self.$http.post('/mobile/wxauth/is_auth', { uid: id}).then(res => {
                    console.log(res)
                    if (res.code == 1) {
                        if (res.auth == 1) {
                            MessageBox.confirm('已成功绑定用户信息，返回公众号后点击左下方“我的医生”即可与医生在线沟通!', {showCancelButton: false, confirmButtonText: '确定并返回'}).then(action => {
                                self.wx_clocs()
                            });
                            return;
                        } 
                        if (res.auth == 2 ) {
                            self.$router.replace('/authentication')
                        }
                    }
                })
            },
            handleClick () {    // 提交
                var self = this;
                var isphone = /^1[3456789]\d{9}$/;
                if (!this.phones && !isphone.test(this.phones)) {
                    Toast({
                        message: '请输入正确手机号',
                        duration: 2000
                    });
                    return false;
                } 
                var isverify = /\d/;
                if (!isverify.test(this.verify)) {
                    Toast({
                        message: '请输入正确验证码',
                        duration: 2000
                    });
                    return false;
                } 
                var uid = this.$cookie.get('userLogins')
                var obj = { uid: uid, phone: this.phones, yzm: this.verify}
                console.log(obj)
                this.$http.post('/mobile/wxauth/bind_phone', obj).then(res => {         // 绑定手机号
                    console.log(res)
                    if (res.code == 1) {
                        self.$cookie.set('userLogins', res.uid, 365)
                        Toast({
                            message: '绑定成功',
                            iconClass: 'icon icon-success'
                        });
                        if (res.auth == 1) {
                            MessageBox.confirm('已认证用户信息，返回公众号后点击左下方“我的医生”即可与医生在线沟通!', {showCancelButton: false, closeOnClickModal: true, confirmButtonText: '确定并返回'}).then(action => {
                                self.wx_clocs()
                            });
                        } else {
                             setTimeout(() => {
                                if (self.$route.query.did) {
                                    self.out('/authentication?did='+self.$route.query.did)
                                } else {
                                    self.out('/authentication')
                                }
                            }, 1000)
                        }
                       
                    } else {
                        Toast({
                            message: res.msg,
                            duration: 2000
                        });
                    }
                })
            },
            timer () { // 获取验证码
                var isphone = /^1[3456789]\d{9}$/;
                if (!isphone.test(this.phones)) {
                    Toast({
                        message: '请输入正确的手机号',
                        duration: 2000
                    });
                    return false;
                } 
                if (this.noneclick) {
                    return false;
                } else {
                    var time = 60;
                    this.isColor = false;
                    this.title = "(60s)重获";
                    var _selt = this;
                    var settime = setInterval(function () {
                        if (!time) {
                            _selt.noneclick = false;
                            _selt.isColor = true;
                            _selt.title = "重新获取";
                            clearInterval(settime);
                            return;
                        }
                        _selt.noneclick = true;
                        time--;
                        _selt.isColor = false;
                        _selt.title = "(" + time + "s)重获";
                    }, 1000);
                    this.$http.post('/shv2/Alidayu/sendSMS', {telphone: this.phones}).then(res => {
                        console.log(res)
                    })
                    
                }
                
            },
            Return () { // 返回上一级
                this.$router.go(-1)
            },
            wx_clocs () {   // 返回公众号首页

                if(typeof WeixinJSBridge !== "undefined"){
                    WeixinJSBridge.call('closeWindow');
                    // parent.WeixinJSBridge.call('closeWindow');
                    // setTimeout('WeixinJSBridge.call("closeWindow")', 300);
                } else {
                    if (document.addEventListener) {
                        document.addEventListener('WeixinJSBridgeReady', function () {
                            WeixinJSBridge.call('closeWindow');
                        }, false)
                    } else if (document.attachEvent) {
                        document.attachEvent('WeixinJSBridgeReady', function () {
                            WeixinJSBridge.call('closeWindow');
                        })
                        document.attachEvent('onWeixinJSBridgeReady', function () {
                            WeixinJSBridge.call('closeWindow');
                        })
                    }
                     else if (navigator.userAgent.indexOf("MSIE") > 0) {  

                            if (navigator.userAgent.indexOf("MSIE 6.0") > 0) {  
                                window.opener = null; window.close();  
                            } else {  
                                window.open('', '_top'); window.top.close();  
                            }  
                    } else if (navigator.userAgent.indexOf("Firefox") > 0) {  
                        window.location.href = 'about:blank ';  
                    } else {  
                        window.opener = null;   
                        window.open('', '_self', '');  
                        window.close();  
                    }
                }
            }
        }
}
</script>

<style lang='scss' scoped>
@function rem($px) {
  @return $px / 50 + rem;
}
.login {
    width: 100%;
    height: 100%;
    font-size: rem(16);
    .section {
        width: 100%;
        background-color: #fff;
        .msgs {
            width: 100%;
            padding: rem(6) rem(15);
            p.txt {
                padding: rem(13) rem(12);
                background:rgba(74,156,243,0.15);
                color: #4A9CF3;
                font-size: rem(12);
                line-height: rem(18);
            }
            ul {
                width: 100%;
                height: rem(100);
                padding: rem(17) rem(20) 0;
                li {
                   width: 33%;
                   text-align: center;
                   font-size: rem(12);
                    img {
                        width: rem(35);
                        height: rem(35);
                    }
                    p {
                        margin-top: rem(10);
                        color: #666;
                    }
                }
                li:first-child {
                    p {
                        color: #5AABFF;
                    }
                }
                .jian {
                    margin-top: rem(-20);
                    img {
                        width: rem(52);
                        height: rem(9);
                    }
                }
            }
        }
        .phone {
        width: rem(333);
        height: rem(46);
        border: 1px solid #E4E9F4;
        display: block;
        margin: 0 auto;
        text-align: center;
        
        input {
            width: 100%;
            height: 100%;
            display: block;
            border:0;
            outline: none;
            font-size: rem(14);
            padding-left: rem(16);
            height: 95%;
            color: #333333;
        }
        
    }
    .phoneMsg {
        margin-top: rem(16);
        padding: 0;
        display: flex;
        align-items: center;
        position: relative;
        input {
            width: 70%;
            height: 100%;
            display: block;
        }
        input::-webkit-outer-spin-button,            
        input::-webkit-inner-spin-button{                
            -webkit-appearance: none !important;            
        }
        input[type=number]{
            -moz-appearance:textfield;
        }
        
        span {
            position: absolute;
            right: rem(29);
            font-size: rem(12);
            border-left: 1px solid #9FA4AF;
            color: #9FA4AF;
            line-height: rem(15);
            padding:0 rem(16);
        }
        .Color_hei {
            color: #333;
        }
    }
    .btn {
        margin-top: rem(46);
        text-align: center;
        padding: 0 rem(56);
        button {
            border-radius: rem(21);
            font-size:rem(14);
            font-weight:400;
            background-color: #6194F7;
        }
    }
    }
    .footer {
        width: 100%;
        text-align: center;
        color: #666;
        font-size: rem(11);
        margin-bottom: rem(20);
        span {
            color: #3196FF;
        }
    }
}
</style>
