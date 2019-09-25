<template>
    <!-- 影像查询详情 -->
    <div class="electronicImage dis_f flex-v">
        <div class="electronicImage-box flex1">
            <div class="electronicImage-box-content">
                <!-- 无内容展示 -->
                <div class="content-empty" v-show="isView">
                        <img src="../../common/img/pic_zwyx@2x.png" alt="" />
                        <p><span v-show='false' class="color_blue">就诊人李大牛</span>暂无影像资料</p>
                        <div><mt-button @click.native="handleCheckImage">查看影像示例</mt-button></div>
                        <div><mt-button @click.native="handleCheckImg">查看DSA示例</mt-button></div>
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
                                    <div v-show='val.image_type == 2'>
                                        <mt-button class="bg-f" @click.native="handleClickBuy(val)">支付查看</mt-button>
                                    </div>
                                    <!-- -->
                                    <div v-show='val.image_type == 1'>
                                        <mt-button class="bg-f" @click.native="handleClickLookOver(val.yx_url)">立即查看</mt-button>
                                        <mt-button class="bg-f SpecialistCheck" v-if="!status" @click.native="handleSpecialistCheck(val)">专家阅片</mt-button>
                                        <mt-button class="bg-f SpecialistCheck" v-if='status' @click.native="handleBuy(val)">专家阅片</mt-button>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="electronicImage-footer">
            <mt-button @click.native="handleClickImage">查看其他就诊人的电子影像</mt-button>
        </div>
        <mt-popup v-model="popupVisible" style="width: 100%" position="bottom" @touchmove.prevent>
            <PopupMsg v-if="popupVisible"  @shadehide='shadehide' @handleUserImage='handleUserImage'/>
        </mt-popup>
    </div>
</template>
<script>
export default {
    components: {
        PopupMsg: () => import('./modules/popupMsg')
    },
    data () {
        return {
            isViewUser: false,                      // 数据展示
            isView: false,                          // 无数据展示
            popupVisible: false,
            imageList: [],                          // 数据
            uid: '',                                // 用户uid
            order_code: '',                         // 订单号
            yx_url: '',                             // 支付成功跳转链接
            status: this.$route.query.status || 0,  // 专家阅片标记
            did: '',                                // 医生 id
            price: 50,                              // 阅片价格
            order_code: '',                         // 下单 单号  
            isClassify: false,                      // 下单分别
        }
    },
    created () {
        var docid = this.$route.query.did;
        if (docid) {
            this.did = docid
        }
        var price = this.$route.query.money;
        if (price) {
            this.price = price
        }
                //  检测是否认证
        var self = this;
        var id = this.$route.query.uid;
        if (id) {
            self.$http.post('/mobile/wxauth/is_auth', { uid: id}).then(res => {
            // console.log(res)
                if (res.code == 1) {
                    if (res.auth == 3) {
                        self.$router.replace('/phone?uid='+id)
                        return;
                    } 
                    if (res.auth == 2 ) {
                        self.$router.replace('/authentication')
                    }
                }
            })
        }
    },
    mounted () {
        var uids = this.$route.query.uid;
        if (uids) {
            this.$cookie.set('userLogins', uids, 365)
            this.uid = uids;
            if (this.$isIos()) {
                var homeUrl = window.location.href;
                this.$storage.set('chatRoom', homeUrl)
            }
        }
       this.initdata()
    },
    methods: {
        handleCheckImage () { // 查看影像
            window.location.href = this.$ImageUser2;
        },
        handleCheckImg () { // 查看影像 dsa
            window.location.href = this.$userImage;
        },
        initdata () {
            this.$indicator.open({
                text: '',
                spinnerType: 'fading-circle'
            });
            var self = this;
            self.$http.post('/mobile/WxSeeImage/see_electronic_image', { userid: self.uid }).then(res => {
                console.log(res)
                self.$indicator.close();
                if (res.code == 1) {
                    self.imageList = res.data;
                    self.isView = false;
                    self.isViewUser = true;
                    if (res.data.length <=0 ) {
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
        handleSpecialistCheck(val) {   // 专家阅片（去搜索页）
            console.log(val)
            this.$cookie.set('BuyExpertImage', JSON.stringify(val), 1);
            this.out('/searchDocPicServer?examid='+val.exam_id+'&idcard='+val.idcard+'&study_id='+val.study_id)
        },
        handleBuy (val) {  // 专家阅片购买
            console.log(val)
            var self = this;
            var msg = '<div style="color:#333;"><p>1、购买阅片服务后，医生即可查看就诊人的电子影像资料，并根据影像给予诊疗建议。</p><p style="margin-top: 0.27rem;">2、阅片服务时长默认为24小时/次，在此期间医生可发起结束阅片申请，经患者同意后，阅片服务自动结束。</p><p style="margin-top: 0.27rem;">3、患者支付后，医生将在30分钟内回复您，若超时将自动为您退诊，返还问诊费用。</p><p style="margin-top: 0.27rem;">4、在阅片服务过程中，若医生擅长专业与患者疾病不符，医生将为您退诊，退诊后返回问诊费用。</p></div>'
            this.$dialog.confirm({
                title: '服务须知',
                message: msg,
                messageAlign: 'left',
                className: 'vant-dialog-box',
                confirmButtonText: '购买医生的阅片服务',
            }).then(() => {
                if (!self.$isMoble) {
                    self.$toast({
                        message: '请在手机微信端下单支付',
                        position: 'middle',
                        duration: 3000
                    });
                    return;
                }
                var obj = { did: self.did, userid: self.uid, exam_id: val.exam_id, idcard: val.idcard, money: self.price, study_id: val.study_id, hos_info: JSON.stringify(val) };
                console.log(obj)
                self.$http.post('/mobile/WxSeeImage/buy_doctor_image_pay', obj).then(res => {
                    console.log(res)
                    if (res.code == 1) {
                        self.isClassify = true;
                        self.wxsjk(res.data);
                        self.order_code = res.data.order_code;
                    } else {
                        self.$toast({
                            message: res.msg,
                            position: 'middle',
                            duration: 3000
                        });
                    }
                })
            }).catch(() => {
                console.log('no')
            });
        },
        handleClickImage () {      // 查看其他就诊人
            this.popupVisible = true
        },
        handleUserImage (data) {    // 接收子组件的值
            this.popupVisible = data.isShow;
            console.log(data)
            var self = this;
            this.$http.post('/mobile/WxSeeImage/add_patient_see_image', { userid: this.uid,type: data.tabInfo.id ,name:data.userName ,idcard:data.userCard }).then(res => {
                console.log(res)
                if (res.code == 1) {
                    self.initdata()
                } else {
                    self.$messagebox({
                        title: '',
                        message: '<p style="color:#333;">'+res.msg+'</p>',
                        confirmButtonText: '好的',
                        confirmButtonClass: 'mint-confirm-btn'
                    });
                }
            })
        },
        shadehide (hide) {
            this.popupVisible = hide;
        },
        handleClickBuy (v) { // 支付查看
            // console.log(v)
            this.$cookie.set('BuyImage', JSON.stringify(v), 1);
            this.$router.push('/buyImage?uid='+this.uid);
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
                            }, 1000)
                            
                    } else {
                        self.isClassify = false;
                        self.$toast({
                            message: '支付失败！',
                            position: 'middle',
                            duration: 2000
                        });
                        var tt = setTimeout(function () {
                            self.$router.push({path: '/userPayMsgRecordDetail', query: {id: self.order_code }})  
                            clearTimeout(tt)  
                        }, 1500)
                    }
                    
                }); 
            };
        },

        isSuccess () {  // 支付是否成功接口
            var self = this;
            self.$http.post('/mobile/wxchat/order_inquiry', { order_code: self.order_code }).then(res => {
                if(res.code == 1) {
                    self.$toast({
                        message: '支付成功！',
                        position: 'middle',
                        iconClass: 'iconfont icon-tipssuccess',
                        duration: 1000
                    });
                    if(self.status && self.isClassify) {
                        self.$router.push({path: '/chatroom', query: {did: self.did , uid: self.uid }})  // 支付成功进入聊天页
                    } else {
                        window.location.href = self.yx_url // 影像页
                    }
                } else {
                    self.isClassify = false;
                    self.$toast({
                        message: '支付失败！',
                        position: 'middle',
                        duration: 2000
                    });
                    self.$router.push({path: '/userPayMsgRecordDetail', query: {id: self.order_code }})    
                }
            }).catch(err => {
                self.$toast({
                    message: '服务器错误',
                    position: 'middle',
                    duration: 2000
                });
            })
        }
        
    },
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
        -webkit-overflow-scrolling: touch;
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
                        display: inline-block;
                        width: rem(240);
                        height: rem(72);
                        border: 1px solid #469AF4;
                        color: #469AF4;
                        font-size: rem(28);
                    }
                }
                div:last-child {
                    margin-top: rem(30);
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