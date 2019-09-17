<template>
    <!-- 购买问诊服务 -->
    <div class="buyWebImInfo dis_f flex-v">
        <div class="buyWebImInfo-box flex1">
            <div class="buyWebImInfo-box-content">
                <div class="content-head bg-f">
                    <ul>
                        <li>
                            <span>医生姓名</span>
                            <span>{{ docInfo.dname }}</span>
                        </li>
                        <li>
                            <span>所在医院</span>
                            <span>{{ docInfo.hname }}</span>
                        </li>
                        <li>
                            <span>问诊价格</span>
                            <span>¥{{ docInfo.ask_money }}/次</span>
                        </li>
                    </ul>
                </div>
                <div class="content-user-info bg-f">
                    <ul>
                        <li>
                            <span><i class="color_red">*</i>就诊人</span>
                            <span @click='gethander' class="F-r" v-html='user_val?user_val.real_name:"<b style=color:#808080; >请选择就诊人</b>"' >李二牛（本人）</span>
                        </li>
                        <li>
                            <span>最近一次医院就诊时间</span>
                            <span class="F-r" @click='selectdete' v-html='dateTime? dateTime:"<b style=color:#ccc;>请选择就诊时间（非必填）</b>"'></span>
                        </li>
                        <li>
                            <span>就诊医院</span>
                            <input class="F-r" type="text" v-model="hospital" placeholder="请填写就诊医院" />
                        </li>
                        <li>
                            <span>就诊科室</span>
                            <input class="F-r" type="text" v-model="office" placeholder="请填写就诊科室" />
                        </li>
                        <li>
                            <span>确认疾病</span>
                            <input class="F-r" type="text" v-model="illness" placeholder="填写医院确认疾病" />
                        </li>
                        <li class="user-describe">
                            <span><i class="color_red">*</i>病情描述</span>
                            <textarea v-model="describeMsg" placeholder="填写您的病情描述如曾经做过的检查、用药情况等，有助于医生进一步了解您的病情"></textarea>
                        </li>
                    </ul>
                </div>
                <div class="content-user-img bg-f">
                    <h2>病情照片 <span>您可上传化验单、检查资料、报告单、处方单等等</span></h2>
                    <ol class="dis_f">
                        <li v-for="(val,i) in UserImg" :key='i'><img :src="val.pic" alt="" /><img @click='cancelImg(val.id)' class="cancelBtn" src="../../common/img/icon_sc2.png" alt="" /></li>
                        <li v-if=' UserImg.length < 4' ><input type="file" id="upImg" multiple @change='onChangeFileImg($event)' accept="image/*" /><label for='upImg'><img src="../../common/img/pic_tjtp.png" alt="" /></label></li>
                    </ol>
                </div>
            </div>
        </div>
        <div class="footer" v-show="btnShow">
            <mt-button @click.native="handleClickServe">购买<i>{{ docInfo.dname }}</i>医生的问诊服务</mt-button>
        </div>
        <!-- 日期选择 -->
        <mt-datetime-picker
            ref="picker1"
            type="date"
            year-format="{value} 年"
            month-format="{value} 月"
            date-format="{value} 日"
            :startDate="startDate"
            @confirm="handleConfirm">
        </mt-datetime-picker>
    </div>
</template>
<script>
export default {
    name: 'buyWebImInfo',
    data () {
        return {
            bodyShow: document.documentElement.clientHeight,
            docShow: document.documentElement.clientHeight,
            btnShow: true,                      // 控制底部按钮
            startDate: new Date('2019-01-01'),  // 开始日期
            cure_time: '',  // 后台传送日期
            dateTime: '',   // 显示日期
            fileImg: [],    // 向后台传送的文件
            UserImg: [],    // 页面展示的图片
            user_val: '',   // 就诊人信息
            hospital: '',   // 医院
            office: '',     // 科室
            illness: '',    // 疾病
            describeMsg: '',    // 病情描叙
            uid: '',
            did: '',
            docInfo: {},    // 医生信息
            order_code: '',    // 支付时获取的订单号
        }
    },
    created () {
        var userId = this.$route.query.uid;
        if (userId) {
            this.uid = userId
        }
        var did = this.$route.query.did;
        if (did) {
            this.did = did
        }
    },
    mounted () {
        var self = this;
        window.onresize = function () {
            return (function (){
                self.bodyShow = document.body.clientHeight;
            })()
        }
        // 获取就诊人
        var Val = JSON.parse(this.$cookie.get('administrationVal'));
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

        this.$http.post('/mobile/Wxchat/inquiry_look', { uid: this.uid, did: this.did }).then(res => {
            console.log(res)
            if (res.code == 1) {
                self.docInfo = res.data
            }
        })
        if (this.$isIos()) {
            console.log('yes')
            document.body.addEventListener('touchmove', function (e) {
                if(document.activeElement) {
                    document.activeElement.blur();
                }
                var node = document.activeElement; //当前focus的dom元素
                if (node) {
                    if (node.nodeName == "TEXTAREA" || node.nodeName == 'INPUT') { //如果是input或textarea
                        if (node.style.textShadow === '') {
                            node.style.textShadow = 'rgba(0,0,0,0) 0 0 0'; //改变某个不可见样式，触发dom重绘
                        } else {
                            node.style.textShadow = '';
                        }
                    }
                }
            }, {passive: false})
        }
    },
    watch: {
        bodyShow: function (val, newVal) {
            if (!this.$isIos()) {
                if (this.docShow > this.bodyShow) {
                    this.btnShow = false
                } else {
                    this.btnShow = true
                }
            }
        }
    },
    methods: {
        handleClickServe () { // 提交问诊服务
            var _self = this;
            if (!this.user_val) {
                 _self.$toast({
                    message: '请选择就诊人',
                    position: 'middle',
                    duration: 2000
                });
                return;
            }
            if(!this.describeMsg) {
                _self.$toast({
                    message: '请填写病情描叙',
                    position: 'middle',
                    duration: 2000
                });
                return;
            }
            var msg = '<div style="color:#333;"><p>1、问诊时长默认为24小时/次，在此期间医生可发起结束问诊申请，经患者同意后，问诊自动结束。</p><p style="margin-top: 0.27rem;">2、患者支付后，医生将在30分钟内回复您，若超时将自动为您退诊，返还问诊费用。</p><p style="margin-top: 0.27rem;">3、在问诊过程中，若医生擅长专业与患者疾病不符，医生将为您退诊，退诊后返回问诊费用。</p></div>'
            this.$dialog.confirm({
                title: '问诊须知',
                message: msg,
                messageAlign: 'left',
                className: 'vant-dialog-box',
                confirmButtonText: '购买医生的问诊服务',
            }).then(() => {
                 if (!_self.$isMoble) {
                    _self.$toast({
                        message: '请在手机微信端下单支付',
                        position: 'middle',
                        duration: 3000
                    });
                    return;
                }
                _self.$indicator.open({
                    text: '购买提交中...',
                    spinnerType: 'fading-circle'
                });
                this.docServerBuy()
            }).catch(() => {
                console.log('no')
            });
        },
        docServerBuy () {   // 
            var self = this, formdata = new FormData();
            formdata.append('uid', self.uid);
            formdata.append('did', self.did);
            formdata.append('cid', self.user_val.id);
            formdata.append('time', self.cure_time);
            formdata.append('hos', self.hospital );
            formdata.append('dep', self.office );
            formdata.append('disease', self.illness);
            formdata.append('remark', self.describeMsg);
            self.fileImg.map(val => {
                formdata.append('file[]', val.f);
            }) 
            self.$http.formdata('/mobile/Wxchat/inquiry', formdata).then(res => {
                console.log(res)
                self.$indicator.close();
                if (res.code == 1) {
                    self.order_code = res.data.order_code
                    self.wxsjk(res.data)
                } else if (res.code == 5) {
                    self.$toast({
                        message: res.msg,
                        position: 'middle',
                        duration: 2000
                    });
                    self.$router.replace('/userPayMsgRecordList')
                } else {
                    self.$toast({
                        message: res.msg,
                        position: 'middle',
                        duration: 2000
                    });
                }
            }).catch(err => {
                console.log(err)
                self.$indicator.close();
                self.$toast({
                    message: '服务器发生错误，无法支付',
                    position: 'middle',
                    duration: 2000
                });
            })
        },
        gethander: function () {  // 获取 就诊人员
            this.out('/getAdministration')
        },  
        handleConfirm (value) {     // 获取日期
            var year = value.getFullYear();
            var month = value.getMonth() + 1;
            var date = value.getDate();
            this.dateTime = year+'年'+ month+'月'+date+'日';
            this.cure_time = year+'-'+month+'-'+date
        },
        selectdete () { // 弹起日期选择
            this.$refs.picker1.open();
        },
        onChangeFileImg(e) { // 图片、文件获取
            var self = this;
            var files = e.target.files || e.dataTransfer.files;
            if (!files.length) return;
            var id3 = (Math.random())+'s';
            var reader = new FileReader();
            var o3 = { id: id3, f:files[0] }
            self.fileImg.push(o3);
            reader.onload = (e) => {
                self.getBase64(e.target.result).then(file => {
                    var obj3 = { id: id3, pic: file }
                    self.UserImg.push(obj3)
                })
            }
            reader.readAsDataURL(files[0]);
            e.target.value = '';
        },
        cancelImg (id) {  // 检验单图片删除
            var self = this;
            this.fileImg = this.fileImg.filter(val => {
                return val.id !== id
            })
            this.UserImg = this.UserImg.filter(v => {
                return v.id !== id
            })
            
        },
        getBase64(url) { // 处理图片
            var self = this;
            var Img = new Image(),
                dataURL = '';
            Img.src = url;
            var p = new Promise(function (resolve, reject) {
                Img.onload = function () { //要先确保图片完整获取到，这是个异步事件
                    var canvas = document.createElement("canvas"), //创建canvas元素
                        width = Img.width, //确保canvas的尺寸和图片一样
                        height = Img.height;
                    // 默认将长宽设置为图片的原始长宽，这样在长宽不超过最大长度时就不需要再处理
                    var ratio = width / height,
                        maxLength = 1000,
                        newHeight = height,
                        newWidth = width;
                    // 在长宽超过最大长度时，按图片长宽比例等比缩小
                    if (width > maxLength || height > maxLength) {
                        if (width > height) {
                            newWidth = maxLength;
                            newHeight = maxLength / ratio;
                        } else {
                            newWidth = maxLength * ratio;
                            newHeight = maxLength;
                        }
                    }
                    canvas.width = newWidth;
                    canvas.height = newHeight;
                    var ctx = canvas.getContext("2d");
                    ctx.fillStyle = "#fff"; // 改变canvas黑色的背景色
                    ctx.fillRect(0, 0, canvas.width, canvas.height);  
                    ctx.drawImage(Img, 0, 0, newWidth, newHeight); //将图片绘制到canvas中
                    dataURL = canvas.toDataURL('image/jpeg', 0.7); //转换图片为dataURL
                    resolve(dataURL);
                };
            });
            return p
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
                        self.$toast({
                            message: '支付失败！',
                            position: 'middle',
                            duration: 2000
                        });
                        setTimeout(function () {
                            self.$router.replace({ path: '/userPayMsgRecordDetail', query: { id: self.order_code } })
                        }, 1500)
                    }
                    
                }); 
            };
        },
        isSuccess () {  // 是否支付成功
            var self = this;
            self.$http.post('/mobile/wxchat/order_inquiry', { order_code: self.order_code }).then(res => {
                if (res.code == 1) {
                    self.$router.replace({ path: '/chatroom', query: { did: self.did, uid: self.uid } })
                } else {
                    self.$toast({
                        message: res.msg,
                        position: 'middle',
                        duration: 2000
                    });
                }
            })
        }
    },
    beforeDestroy () {
        this.$indicator.close();
        // var Val = JSON.parse(this.$cookie.get('administrationVal'));
        //     if(Val && Val.type !== 1) {
        //         this.$cookie.delete('administrationVal');
        //     }
    }
}
</script>

<style lang="scss" scoped>
@function rem($px) {
    @return $px/ 100+rem;
}
.color_red {
    color: #F93E3E;
}
.buyWebImInfo {
    width: 100%;
    height: 100%;
    font-size: rem(28);
    &-box {
        width: 100%;
        overflow-y: scroll;
        &-content {
            width: 100%;  
            .content-head {
                width: 100%;
                padding: rem(30);
                ul {
                    li {
                        font-size: rem(28);
                        padding: rem(20) 0;
                        span {
                            display: inline-block;
                            color: #333;
                            width: 70%;
                            line-height: rem(40);
                        }
                        span:first-child {
                            color:#808080;
                            width: rem(140);
                        }
                    }
                }
            }
            .content-user-info {
                margin-top: rem(20);
                padding: rem(30);
                ul {
                    li {
                        height: rem(98);
                        line-height: rem(98);
                        border-top: 1px solid #E6E6E6;
                        padding: rem(10) 0;
                        span:last-child {
                            display: inline-block;
                            min-width: 50%;
                            text-align: right;
                        }
                        input {
                            border: 0;
                            width: 70%;
                            height: rem(84);
                            color:#333;
                            outline: none;
                            text-align: right;
                            line-height: rem(40);
                        }
                    }
                    li:first-child {
                        border:0;
                    }
                    .user-describe {
                        height: auto;
                        span {
                            display: block;
                        }
                        textarea {
                            width: 100%;
                            height: rem(140);
                            padding: rem(20);
                            border: 0;
                            background-color: #F9F9F9;
                            line-height: rem(40);
                        }
                    }
                }
            }
            .content-user-img {
                margin-top: rem(20);
                padding: rem(30);
                >h2 {
                    span {
                        color: #808080;
                        font-size: rem(24);
                        margin-left: rem(15);
                    }
                }
                > ol {
                        width: 100%;
                        margin-top: rem(30);
                        li {
                            width: rem(150);
                            height: rem(150);
                            position: relative;
                            margin-right: rem(30);
                            text-align: center;
                            line-height: rem(150);
                            border: 1px dashed #eee;
                            -webkit-border-radius: rem(8);
                            border-radius: rem(8);
                            img {
                                width: 100%;
                                height: 100%;
                            }
                            .cancelBtn {
                                position: absolute;
                                top: rem(-20);
                                right: rem(-20);
                                width: rem(44);
                                height: rem(44);
                            }
                            input {
                                display: none;
                            }
                            label {
                                display: block;
                            }
                        }
                        li:last-child {
                            margin: 0;
                        }
                        .upfile {
                            border: 0;
                            img {
                                width: 100%;
                                height: 100%;
                            }
                        }
                    }
            }
        }
    }
    .footer {
        width: 100%;
        height: rem(98);
        button {
            width: 100%;
            height: 100%;
            background-color: #469AF4;
            color:#fff;
            font-size: rem(32);
        }
    }
}
</style>