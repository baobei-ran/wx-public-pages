<template>
    <!-- 影像查询详情 -->
    <div class="electronicImage dis_f flex-v">
        <div class="electronicImage-box flex1">
            <div class="electronicImage-box-content">
                <!-- 无内容展示 -->
                <div class="content-empty" v-show="isView">
                        <img src="../../common/img/pic_zwyx@2x.png" alt="" />
                        <p><span v-show='false' class="color_blue">就诊人李大牛</span>暂无影像资料</p>
                        <div><mt-button @click.native="handleCheckImg">查看影像示例</mt-button></div>
                    </div>
                <!-- 内容 -->
                <div class="content-wrap" v-show="isViewUser">
                    <div class="head-msg">查询到以下就诊人的电子影像</div>
                    <div class="content-wrap-user" v-for="(val,i) in imageList" :key='i'>
                        <div class="user-info bg-f">
                            <h1>
                                {{ val.patient_name }}
                                <b>|</b>
                                {{ val.patient_sex == 'F'?"女": "男" }}
                                <b>|</b>
                                {{ val.age }}
                            </h1>
                            <div class="user-pic">
                                <img src="../../common/img/pic_wdys_ystx.png" alt="" />
                            </div>
                        </div> 
                        <div class="ul-border bg-f">
                            <ul>
                                <h2>{{ val.hospital }}的影像资料 <b v-show='val.image_type == 2'>(支付后查看)</b></h2>
                                <li>
                                    <span>检查类型</span>
                                    <span class="Color-black" v-text='val.exam_class'>彩超</span>
                                </li>
                                <li>
                                    <span>检查时间</span>
                                    <span class="Color-black">{{ val.exam_datetime }}</span>
                                    <!--  -->
                                    <div v-show='val.image_type == 2'>
                                        <mt-button class="bg-f" @click.native="handleClickBuy(val)">支付查看</mt-button>
                                    </div>
                                    <!--  -->
                                    <div v-show='val.image_type == 1'>
                                        <mt-button class="bg-f" @click.native="handleClickLookOver(val.yx_url)">立即查看</mt-button>
                                        <mt-button class="bg-f SpecialistCheck" @click.native="handleSpecialistCheck(val.exam_id, val.idcard)">专家阅片</mt-button>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>

export default {
    data () {
        return {
            isViewUser: false,                      // 数据展示
            isView: false,                          // 无数据展示
            popupVisible: false,
            imageList: [],                          // 数据
            uid: this.$cookie.get('userLogins'),    // 用户uid
            order_code: '',                         // 订单号
            yx_url: '',                             // 支付成功跳转链接
            idcard: this.$route.query.idcard,       // 身份证号
        }
    },
    mounted () {
       this.initdata()
    },
    methods: {
        handleCheckImg () { // 查看影像
            // window.location.href = 'http://wechat.client.pacsonline.cn/index_yyk.html#/reportInfo/report?license=c57f12f695585bacb79de89030beedf8&exam_id=116bf91d37e95c60';
            window.location.href = 'http://wechat.client.pacsonline.cn/index_yyk.html#/reportInfo/report?license=c57f12f695585bacb79de89030beedf8&exam_id=8f0d2411134615e9';
        },
        initdata () {
            var self = this;
            self.$http.post('/mobile/WxSeeImage/see_present_idcard_image', { userid: this.uid, idcard: self.idcard }).then(res => {
                console.log(res)
                if (res.code == 1) {
                    self.imageList = res.data;
                    self.isView = false;
                    self.isViewUser = true;
                    if (res.data.length <= 0) {
                        self.imageList = [];
                        self.isViewUser = false;
                        self.isView = true;
                    }
                } else {
                    self.imageList = [];
                    self.isViewUser = false;
                    self.isView = true;
                }
            })
        },
        handleClickLookOver(url) { // 立即查看
            console.log(url)
            window.location.href = url
        },
        handleSpecialistCheck(imgid, idcard) {   // 专家阅片
            console.log(imgid, idcard)
            this.out('/searchDocPicServer?examid='+imgid+'&idcard='+idcard)
        },
        
        handleClickBuy (v) { // 支付查看
            this.$router.push('/buyImage?uid='+this.uid);
            this.$cookie.set('BuyImage', JSON.stringify(v), 1);
            // var self = this;
            // this.yx_url = v.yx_url;
            // this.$http.post('/mobile/WxSeeImage/see_one_image', { userid: this.uid, hospital_name: v.hospital , exam_id: v.exam_id  }).then(res => {
            //     console.log(res)
            //     if (res.code == 0) {
            //         var sex = v.patient_sex == 'F'? '女':'男';
            //         var msg ='<ul style="color:#333;padding-left:0.4rem;"><li><span style="display: inline-block;width: 30%;">检查医院：</span><span style="display: inline-block;width: 70%;">'+v.hospital+'</span></li> <li><span style="display: inline-block;width: 30%;">就诊人：</span><span style="display: inline-block;width: 70%;">'+v.patient_name+'<b> | </b>'+sex+'<b> | </b>'+v.age+'岁</span></li> <li><span style="display: inline-block;width: 30%;">服务项目：</span><span style="display: inline-block;width: 70%;">查看电子影像</span></li> <li><span style="display: inline-block;width: 30%;">服务费用：</span><span style="display: inline-block;width: 70%;">'+res.price+'元</span></li></ul>'
            //         self.$dialog.confirm({
            //             title: '',
            //             message: msg,
            //             messageAlign: 'left',
            //             className: 'vant-user-msg',
            //             confirmButtonText: '确定支付',
            //         }).then(() => {
            //             self.wxbuy(v)
            //         }).catch(() => {
            //             console.log('no')
            //         });
            //     } else if (res.code == 1) {
            //         window.location.href = res.yx_url
            //     } else {
            //         self.$toast({
            //             message: res.msg,
            //             position: 'middle',
            //             duration: 2000
            //         });
            //     }
            // })
            
        },
        // wxbuy (v) {
        //     var self = this;
        //     if (!self.$isMoble) {
        //         self.$toast({
        //             message: '请在手机微信端下单支付',
        //             position: 'middle',
        //             duration: 3000
        //         });
        //         return;
        //     }
        //     self.$http.post('/mobile/WxSeeImage/user_image_pay', { userid: this.uid, exam_id: v.exam_id , idcard: v.idcard }).then(response => {
        //         console.log(response)
        //         if (response.code == 1) {
        //             self.wxsjk(response.data)
        //             self.order_code = response.data.order_code; // 获取订单号
        //             self.yx_url = response.data.yx_url;         // 获取支付成功后的跳转链接
        //         } else {
        //             self.$toast({
        //                 message: response.msg,
        //                 position: 'middle',
        //                 duration: 2000
        //             });
        //         }
        //     })
        // },
        // wxsjk (data) {  // 调起微信支付
        //     var self = this;
        //     if (typeof WeixinJSBridge == "undefined") {
        //         if( document.addEventListener ){
        //             document.addEventListener('WeixinJSBridgeReady', onBridgeReady(data), false);
        //         }else if (document.attachEvent){
        //             document.attachEvent('WeixinJSBridgeReady', onBridgeReady(data)); 
        //             document.attachEvent('onWeixinJSBridgeReady', onBridgeReady(data));
        //         }
        //     }else{
        //             onBridgeReady(data);
        //     }
        //     function onBridgeReady(data) {
        //         console.log(data)
        //         WeixinJSBridge.invoke (
        //             'getBrandWCPayRequest', {
        //                 debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        //                 "appId": data.appId,     //公众号名称，由商户传入     
        //                 "timeStamp": data.timeStamp,         //时间戳，自1970年以来的秒数     
        //                 "nonceStr": data.nonceStr, //随机串     
        //                 "package": data.package,     
        //                 "signType": data.signType,         //微信签名方式：     
        //                 "paySign": data.paySign //微信签名 
        //             },
        //         function(res){
        //            WeixinJSBridge.log(res.err_msg);
        //             if(res.err_msg == "get_brand_wcpay_request:ok"){
        //             // 使用以上方式判断前端返回,微信团队郑重提示：
        //                     // res.err_msg将在用户支付成功后返回ok，但并不保证它绝对可靠。
                            
        //                     var t = setTimeout(function () {
        //                         self.isSuccess()
        //                        clearTimeout(t)
        //                     }, 1000)
                            
        //             } else {
        //                 self.$toast({
        //                     message: '支付失败！',
        //                     position: 'middle',
        //                     duration: 2000
        //                 });
        //                 var errt = setTimeout(function () {
        //                     // self.$router.replace({ path: '/userPayMsgRecordDetail', query: { id: self.order_code }});    // 跳转付费问诊详情页
        //                     clearTimeout(errt)
        //                 }, 1500)
        //             }
                    
        //         }); 
        //     };
        // },
        // isSuccess () {  // 是否支付成功
        //     var self = this;
        //     self.$http.post('/mobile/wxchat/order_inquiry', { order_code: self.order_code }).then(res => {
        //         if (res.code == 1) {
        //             self.$toast({
        //                 message: '支付成功！',
        //                 position: 'middle',
        //                 duration: 2000
        //             });
        //             window.location.href = self.yx_url     // 成功后跳转到影像页    
        //         } else {
        //             self.$toast({
        //                 message: res.msg,
        //                 position: 'middle',
        //                 duration: 2000
        //             });
        //         }
        //     })
        // }
    }
}
</script>
<style lang="scss" scoped>
@function rem($px) {
    @return $px/100+rem;
}
.electronicImage {
    width: 100%;
    height: 100%;
    font-size: rem(28);
    background-color: #F4F4F4;
    &-box {
        width: 100%;
        overflow-y: scroll;
        &-content {
            width: 100%;
            margin-bottom: rem(10);
            .content-empty {
                width: 100%;
                text-align: center;
                margin-top: rem(201);
                img {
                    width: rem(300);
                    height: rem(300);
                }
                p {
                    font-size: rem(28);
                    margin-top: rem(30);
                    color: #808080;
                    span {
                        color: #469AF4;
                    }
                }
                div {
                    width: 100%;
                    margin-top: rem(60);
                    text-align: center;
                    button {
                        width: rem(240);
                        height: rem(72);
                        border: 1px solid #469AF4;
                        color: #469AF4;
                        font-size: rem(28);
                    }
                }
            }
            
            .content-wrap {
                width: 100%;
                padding: 0 rem(30);
                .head-msg {
                    width: 100%;
                    padding: rem(10) 0;
                    font-size: rem(28);
                    color: #333;
                    margin-top: rem(20);
                }
                .content-wrap-user {
                    margin-top: rem(20);
                    width: 100%;
                    .user-info {
                        height: rem(140);
                        padding-left: rem(30);
                        -webkit-border-radius:rem(10) rem(10) rem(20) rem(20);
                        border-radius:rem(10) rem(10) rem(20) rem(20);
                        position: relative;
                        border-bottom: 1px dashed #E6E6E6;
                        h1 {
                            font-size: rem(32);
                            line-height: rem(140);
                            color: #333;   
                            b {
                                color:#E0E0E0;
                            }
                        }
                        > .user-pic {
                            position: absolute;
                            right: rem(30);
                            top: rem(30);
                            display: block;
                            width: rem(80);
                            height: rem(80);
                            -webkit-border-radius: 100%;
                            border-radius: 100%;
                            > img {
                                width: 100%;
                                height: 100%;
                                -webkit-border-radius: 100%;
                                border-radius: 100%;
                            }
                            >p {
                                width: rem(80);
                                height: rem(80);
                                min-width: rem(80);
                                text-align: center;
                                background-color: #5189F6;
                                color: #fff;
                                font-size: rem(24);
                                border: 1px solid #ccc;
                                -webkit-border-radius: 100%;
                                border-radius: 100%;
                                > span {
                                    display: block;
                                    text-align: center;
                                }
                            }
                        }
                    }
                    .ul-border {
                        width: 100%;
                        -webkit-border-radius:rem(20) rem(20) rem(10) rem(10);
                        border-radius:rem(20) rem(20) rem(10) rem(10);
                    
                    >ul {
                        width: 100%;
                        padding: rem(30);
                        h2 {
                            color: #333;
                            line-height: rem(47);
                            b {
                                color: #FF9A83;
                                font-size: rem(24);
                            }
                        }
                        li {
                            font-size: rem(24);
                            line-height: rem(50);
                            overflow: hidden;
                            span:first-child {
                                color: #808080;
                            }   
                            .Color-black {
                                color:#333;
                                margin-left: rem(30);
                            }
                            div {
                                float: right;
                                button {
                                    border: #469AF4 1px solid;
                                    font-size: rem(22);
                                    color: #469AF4;
                                    height: rem(50);
                                    line-height: rem(50);
                                    padding: 0 rem(8);
                                    background-color: #fff;
                                }
                                .SpecialistCheck {
                                    margin-left: rem(20);
                                }
                            }
                        }
                    }
                }
                    
                }
            }
        }
    }
    &-footer {
        width: 100%;
        height: rem(138);
        padding: rem(20) rem(30);
        button {
            width: 100%;
            height: 100%;
            background-color: #009BFB;
            color: #fff;
            font-size: rem(32);
        }
    }
}
</style>