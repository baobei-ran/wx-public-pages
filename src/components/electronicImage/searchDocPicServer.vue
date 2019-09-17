<template>
    <!-- 购买医生影像查看服务 -->
    <div class="doctor dis_f flex_d">
        <div class="header_box">
            <div class="header_search dis_f flex_i dis_sb">
                <input class="search_txt flex1" type="search" v-model="searchVal" @keyup.enter="searchs"   placeholder="搜索医生、科室、疾病">
                <label for="" @click='searchs'>搜索</label>
            </div>
        </div>
        
    <div class="section flex1" ref='scroll' >
        <div class="section_box"  >
            <div class="kong" v-if='!datalist.length'>
                <img src="../../common/img/pic_zwys.png" alt="">
                <p>无数据</p>
            </div>
        
            <div class="doctor_list" v-if='datalist.length'>
                <van-list  v-model="busy" :finished="finished" :finished-text="txtMsg"  @load="loadMore" >
                    <div class="list" v-for='(val,i) in datalist' :key='i' >
                        <ul @click='Clickdetail(val.did, i)'>
                            <li>
                                <span>
                                    <img v-lazy="$http.baseURL+val.picture" alt="" />
                                </span>
                                <dl>
                                    <dt>
                                        <span>{{ val.true_name }}</span>
                                        <b>{{ val.gname }} | {{ val.department_name }}</b>
                                    </dt>
                                    <dd>
                                        <p>患者数量 <span>{{ val.fw_doc }}</span></p>
                                        <p>平均回复时长 <span>{{ val.reversion_rate }}</span></p>
                                    </dd>
                                </dl>
                            </li>
                            <li class="dw_r" v-if='false'></li>
                            <li class="beadeptat ">擅长：<span> {{ val.title }}</span></li>
                        </ul>
                        <dl class="dls dis_f flex_i dis_sb">
                            <dt>
                                阅片服务价格 <span>¥{{ val.ask_money }}/次</span>
                            </dt>
                            <dd>
                                <van-button size='small' @click='handleDiagosisRoom(val)' plain hairline type="primary">购买阅片服务</van-button>
                            </dd>
                        </dl>
                    </div>
                </van-list>
            </div>
        </div>
            
    </div>
        <div style='width:100%;height: 200px; display: none;' id="mapContainer"></div>
    </div>
</template>

<script>
// 节流函数 搜索功能
const delay = (function() {
  var timer = 0;
  return function(callback, ms) {
    clearTimeout(timer);
    timer = setTimeout(callback, ms);
  };
})();

export default {
    data () {
        return {
            Visible: false,
            searchVal: '',      // 搜索内容
            datalist: [],    // 数据列表
            page: 1,
            limit: 10,
            loading: false,
            allLoaded: false,
            bottomStatus: '',
            fanhui: true,           // 返回按钮
            dropDown: false,        // 下拉
            busy: false,
            timerId: '',            // 滚动时间
            exam_id: this.$route.query.examid,  // 影像 id
            idcard: this.$route.query.idcard,   // 用户 身份证
            docId: '',              // 选择的医生did
            order_code: '',         // 订单号
            finished: false,
            txtMsg: '',
        }
    },
    watch: {
        searchVal() {
            delay(() => {
                this.searchs();
            }, 500);
        },
    },
    created () {
        var urldata = this.$route.query
        if (urldata.uid) {
            this.fanhui = false
            this.$cookie.set('userLogins', urldata.uid, 365)
            var self = this;
            self.$http.post('/mobile/wxauth/is_auth', { uid: urldata.uid}).then(res => {
                console.log(res)
                if (res.code == 1) {
                    if (res.auth == 3) {
                        self.$router.replace('/phone?uid='+urldata.uid)
                        return;
                    } 
                    if (res.auth == 2 ) {
                        self.$router.replace('/authentication')
                    }
                }
            })
        } else {
            this.fanhui = true
        }
    },
    mounted () {
       this.initdata();
    },
    activated () {
        this.$refs.scroll.scrollTop = this.$route.meta.y 
        var _this = this;
        this.$refs.scroll.addEventListener('scroll',_this.justifyPos,true )
    },
    deactivated () {
        // 当组件销毁的时候，移除滚动行为监听, 清空定时器；
        // 该方法是绑定到 window 身上，即使跳转到其他组件，仍然会监听页面的滚动行为
        var _this = this;
        this.$refs.scroll.removeEventListener('scroll', _this.justifyPos, true)
        clearTimeout(this.timerId)
    },
    methods: {
       justifyPos (e) {         // 获取滚动的位置信息
                    // 节流；
            if (this.timerId) clearTimeout(this.timerId)
            this.timerId = setTimeout(() => {
                // 获取页面滚动距离之后设置给当前路由的 元信息
                var _this = this;
                this.$route.meta.y = e.target.scrollTop
            }, 300)
        },
    loadMore: function() {
        this.page += 1
        this.initdata()
    },
        searchs () {    // 搜索
            this.$refs.scroll.scrollTop = 0 // 搜索的时候滚动的top值为零
            var self = this;
            var obj = {page: 1, num: 10, name: this.searchVal }
            self.$http.post('/mobile/WxSeeImage/doc_more', obj).then(res => {
                 console.log(res)
                    self.busy = false
                if (res.code == 1) {
                    self.datalist = res.data
                    self.filterTimes(self.datalist);
                    if (self.datalist.length == res.counts) {
                        if (self.datalist.length > 5) {
                            self.txtMsg = '没有更多数据了'
                        } else {
                            self.txtMsg = ''
                        }
                        self.finished = true
                    } else {
                        self.finished = false
                    }
                } else {
                    self.datalist = []
                    self.finished = true
                }
            })
        },
        initdata () {
            var self = this;
            var obj = { page: this.page, num: this.limit, name: this.searchVal };
            self.$http.post('/mobile/WxSeeImage/doc_more', obj).then(res => {     
                console.log(res)
                    self.busy = false
                if (res.code == 1) {
                   if (self.page <= 1) {
                        self.datalist = res.data
                   } else if (self.page > 1) {
                       var list = res.data
                      self.datalist = self.datalist.concat(list)
                        if (self.datalist.length == res.counts) {
                            self.busy = false
                            if (self.datalist.length > 5) {
                                self.txtMsg = '没有更多数据了'
                            } else {
                                self.txtMsg = ''
                            }
                            self.finished = true
                        } else {
                            self.finished = false
                        }
                   } 
                   self.filterTimes(self.datalist);
                } else {
                   if (self.datalist.length > 9) {
                      self.txtMsg = '没有更多数据了'
                   } else {
                       self.txtMsg = ''
                   }
                   self.finished = true
                   self.busy = false
                }
            })
        },
        filterTimes (data) {
            if (data.length <= 0) {
                return;
            }
            data.map(val => {
                if (val.reversion_rate > (60*60*5)) {
                    var tis = (val.reversion_rate / 60 / 60);
                    if (tis > 5 && tis < 10 ) {
                        val.reversion_rate = '5~10min';
                    } else if (tis > 10 && tis < 20) {
                        val.reversion_rate = '10~20min'
                    } else if (tis > 20 && tis < 30) {
                        val.reversion_rate = '20~30min'
                    } else if (tis > 30 && tis < 40) {
                        val.reversion_rate = '40~50min'
                    } else {
                        val.reversion_rate = '60min'
                    }
                } else {
                    var num = '5min内'
                    val.reversion_rate = num;
                }
                
            })
        },
        Clickdetail (id, i) {       // 单机对应医生进入详情
            this.$router.push({path: '/doctordetail', query:{id : id, index: i}})
        },
        handleDiagosisRoom(data) {  // 购买阅片服务
            this.docId = data.did;
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
                var obj = { did: data.did, userid: self.$cookie.get('userLogins'), exam_id: self.exam_id , idcard: self.idcard , money: data.ask_money };
                console.log(obj)
                self.$http.post('/mobile/WxSeeImage/buy_doctor_image_pay', obj).then(res => {
                    console.log(res)
                    if (res.code == 1) {
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
                            self.$router.push({path: '/userPayMsgRecordDetail', query: {id: self.order_code }})    
                        }, 1500)
                    }
                    
                }); 
            };
        },
        isSuccess () {  // 支付是否成功接口
            var self = this;
            self.$http.post('/mobile/wxchat/order_inquiry', { order_code: self.order_code }).then(res => {
                if(res.code == 1) {
                   self.$router.push({path: '/chatroom', query: {did: self.docId , uid: self.$cookie.get('userLogins') }})  // 支付成功进入聊天页   
                } else {
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
        
    }
}
</script>

<style lang='scss' >
@function rem($px) {
    @return $px / 50 + rem;
}
  
            .mint-searchbar-core {
                font-size: rem(14);
                line-height: rem(28);
                height: rem(28);
            }
    .mint-searchbar-core::-webkit-input-placeholder {
                line-height: rem(20);
                font-size: rem(13);
                margin-bottom: rem(5);
        }
            
    .mint-searchbar-core:-moz-placeholder { 
        font-size: rem(13);
        line-height: rem(20);
        margin-bottom: rem(5);
    }
    .mint-searchbar-core::-moz-placeholder { 
        font-size: rem(13);
        line-height: rem(20);
        margin-bottom: rem(5);
    }
    .mint-searchbar-core:-ms-input-placeholder {
        font-size: rem(13);
        line-height: rem(20);
        margin-bottom: rem(5);
    }
</style>
<style lang="scss" scoped>
@function rem($px) {
    @return $px / 50 + rem;
}
.doctor {
    width: 100%;
    height: 100%;
    background: #F0F0F0;
    font-size: rem(14);
    .header_box {
        width: 100%;
        
    .header_search {
        background-color: #fff;
        padding: rem(15);
        .search_txt {
            // width: 86%;
            height: rem(30);
            -webkit-appearance:none;
            -webkit-border-radius: rem(20);
            -moz-border-radius:rem(20);
            -ms-border-radius:rem(20);
            -o-border-radius:rem(20);
            border-radius: rem(20);
            border:1px solid #f5f6f6;
            background: #F5F6F6 url('../../common/img/icon_ss.png') no-repeat left center;
            background-size: 8%;
            color: #333;
            padding: 0 rem(35);
            background-position: rem(8) rem(3);
            font-size: rem(14);
        }
        

        >label {
            margin-left: rem(13);
            display: block;
            font-size: rem(14);
            color: #666;
        }
        .mint-search {
        height: rem(46);
            .mint-searchbar {
                height: 100%;
                padding: rem(8) rem(10);
                .mint-searchbar-inner {
                    height: 100%;
                    padding: 0 !important;
                }
            }
            input[type=search]::-webkit-input-placeholder {
                line-height: rem(28);
                color: #808080;
            }
            
            input[type=search]:-moz-placeholder { /* Mozilla Firefox 4 to 18 */
                color: #808080;
                line-height: rem(28);
            }
            input[type=search]::-moz-placeholder { /* Mozilla Firefox 19+ */
                color: #808080;
                line-height: rem(28);
            }
            input[type=search]:-ms-input-placeholder { /* Internet Explorer 10-11 */
                color: #808080;
                line-height: rem(28);
            }
            .mint-searchbar-core {
                font-size: rem(14);
            }
        }
    }
    

}


    
    .section {
        width: 100%;
        font-size: rem(14);
        overflow: auto;
        position: relative;
        
            
        .section_box {
            
            &::-webkit-scrollbar { 
                background-color: transparent;
            }
            .drop-up{
                width: 100%;
                height: rem(40);
                line-height:rem(40);
                text-align: center;
                font-size: rem(14);
                color:#CCC;
            }
        .kong {
            text-align: center;
            padding: rem(61) 0;
            img {
                width: rem(125);
                display: block;
                margin: 0 auto;
            }
            >p {
                text-align: center;
                color: #808080;
                margin-top: rem(26);
            }
        }
        .doctor_list {
            width: 100%;
            font-size: rem(12);
            padding: 0 rem(15);
          .list {
                width: 100%;
                box-shadow:0px 2px 5px 0px rgba(0, 0, 0, 0.1);
                margin-top: rem(10);
                -webkit-border-radius:rem(4);
                border-radius: rem(4);

            >ul {
                width: 100%;
                padding: rem(15);
                background:rgba(255,255,255,1);
                border-bottom: 1px solid #E6E6E6;
                position: relative;
                .beadeptat {
                    padding-top: rem(10);
                }
                li:first-child {
                    display: -webkit-flex;
                    display: flex;
                    >span {
                        display: block;
                        width: rem(50);
                        height: rem(51);
                        -webkit-border-radius: 100%;
                        border-radius: 100%;
                        overflow: hidden;
                        img {
                            width: auto;
                            min-height: 100%;
                        }
                    }
                    >dl {
                        flex: 1;
                        padding-left: rem(15);
                        dt {
                            line-height: rem(30);
                            span {
                                margin-right: rem(8);
                                color:#333;
                                font-size: rem(16);
                            }
                            b {
                                color: #808080;
                                font-size: rem(12);
                            }
                        }
                        dd {
                            font-size: rem(12);
                            color: #333;
                            line-height: rem(20);
                            overflow: hidden;
                            p {
                                float: left;
                                span {
                                    color: #4A9CF3;
                                }
                            }
                            P:last-child {
                                margin-left: rem(15);
                            }
                        }
                    }
                }
                .juli {
                    position: absolute;
                    right: rem(10);
                    top: rem(25);
                }
                .dw_r {
                    position: absolute;
                    right: 0;
                    top: rem(17);
                    width: rem(60);
                    height: rem(19);
                    line-height: rem(19);
                    text-align: center;
                    color: #fff;
                    font-size: rem(12);
                    padding-top: rem(1);
                    z-index: 99;
                    background: url('../../common/img/bq_jwzj.png') no-repeat 0;
                    background-size: cover;
                }
                li:last-child {
                    margin-top: rem(10);
                    font-size: rem(12);
                    color: #808080;
                    line-height: rem(18);
                }
            }
            .dls {
                width: 100%;
                padding: 0 rem(15);
                height: rem(41);
                font-size: rem(12);
                background-color: #fff;
                dt {
                    color: #333;
                    >span {
                        color: #F09F88;
                    }
                }
                dd {
                    button {
                        color: #4A9CF3;
                        border-color: #4A9CF3;
                    }
                }
            }
          }
        }
    }
    }
    
}
</style>
